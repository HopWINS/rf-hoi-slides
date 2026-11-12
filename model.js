/* RF-HOI teaching model; not measured RF data.
 * Source: Sections 3.2.2 and 3.4.3 (pp. 8, 11). The paper synthesizes phase
 * differences from adjacent-frame range changes, using a hand proxy and zero
 * phase difference for ideal static candidates. The paper has no numbered
 * phase conversion equation. This illustration uses a geometric round-trip
 * term, delta phase = 4 pi delta range / wavelength. The sign is conventional.
 * Wavelength .33 m; physical motion duration 2.4 s; sample interval .05 s.
 * These parameters are illustrative. An eight-second presentation loop maps
 * to the physical motion. We omit multipath, wrapping, antenna switching,
 * packet loss, noise, RCS and neural inference. No curve is an experiment.
 */
(function(root) {
  'use strict';
  const TAU=2*Math.PI, LOOP_SECONDS=8, DURATION_SECONDS=2.4;
  const SAMPLE_INTERVAL=.05, WAVELENGTH_METERS=.33;
  const ANTENNAS=Object.freeze([[0,-.45,1],[0,.45,1.8]]);
  const mod=(x,n)=>((x%n)+n)%n;
  const progress=t=>mod(t,LOOP_SECONDS)/LOOP_SECONDS;
  const lift=u=>.5-.5*Math.cos(TAU*u);
  function objectPosition(u) { const h=lift(u); return [1.8+.28*h,.2,.8+.24*h]; }
  const handPosition=objectPosition;
  const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
  function phaseDifference(u,antenna=0,moving=true) {
    if(!moving) return 0;
    const dt=SAMPLE_INTERVAL/DURATION_SECONDS;
    const now=distance(objectPosition(u),ANTENNAS[antenna]);
    const previous=distance(objectPosition(u-dt),ANTENNAS[antenna]);
    return 4*Math.PI*(now-previous)/WAVELENGTH_METERS;
  }
  function samples(count=49) { return Array.from({length:count},(_,i)=>{
    const u=i/(count-1); return {u,time:u*DURATION_SECONDS,phases:ANTENNAS.map((_,a)=>phaseDifference(u,a)),staticPhase:0,object:objectPosition(u),hand:handPosition(u)};
  }); }
  function state(t) { const u=progress(t); return {u,lift:lift(u),hand:handPosition(u),object:objectPosition(u),phases:ANTENNAS.map((_,a)=>phaseDifference(u,a)),motionTime:u*DURATION_SECONDS}; }
  function wipeState(t) { const u=progress(t); return {u,handX:.5+.38*Math.sin(TAU*u),speed:Math.cos(TAU*u),staticPhase:0}; }
  function inferenceState(t) { const u=progress(t); return {u,packetRadar:mod(u*4,1),packetRfid:mod(u*3.3+.15,1)}; }
  const api={LOOP_SECONDS,DURATION_SECONDS,SAMPLE_INTERVAL,WAVELENGTH_METERS,ANTENNAS,progress,lift,objectPosition,handPosition,distance,phaseDifference,samples,state,wipeState,inferenceState};
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.SlideModel=api;
})(typeof window==='object'?window:globalThis);
