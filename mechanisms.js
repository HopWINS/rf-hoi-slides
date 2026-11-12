/* RF-HOI mechanism scenes. Source: paper Secs.3.3.3–3.3.4, 3.4.3,
 * 3.5.2 and Fig.7–9. These are architectural/geometric illustrations.
 *
 * Temporal/joint glyph cells indicate feature structure and modality presence,
 * not measured activations, dimensions, scores, attention weights or confidence.
 * Temporal animation shows complete-sequence processing; its clock is not an
 * online/causal Transformer schedule. Mean pooling removes the time dimension
 * independently in each modality. Fixed size does not mean equal dimensions
 * across modalities: the paper uses separate dimensions and a later RFID
 * linear alignment. Glyph widths/component counts are schematic only. RFID name embeddings are combined within
 * its branch before cross-modal concatenation (their separate projection is
 * deliberately omitted here). No frame matching between radios is implied.
 *
 * Candidate labels A/B/C are illustrative tag IDs, not recorded EPC values.
 * The example illustrates candidate-index lookup and separate outputs. It
 * makes no claim of permutation invariance or recognition of new actions.
 *
 * Paired scene uses exactly one SlideModel state for physical hand/book pose,
 * radar ray geometry and RFID phase cursor. Its radar path is an ideal geometric
 * reflection illustration, NOT a radar spectrum/heatmap or the RFGen simulator.
 * The paper's radar simulator ray-traces complete human meshes; this scene
 * shows one highlighted hand surface to explain shared source geometry. Its
 * RFID phase uses the existing ideal hand-proxy model in model.js, including
 * the documented .33 m wavelength, 2.4 s physical motion and omitted multipath.
 * Expansion uses one matched book-to-jar comparison. The same shared motion
 * state drives both actors; category reassignment changes object semantics,
 * not simulated scattering/RCS. This assumes compatible interaction primitives
 * as in Algorithm1; it is not a new measured jar trajectory.
 * A 12 s presentation loop maps onto the existing 8 s pedagogical pose loop.
 */
