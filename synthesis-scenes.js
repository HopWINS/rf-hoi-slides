/* RF-HOI synthesis explanation. Paper Secs.2.2,3.4.1–3.4.3, pp.6,10–11.
 * Four scenes separate deployment coverage, paired source geometry, radar ray
 * tracing and the RFID-specific physical approximation. All drawings are
 * explanatory. No plotted curve or return delay is an experimental result.
 *
 * Radar teaching model: a 2-D vertical cross-section, four point proxies for
 * mesh surfaces, Tx=[0,1.25]m and Rx=[0,1.05]m, c=299792458m/s. A 2.4-s
 * lift-and-return controls hand position; torso/head/leg vary slightly. Total
 * Tx–surface–Rx length determines delay; its derivative determines bistatic
 * radial velocity. No waveform/RCS/interference/multipath model is asserted.
 * RFGen uses complete 3-D meshes, rather than these four visual proxies.
 * Feature tiles denote the paper's processing stages, not invented heatmaps.
 * RFID uses the separately documented SlideModel adjacent-frame phase model.
 */
(function(){
  'use strict';
  const C={bg:'#002D72',blue:'#68ACE5',gold:'#F1C400',mint:'#96E1CD',white:'#FFFFFF',muted:'#C4D8ED',grid:'#416596'};
  const TAU=2*Math.PI,LIGHT=299792458,DURATION=2.4;
  const mod=(x,n)=>((x%n)+n)%n;
  const n=x=>Number(x).toFixed(2);
  const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{const q=clamp(x);return q*q*(3-2*q);};
  const factors=Object.freeze([{count:10,label:'rooms'},{count:20,label:'users'},{count:10,label:'positions'},{count:8,label:'headings'},{count:50,label:'HOI pairs'},{count:5,label:'repetitions'}]);
  function coverageState(t){
    const p=mod(t,14),stage=Math.min(5,Math.floor(p/1.8));
    return {stage,product:factors.slice(0,stage+1).reduce((a,f)=>a*f.count,1),total:factors.reduce((a,f)=>a*f.count,1),pose:.5-.5*Math.cos(TAU*mod(p,4)/4),room:Math.floor(p/1.1)%10,position:Math.floor(p/1.4)%10,heading:mod(p,5)/5*TAU};
  }
  function rayState(t){
    const u=mod(t,12)/12,h=.5-.5*Math.cos(TAU*u),dh=Math.PI*Math.sin(TAU*u)/DURATION;
    const tx=[0,1.25],rx=[0,1.05];
    const points=[
      {name:'Head',p:[2.10+.025*h,1.85],v:[.025*dh,0],color:C.muted},
      {name:'Torso',p:[2.10+.04*h,1.36],v:[.04*dh,0],color:C.blue},
      {name:'Hand',p:[2.65+.22*h,1.00+.45*h],v:[.22*dh,.45*dh],color:C.mint},
      {name:'Leg',p:[2.22-.02*h,.50],v:[-.02*dh,0],color:'#8AB8E6'}
    ].map(q=>{
      const d1=Math.hypot(q.p[0]-tx[0],q.p[1]-tx[1]),d2=Math.hypot(q.p[0]-rx[0],q.p[1]-rx[1]);
      const rate=((q.p[0]-tx[0])*q.v[0]+(q.p[1]-tx[1])*q.v[1])/d1+((q.p[0]-rx[0])*q.v[0]+(q.p[1]-rx[1])*q.v[1])/d2;
      return {...q,pathLength:d1+d2,delayNs:(d1+d2)/LIGHT*1e9,radialVelocity:rate/2,arrivalDegrees:Math.atan2(q.p[1]-rx[1],q.p[0]-rx[0])*180/Math.PI};
    });
    return {u,h,tx,rx,points,hand:points[2],physicalTime:u*DURATION};
  }
  function phaseState(t){
    const M=window.SlideModel,s=M.state(mod(t,12)*M.LOOP_SECONDS/12),du=M.SAMPLE_INTERVAL/M.DURATION_SECONDS;
    const now=s.hand,previous=M.handPosition(s.u-du),a=M.ANTENNAS[0];
    return {...s,now,previous,rangeNow:M.distance(now,a),rangePrevious:M.distance(previous,a),deltaRange:M.distance(now,a)-M.distance(previous,a),deltaPhase:s.phases[0],staticPhase:0};
  }
  function text(x,y,value,color=C.white,size=34,anchor='middle',weight=400){return `<text x="${n(x)}" y="${n(y)}" fill="${color}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="middle" font-weight="${weight}">${esc(value)}</text>`;}
  function path(d,color=C.white,width=4,extra=''){return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;}
  function rect(x,y,w,h,color=C.blue,opacity=.035,rx=8){return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" stroke="${color}" stroke-width="2.5" fill="${color}" fill-opacity="${opacity}"/>`;}
  function flow(points,color=C.blue,width=4){
    const d=points.map((p,i)=>(i?'L':'M')+n(p[0])+' '+n(p[1])).join(''),a=points[points.length-2],b=points[points.length-1],theta=Math.atan2(b[1]-a[1],b[0]-a[0]);
    const L=15,W=8,x=b[0]-L*Math.cos(theta),y=b[1]-L*Math.sin(theta);
    return path(d,color,width)+path(`M${n(x+W*Math.sin(theta))} ${n(y-W*Math.cos(theta))}L${n(b[0])} ${n(b[1])}L${n(x-W*Math.sin(theta))} ${n(y+W*Math.cos(theta))}`,color,width);
  }
  function dot(x,y,color=C.mint,r=6){return `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${color}"/>`;}
  function svg(name,body,description,height=520){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${height}" role="img" aria-label="${esc(description)}" style="font-family:Arial,Helvetica,sans-serif"><title>${esc(name)}</title><desc>${esc(description)}</desc>${body}</svg>`;}
  function actor(A,x,y,targetX,targetY,scale=1.2){return A.person(x,y,(targetX-x)/scale,(targetY-y)/scale,scale);}
  function meshOverlay(x,y,h){
    return path(`M${n(x-23)} ${n(y+65)}L${n(x+32)} ${n(y+66)}L${n(x-23)} ${n(y+141)}L${n(x+30)} ${n(y+154)}L${n(x-23)} ${n(y+65)}M${n(x+32)} ${n(y+66)}L${n(x+30)} ${n(y+154)}M${n(x-23)} ${n(y+141)}L${n(x+8)} ${n(y+107)}L${n(x+32)} ${n(y+66)}M${n(x+8)} ${n(y+107)}L${n(x+30)} ${n(y+154)}`,C.mint,1.8,'stroke-opacity=".65"');
  }
  function coverage(t,A){
    const s=coverageState(t),roomX=35,roomY=35,roomW=590,roomH=336;
    let o=rect(roomX,roomY,roomW,roomH,C.grid,.015,0)+text(65,70,`Room ${s.room+1} / 10`,C.muted,32,'start');
    // Ten distinct sensor-relative positions, eight headings and different room
    // backgrounds illustrate deployment axes; they are not experimental setups.
    const gx=274,gy=335;
    for(let j=0;j<2;j++)for(let i=0;i<5;i++){const k=j*5+i;o+=dot(gx+i*66,gy+j*19,k===s.position?C.mint:C.grid,k===s.position?7:4);}
    o+=A.radar(105,225,.8)+text(107,291,'Sensors',C.blue,32);
    if(s.room%3===0)o+=path('M456 99H581V284H456ZM456 154H581M456 215H581',C.grid,3);
    else if(s.room%3===1)o+=path('M452 263H586V322H452ZM467 183H566V253H467ZM481 197H548V236H481',C.grid,3);
    else o+=path('M469 86V304H580V86ZM493 112H552V160H493ZM493 191H552V270H493',C.grid,3);
    const px=292+(s.position%5)*22,scale=.98+(s.room%4)*.025,bx=px+105,by=224-52*s.pose;
    o+=A.table(px+55,260,155)+actor(A,px,106,bx,by,scale)+A.book(bx,by,.68);
    const hx=px+3,hy=331;
    o+=path(`M${n(hx-45)} ${n(hy)}A45 18 0 1 1 ${n(hx+45)} ${n(hy)}`,C.grid,2.5)+flow([[hx,hy],[hx+41*Math.cos(s.heading),hy+17*Math.sin(s.heading)]],C.mint,3);
    o+=text(330,405,'New room, body, position or heading',C.white,33)+text(330,449,'changes the RF observations',C.muted,33);
    factors.forEach((f,i)=>{
      const x=722+(i%2)*355,y=55+Math.floor(i/2)*105,c=i<=s.stage?C.mint:C.muted;
      o+=text(x,y,f.count.toLocaleString(),c,49,'start',700)+text(x+94,y+2,f.label,C.white,34,'start',i===s.stage?700:400);
      if(i===s.stage)o+=path(`M${x} ${y+37}H${x+302}`,C.mint,3);
    });
    o+=path('M720 354H1404',C.grid,2)+text(720,395,'Recordings',C.muted,32,'start');
    o+=text(1404,393,s.total.toLocaleString(),C.mint,62,'end',700);
    o+=text(1060,463,`Multiplying factors: ${s.product.toLocaleString()} so far`,C.white,34,'middle',700);
    o+=text(1060,508,'Illustrative exhaustive coverage',C.muted,31);
    return svg('Deployment coverage multiplies',o,'Illustrative deployment coverage multiplies ten rooms, twenty users, ten positions, eight headings, fifty interaction pairs and five repetitions: four million recordings. Counts are an explanatory design-space, not a collected dataset.');
  }
  function featureGlyph(x,y,w=180,h=83,color=C.blue){
    let o=rect(x,y,w,h,color,.02,4);
    for(let j=0;j<4;j++)for(let i=0;i<8;i++)o+=`<rect x="${n(x+8+i*(w-16)/8)}" y="${n(y+8+j*(h-16)/4)}" width="${n((w-20)/8)}" height="${n((h-20)/4)}" fill="${color}" fill-opacity="${j===1||i===4?.55:.10}"/>`;
    return o;
  }
  function sharedMotion(t,A){
    const s=phaseState(t),bx=343+29*s.lift,by=261-78*s.lift;
    let o=text(261,33,'Annotated HOI motion',C.white,36,'middle',700);
    o+=A.table(275,307,225)+actor(A,191,96,bx-25,by+3,1.42)+A.book(bx,by,.95)+meshOverlay(191,96,s.lift);
    o+=`<text x="252" y="452" font-size="34" text-anchor="middle" dominant-baseline="middle" font-weight="700"><tspan fill="${C.muted}">HOI: </tspan><tspan fill="${C.blue}">pick up</tspan><tspan fill="${C.white}"> + </tspan><tspan fill="${C.gold}">book</tspan></text>`;
    // Alternative sensor placements are visibly separate setup instances.
    // Keep the canonical geometry fixed for the linked phase curve. Faint
    // alternative icons denote other samples, not simultaneously live radios.
    [[74,168],[70,302],[508,118]].forEach(([x,y],i)=>{o+=`<g opacity="${i===0?1:.23}">${A.radar(x,y,.52)}</g>`;});
    o+=text(252,493,'Reuse the trace across sensor setups',C.muted,31);
    o+=flow([[532,253],[599,253],[599,124],[687,124]],C.blue)+flow([[599,253],[599,359],[687,359]],C.gold);
    o+=rect(710,65,280,117,C.blue)+text(850,103,'Radar',C.blue,36,'middle',700)+text(850,148,'Ray tracing',C.white,34);
    o+=rect(710,301,280,117,C.gold)+text(850,339,'RFID',C.gold,36,'middle',700)+text(850,384,'Phase differences',C.white,34);
    o+=flow([[1008,124],[1065,124]],C.blue)+flow([[1008,359],[1065,359]],C.gold);
    o+=featureGlyph(1095,83,279,99,C.blue)+text(1234,222,'RT / RD / AoA',C.blue,34,'middle',700);
    const M=window.SlideModel,plot={x:1095,y:315,w:279,h:86,min:-.8,max:.8};
    o+=path(`M1095 358H1374`,C.grid,2)+A.plot(M.samples(),{...plot,value:q=>q.phases[0]},C.gold,4);
    o+=dot(plot.x+s.u*plot.w,plot.y+plot.h-(s.phases[0]-plot.min)/(plot.max-plot.min)*plot.h,C.gold,6);
    o+=text(1234,455,'Target + static candidates',C.gold,31);
    return svg('One annotated motion supplies both modalities',o,'An annotated HOI mesh and its action/target labels feed two physical branches. Radar uses ray tracing; RFID uses hand-range phase differences. Alternative sensor icons denote reuse across geometry setups. Feature tiles are schematic processing symbols, not radar measurements.');
  }
  function screenPoint(p){return [80+150*p[0],420-170*p[1]];}
  function rayTracing(t,A){
    const s=rayState(t),tx=screenPoint(s.tx),rx=screenPoint(s.rx),hp=screenPoint(s.hand.p);
    let o=text(346,30,'Trace rays off the moving mesh',C.white,35,'middle',700);
    // All four body-surface contributions remain concurrent. Distinct Tx/Rx
    // paths and delay bars derive from the same geometric point state.
    s.points.forEach(q=>{const p=screenPoint(q.p);o+=path(`M${n(tx[0]+31)} ${n(tx[1])}L${n(p[0])} ${n(p[1])}L${n(rx[0]+31)} ${n(rx[1])}`,q.color,q.name==='Hand'?4.5:2.2,`stroke-opacity="${q.name==='Hand'?1:.58}"`);});
    o+=A.radar(80,(tx[1]+rx[1])/2,.7)+text(80,309,'Tx / Rx',C.blue,33);
    o+=A.table(452,289,176)+actor(A,395,107,hp[0],hp[1],1.45)+A.book(hp[0]+26,hp[1]-3,.70)+meshOverlay(395,107,s.h);
    s.points.forEach(q=>{const p=screenPoint(q.p);o+=dot(p[0],p[1],q.color,q.name==='Hand'?8:6);});
    o+=text(337,462,'Several body surfaces reflect simultaneously',C.muted,31);
    o+=text(843,30,'Return-path delays',C.white,35,'middle',700);
    const x0=740,x1=985;
    [0,10,20].forEach(v=>{const x=x0+v/20*(x1-x0);o+=path(`M${n(x)} 113V353`,C.grid,1.5)+text(x,88,String(v),C.muted,30);});
    s.points.forEach((q,i)=>{const y=141+i*61,xx=x0+q.delayNs/20*(x1-x0);o+=text(x0-19,y,q.name,q.color,31,'end',q.name==='Hand'?700:400)+path(`M${x0} ${y}H${n(xx)}`,q.color,q.name==='Hand'?7:4)+dot(xx,y,q.color,q.name==='Hand'?7:5);});
    o+=text(861,391,'Delay (ns)',C.muted,31);
    o+=text(843,423,'Delay sets range',C.blue,31,'middle',700);
    o+=text(843,460,'Path rate sets Doppler',C.blue,31,'middle',700);
    o+=text(843,497,'Direction sets angle',C.blue,31,'middle',700);
    // Name the received-signal bridge explicitly. These are processing stages,
    // not a newly introduced waveform or a computed FMCW/array simulation.
    o+=flow([[1014,240],[1045,240],[1045,114],[1078,114]],C.blue);
    o+=text(1250,30,'Per-path RF returns',C.white,34,'middle',700);
    o+=rect(1092,80,316,68,C.blue)+text(1250,114,'Sum at Rx',C.blue,34,'middle',700);
    o+=flow([[1250,158],[1250,180]],C.blue,3);
    o+=text(1250,207,'Received RF signal',C.white,33,'middle',700);
    o+=flow([[1250,234],[1250,255]],C.blue,3);
    o+=rect(1092,270,316,72,C.blue)+text(1250,306,'Radar processing',C.blue,33,'middle',700);
    o+=flow([[1250,352],[1250,383]],C.blue,3);
    o+=text(1250,417,'RT / RD / AoA',C.mint,35,'middle',700);
    o+=text(1250,460,'Normalize strength',C.muted,30);
    o+=text(1250,493,'Emphasize motion patterns',C.muted,30);
    return svg('Physics-inspired radar ray tracing',o,'Four simultaneous point proxies on a moving human mesh determine Tx-to-surface-to-Rx path lengths and return delays. Delay, path rate and arrival direction set range, Doppler and angle structure. Per-path RF returns are combined at the receiver, then radar processing forms RT, RD and AoA representations. RF-HOI adapts RFGen ray tracing to complete annotated HOI meshes and normalizes heatmaps to emphasize relative motion patterns. Processing boxes are conceptual stages; this geometric explanation does not compute a received waveform or reproduce the RFGen simulator.');
  }
  function rfidPhysics(t,A){
    const s=phaseState(t),M=window.SlideModel,bx=371+34*s.lift,by=296-82*s.lift;
    let o=text(310,26,'Lower frequency limits ray accuracy',C.white,32,'middle',700);
    o+=text(310,71,'Object meshes / positions may be missing',C.muted,30);
    o+=A.table(299,338,220)+actor(A,198,133,bx-29,by+3,1.45)+A.book(bx,by,.91);
    o+=path(`M${n(bx-60)} ${n(by-43)}L${n(bx-3)} ${n(by+45)}M${n(bx-3)} ${n(by-43)}L${n(bx-60)} ${n(by+45)}`,C.grid,2.5,'stroke-dasharray="5 7"');
    o+=text(316,484,'The body mesh still supplies the hand',C.mint,32,'middle',700);
    o+=flow([[563,248],[657,248]],C.gold);
    o+=text(1030,30,'Use adjacent-frame range change',C.white,35,'middle',700);
    const ax=736,ay=233,nowX=1045+52*s.lift,nowY=197-70*s.lift,prevX=1045+52*M.lift(s.u-M.SAMPLE_INTERVAL/M.DURATION_SECONDS),prevY=197-70*M.lift(s.u-M.SAMPLE_INTERVAL/M.DURATION_SECONDS);
    o+=A.reader(ax,ay,.63)+text(ax,309,'RFID',C.gold,32,'middle',700);
    o+=path(`M${ax+36} ${ay}L${n(prevX)} ${n(prevY)}`,C.grid,3,'stroke-dasharray="9 7"')+path(`M${ax+36} ${ay}L${n(nowX)} ${n(nowY)}`,C.gold,4);
    o+=dot(prevX,prevY,C.muted,8)+dot(nowX,nowY,C.gold,8);
    o+=text(1098,78,'Previous / current hand',C.muted,31);
    o+=text(1065,223,'Range step:',C.gold,31,'start',700);
    o+=text(1400,223,`${s.deltaRange>=0?'+':''}${(s.deltaRange*1000).toFixed(1)} mm`,C.gold,31,'end',700);
    o+=text(1065,262,'Phase step:',C.gold,31,'start',700);
    o+=text(1400,262,`${s.deltaPhase>=0?'+':''}${s.deltaPhase.toFixed(2)} rad`,C.gold,31,'end',700);
    o+=A.tag(985,295,.58)+path('M780 243L940 295',C.grid,2.5,'stroke-dasharray="7 8"')+text(1214,295,'Static candidate stays still',C.muted,30);
    const plot={x:755,y:370,w:605,h:100,min:-.8,max:.8};
    o+=text(1054,343,'RFID phase step (rad)',C.muted,31);
    [0.8,0,-0.8].forEach(v=>{const y=plot.y+plot.h-(v-plot.min)/(plot.max-plot.min)*plot.h;o+=path(`M755 ${n(y)}H1360`,C.grid,v===0?2:1)+text(736,y,String(v),C.muted,30,'end');});
    o+=path('M755 370V470',C.grid,2)+A.plot(M.samples(),{...plot,value:q=>q.phases[0]},C.gold,4);
    o+=dot(plot.x+s.u*plot.w,plot.y+plot.h-(s.phases[0]-plot.min)/(plot.max-plot.min)*plot.h,C.gold,6);
    o+=text(755,497,'0 s',C.muted,30,'start')+text(1360,497,'2.4 s',C.muted,30,'end');
    o+=text(1054,497,'Geometric illustration',C.muted,30);
    return svg('RFID needs a different physical model',o,'Unlike mmWave radar, RFID cannot directly reuse the mesh ray tracer at its lower frequency and with missing object coordinate annotations. The interacting hand supplies a displacement proxy. Adjacent-frame antenna-range change determines phase change; the ideal static candidate stays at zero. Hand markers and phase cursor share the existing geometric model.');
  }
  const builders={coverage,'shared-motion':sharedMotion,raytracing:rayTracing,'rfid-physics':rfidPhysics};
  window.RFSynthesisModel=Object.freeze({factors,coverageState,rayState,phaseState});
  window.RFSynthesis=Object.freeze({names:Object.freeze(Object.keys(builders)),render(name,t){const make=builders[name],A=window.RFArt;if(!make||!A)return false;document.querySelectorAll(`[data-synthesis="${name}"]`).forEach(node=>{node.innerHTML=make(Number(t)||0,A);});return true;}});
})();