(function(){
  'use strict';
  const C={bg:'#002D72',radar:'#68ACE5',tag:'#F1C400',fused:'#96E1CD',white:'#FFFFFF',muted:'#C4D8ED',grid:'#416596'};
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{const q=clamp(x);return q*q*(3-2*q);};
  const mod=(x,n)=>((x%n)+n)%n;
  const n=x=>Number(x).toFixed(2);
  const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const phase=t=>mod(Number(t)||0,12);
  function svg(A,body,title,height=500){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${height}" role="img" aria-label="${esc(title)}" style="font-family:Arial,Helvetica,sans-serif">${A.defs()}${body}</svg>`;}
  function line(A,x1,y1,x2,y2,c=C.grid,w=2,more=''){return A.path(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`,c,w,more);}
  function box(A,x,y,w,h,c=C.radar){return A.rect(x,y,w,h,c,5,.025);}
  function arrow(A,d,c=C.fused,w=4){return A.lineArrow(d,c,w);}
  function label(A,x,y,value,c=C.white,size=33,anchor='middle',weight=400){return A.text(x,y,value,c,size,anchor,weight);}
  function feature(A,x,y,color,w=120,h=52,fill=true){
    const cols=4,gap=5,cw=(w-gap*(cols-1))/cols;
    let out='';
    for(let i=0;i<cols;i++)out+=A.rect(x+i*(cw+gap),y,cw,h,color,3,fill?.62:.025);
    return out;
  }
  function combined(A,x,y,w=240,h=52,fill=true){
    const gap=8,half=(w-gap)/2;
    return feature(A,x,y,C.radar,half,h,fill)+feature(A,x+half+gap,y,C.tag,half,h,fill);
  }
  function rawFrame(A,x,y,color,w=32,h=47){
    return box(A,x,y,w,h,color)+A.path(`M${n(x+8)} ${n(y+12)}H${n(x+w-8)}M${n(x+8)} ${n(y+24)}H${n(x+w-8)}M${n(x+8)} ${n(y+36)}H${n(x+w-8)}`,color,2);
  }

  function temporal(t,A){
    const p=phase(t),encode=smooth((p-1)/2.2),pool=smooth((p-4)/3.2);
    // The last second marks a fresh illustrative window. No reverse pooling.
    const fresh=p>11.2, enc=fresh?0:encode, mix=fresh?0:pool;
    const rows=[{title:'8 radar frames',times:[0,.14,.28,.42,.56,.7,.84,1],color:C.radar,y:134,summaryWidth:132},
      {title:'12 RFID readings',times:[.01,.07,.16,.18,.31,.47,.51,.57,.73,.75,.90,.96],color:C.tag,y:355,summaryWidth:104}];
    let out='';
    rows.forEach(row=>{
      out+=label(A,55,row.y-86,row.title,row.color,35,'start',700);
      out+=line(A,55,row.y+39,507,row.y+39,C.grid,2);
      row.times.forEach(q=>{out+=row.color===C.tag?line(A,55+q*420,row.y-24,55+q*420,row.y+22,row.color,5):rawFrame(A,55+q*420,row.y-24,row.color,26,46);});
      out+=arrow(A,`M525 ${row.y}H589`,row.color,4);
      out+=label(A,805,row.y-86,'Temporal encoder',C.white,34,'middle',700);
      // Transform the entire sequence into per-frame feature symbols. Their
      // component count is illustrative, not an architecture dimension.
      const start=633,end=995,target=1211;
      if(mix<=.995)row.times.forEach((q,i)=>{
        const x0=start+i/(row.times.length-1)*(end-start),xx=x0+(target-x0)*mix;
        const ww=22+(row.summaryWidth-22)*mix,hh=47+5*mix;
        if(enc>.001)out+=feature(A,xx,row.y-hh/2,row.color,ww,hh,true);
        else out+=box(A,x0,row.y-23.5,22,47,row.color);
      });
      // The pooled summary is a single object; do not imply summation by
      // accumulating opacity when per-frame glyphs coincide.
      if(mix>.995)out+=feature(A,1211,row.y-26,row.color,row.summaryWidth,52,true);
      out+=arrow(A,`M1040 ${row.y}H1174`,row.color,4);
      out+=label(A,1107,row.y-53,'Mean',row.color,32,'middle',700);
      out+=label(A,1107,row.y+62,'over time',C.muted,32);
      if(mix<.995)out+=feature(A,1211,row.y-26,row.color,row.summaryWidth,52,false);
    });
    out+=label(A,1220,459,'Fixed-size summaries',C.fused,32,'middle',700);
    return svg(A,out,'Independent temporal encoding and mean pooling collapse unequal complete sequences into fixed-width summaries');
  }

  function joint(t,A){
    const p=phase(t),merge=smooth((p-1)/3),share=smooth((p-4.2)/3.2),fresh=p>11.4;
    const m=fresh?0:merge,s=fresh?0:share;
    let out=label(A,167,59,'Radar summary',C.radar,35,'middle',700)+feature(A,66,104,C.radar,202,61);
    out+=label(A,167,410,'RFID summary',C.tag,35,'middle',700)+feature(A,66,459,C.tag,202,61);
    out+=label(A,666,127,'Concatenate',C.white,35,'middle',700);
    const blueX=505,blueY=215-40*(1-m),goldX=638,goldY=215+100*(1-m);
    // Paths approach their current feature groups from clear orthogonal sides.
    out+=arrow(A,`M297 135H395V${n(blueY+29)}H478`,C.radar,4);
    out+=arrow(A,`M297 490H699V${n(goldY+78)}`,C.tag,4);
    out+=feature(A,blueX,blueY,C.radar,122,58,true)+feature(A,goldX,goldY,C.tag,122,58,true);
    out+=arrow(A,'M789 244H862V118H950',C.fused,4)+arrow(A,'M862 244V441H950',C.fused,4);
    out+=label(A,1163,55,'Action head',C.white,35,'middle',700)+label(A,1163,379,'Target head',C.white,35,'middle',700);
    const targetW=280,headX=1023,headY=[90,414];
    headY.forEach(y=>{
      out+=combined(A,headX,y,targetW,57,s>.995);
      if(s>0&&s<.995)out+=combined(A,805+(headX-805)*s,y,targetW,57,true);
    });
    // The field labels remain readable before the illustrative outputs arrive,
    // keeping the lower composition present throughout the whole loop.
    out+=label(A,1163,207,s>.995?'pick up':'action label',s>.995?C.radar:C.muted,s>.995?40:33,'middle',s>.995?700:400);
    out+=label(A,1163,552,s>.995?'candidate index':'target index',s>.995?C.tag:C.muted,37,'middle',s>.995?700:400);
    return svg(A,out,'Radar and RFID summaries concatenate into one representation; each output head receives both modalities',600);
  }

  function phone(A,x,y,s=.8){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><rect x="-25" y="-42" width="50" height="84" rx="7" fill="#B3D2E8" stroke="#DCEBF5" stroke-width="3"/><rect x="-18" y="-29" width="36" height="48" rx="2" fill="#315982"/><path d="M-8 30H8" stroke="#DCEBF5" stroke-width="3"/>${A.tag(0,17,.31)}</g>`;}
  function tuple(A,x,y,target='book'){
    return `<text x="${n(x)}" y="${n(y)}" font-size="43" text-anchor="middle" dominant-baseline="middle" font-weight="700"><tspan fill="${C.white}">〈</tspan><tspan fill="${C.radar}">pick up</tspan><tspan fill="${C.white}">, </tspan><tspan fill="${C.tag}">${esc(target)}</tspan><tspan fill="${C.white}">〉</tspan></text>`;
  }
  function candidate(t,A){
    const p=phase(t),lookup=smooth((p-2)/3),compose=smooth((p-5.5)/2.5);
    let out=label(A,228,45,'Action output',C.white,35,'middle',700)+label(A,228,104,'pick up',C.radar,44,'middle',700);
    out+=arrow(A,'M365 104H857V176H933',C.radar,4);
    out+=label(A,227,232,'Current candidates',C.white,35,'middle',700);
    out+=A.bottle(88,328,.92)+A.book(236,328,1.02)+phone(A,394,328,.85);
    out+=label(A,88,413,'1  bottle',C.muted,32)+label(A,236,413,'2  book',C.tag,34,'middle',700)+label(A,394,413,'3  phone',C.muted,32);
    out+=box(A,183,275,106,102,C.tag);
    out+=arrow(A,'M458 328H534',C.tag,4)+label(A,636,270,'Target output',C.white,34,'middle',700)+label(A,636,328,'index 2',C.tag,43,'middle',700);
    out+=arrow(A,'M734 328H792',C.tag,4)+A.tag(870,328,.82)+label(A,870,411,'Tag B',C.tag,33,'middle',700);
    out+=arrow(A,'M946 328H1009',C.tag,4)+label(A,1125,328,lookup>.45?'book':'object name',lookup>.45?C.tag:C.muted,lookup>.45?43:33,'middle',700)+label(A,1125,411,'Name lookup',C.muted,33);
    out+=arrow(A,'M1245 328H1345V221H1280',C.tag,4);
    out+=tuple(A,1178,176,compose>.5?'book':'…')+label(A,1174,68,'Compose the pair',C.white,35,'middle',700);
    return svg(A,out,'A target index selects the current tag, whose lookup supplies the object name; a separate action label combines with it as a human-object pair');
  }

  function pairedState(t){
    const model=window.SlideModel,u=phase(t)/12,state=model.state(u*model.LOOP_SECONDS);
    const radarOrigin=[-.15,-.60,1.10];
    const range=model.distance(state.hand,radarOrigin);
    return {...state,radarRange:range,roundTrip:2*range};
  }
  function paired(t,A){
    const s=pairedState(t),model=window.SlideModel;
    const bx=418+29*s.lift,by=249-78*s.lift;
    let out=label(A,250,34,'One annotated HOI trace',C.white,35,'middle',700);
    out+=A.table(360,294,207)+A.person(247,82,(bx-247)/1.48,(by-82)/1.48,1.48)+A.book(bx,by,.94);
    out+=A.dot(bx,by,C.fused,8)+label(A,277,457,'Shared hand / object trajectory',C.muted,32,'middle',400);
    out+=arrow(A,'M505 254H565V111H642',C.radar,4)+arrow(A,'M565 254V373H642',C.tag,4);
    out+=label(A,1056,31,'Radar reflection geometry',C.radar,35,'middle',700);
    const rx=729,ry=118,hx=1210+38*s.lift,hy=147-64*s.lift;
    out+=A.radar(rx,ry,.65);
    // A highlighted surface proxy tracks exactly the same shared pose state.
    out+=A.path(`M${n(hx-28)} ${n(hy-12)}Q${n(hx-5)} ${n(hy-25)} ${n(hx+19)} ${n(hy-8)}L${n(hx+28)} ${n(hy+11)}L${n(hx+3)} ${n(hy+20)}L${n(hx-26)} ${n(hy+9)}Z`,C.muted,3);
    out+=A.dot(hx,hy,C.fused,7);
    out+=arrow(A,`M${rx+59} ${ry-8}L${n(hx-11)} ${n(hy-8)}`,C.radar,4);
    out+=arrow(A,`M${n(hx-13)} ${n(hy+12)}L${rx+59} ${ry+12}`,C.radar,4);
    out+=label(A,1100,218,`Round trip ${s.roundTrip.toFixed(2)} m`,C.radar,33,'middle',700);
    out+=label(A,1395,150,'Hand',C.muted,32,'end')+label(A,1395,188,'surface',C.muted,32,'end');
    out+=label(A,1060,282,'RFID phase change (rad)',C.tag,35,'middle',700);
    const plot={x:715,y:316,w:670,h:115,min:-.8,max:.8};
    out+=line(A,plot.x,plot.y+plot.h/2,plot.x+plot.w,plot.y+plot.h/2,C.grid,2)+line(A,plot.x,plot.y,plot.x,plot.y+plot.h,C.grid,2);
    out+=A.plot(model.samples(),{...plot,value:q=>q.phases[0]},C.tag,4.5);
    const mx=plot.x+s.u*plot.w,my=plot.y+plot.h-(s.phases[0]-plot.min)/(plot.max-plot.min)*plot.h;
    out+=line(A,mx,plot.y-6,mx,plot.y+plot.h+6,C.muted,1.5)+A.dot(mx,my,C.tag,7);
    out+=label(A,plot.x,469,'0 s',C.muted,32,'start')+label(A,plot.x+plot.w,469,'2.4 s',C.muted,32,'end');
    out+=label(A,1055,469,'Geometric illustration',C.muted,32);
    return svg(A,out,'One shared hand and object trajectory simultaneously changes a radar reflection path and the hand-proxy RFID phase; geometry only, not a simulated radar heatmap');
  }

  function handProxy(t,A){
    const state=pairedState(t),M=window.SlideModel;
    const points=M.samples().map(q=>({u:q.u,x:375+32*M.lift(q.u),y:250-78*M.lift(q.u)}));
    const bx=375+32*state.lift,by=250-78*state.lift;
    // Graphical offsets distinguish hand contact from the object reference.
    // Parallel displacement illustrates the approximation. These positions are
    // not Fig.9 measurements, and do not assert identical absolute coordinates.
    const handOffset={x:-30,y:3};
    let out='';
    out+=A.path(points.map((q,i)=>`${i?'L':'M'}${n(q.x)} ${n(q.y)}`).join(''),C.tag,4,'stroke-dasharray="10 8"');
    out+=A.path(points.map((q,i)=>`${i?'L':'M'}${n(q.x+handOffset.x)} ${n(q.y+handOffset.y)}`).join(''),C.fused,4);
    out+=A.table(325,294,220)+A.person(179,79,(bx+handOffset.x-179)/1.5,(by+handOffset.y-79)/1.5,1.5)+A.book(bx,by,1.04);
    out+=A.dot(bx+handOffset.x,by+handOffset.y,C.fused,7)+A.dot(bx,by,C.tag,6);
    out+=label(A,202,35,'Hand contact',C.fused,34,'middle',700)+label(A,492,35,'Object reference',C.tag,34,'middle',700);
    out+=A.path(`M270 57L${n(bx+handOffset.x-12)} ${n(by+handOffset.y-15)}`,C.fused,2.5,'stroke-dasharray="5 7"');
    out+=A.path(`M480 57L${n(bx+13)} ${n(by-15)}`,C.tag,2.5,'stroke-dasharray="5 7"');
    out+=label(A,350,449,'Similar motion, different positions',C.white,33,'middle',700);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" role="img" aria-label="The hand contacts the book at an offset from its reference point; their similar displacement motivates a hand-trajectory approximation, not identical absolute coordinates" style="font-family:Arial,Helvetica,sans-serif">${A.defs()}${out}</svg>`;
  }

  function jar(A,x,y,s=.8){
    return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><path d="M-34 -34H34V-20Q44 -9 44 5V42H-44V5Q-44 -9 -34 -20Z" fill="#BBD7EA" fill-opacity=".32" stroke="#DCEBF5" stroke-width="3"/><rect x="-37" y="-46" width="74" height="15" rx="4" fill="#81ADCD" stroke="#DCEBF5" stroke-width="2"/><path d="M-33 3V30" stroke="#C8E1F2" stroke-width="3" stroke-linecap="round"/>${A.tag(0,16,.51)}</g>`;
  }
  function expansion(t,A){
    const state=pairedState(t),lift=state.lift;
    const originalX=410+20*lift,expandedX=1180+20*lift,objectY=265-85*lift;
    let out=label(A,350,34,'Original: book',C.white,35,'middle',700)+label(A,1120,34,'Expanded: jar',C.white,35,'middle',700);
    out+=A.table(350,305,220)+A.person(190,106,(originalX-30-190)/1.5,(objectY+3-106)/1.5,1.5)+A.book(originalX,objectY,1.04);
    out+=A.table(1120,305,220)+A.person(960,106,(expandedX-30-960)/1.5,(objectY+3-106)/1.5,1.5)+jar(A,expandedX,objectY,.8);
    out+=label(A,720,180,'Same primitive',C.fused,34,'middle',700)+arrow(A,'M625 235H815',C.fused,4);
    out+=label(A,720,315,'Name embedding',C.muted,32)+label(A,720,357,'book → jar',C.tag,37,'middle',700);
    out+=label(A,350,465,'pick up',C.radar,35,'middle',700)+label(A,1120,465,'pick up',C.radar,35,'middle',700);
    return svg(A,out,'A matched book and jar example reuses one synchronized pick-up primitive while the object-name embedding changes. This is semantic expansion of compatible motion, not a claim of identical object scattering.');
  }

  const renderers={temporal,joint,candidate,paired,'hand-proxy':handProxy,expansion};
  window.RFMechanisms={names:Object.freeze(Object.keys(renderers)),pairedState,render(name,t){
    const build=renderers[name],A=window.RFArt;if(!build||!A)return false;
    document.querySelectorAll(`[data-mechanism="${name}"]`).forEach(node=>{
      node.innerHTML=build(Number(t)||0,A).replace(/arrow-(radar|tag|fused)/g,`arrow-mechanism-${name}-$1`);
    });return true;
  }};
})();
