/* RF-HOI narrative diagrams, sourced to the supplied paper.
 * data-cost: Sec.2.2, p.6; setup illustrations are schematic, not data.
 * evaluation: Secs.4.2-4.3, pp.14-16; random real-sample 30/70 split.
 * generalization: Secs.5.4.1 and5.4.4, pp.18-20. Held-out real HOI pairs
 * are represented synthetically; unseen setups combine familiar factor values.
 * processing: Sec.5.7.2, Figs.30-32, pp.24-25. Four frames and the displayed
 * overlap lengths are a teaching timeline, not measured timing intervals.
 * Each frame finishes acquisition before its preprocessing starts; that work
 * overlaps acquisition of subsequent frames. Inference follows the final work.
 * Elapsed seconds affect explanatory emphasis and schematic motion only.
 */
(function () {
  'use strict';
  const C = { bg:'#002D72', white:'#FFFFFF', muted:'#C4D8ED', blue:'#68ACE5', gold:'#F1C400', mint:'#96E1CD', grid:'#416596' };
  const TAU = Math.PI * 2;
  const mod = (x,n) => ((x%n)+n)%n;
  const clamp = x => Math.max(0, Math.min(1, x));
  const num = x => Number(x).toFixed(2);
  const esc = x => String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function text(x,y,value,color=C.white,size=34,anchor='middle',weight=400) {
    return `<text x="${num(x)}" y="${num(y)}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" dominant-baseline="middle">${esc(value)}</text>`;
  }
  function path(d,color=C.white,width=5,extra='') {
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  }
  function line(x1,y1,x2,y2,color=C.grid,width=2,extra='') {
    return path(`M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}`,color,width,extra);
  }
  function flow(points,color=C.blue,width=5) {
    const d=points.map((p,i)=>(i?'L':'M')+num(p[0])+' '+num(p[1])).join('');
    const a=points[points.length-2],b=points[points.length-1],angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
    const back=15,side=9;
    const left=[b[0]-back*Math.cos(angle)+side*Math.sin(angle),b[1]-back*Math.sin(angle)-side*Math.cos(angle)];
    const right=[b[0]-back*Math.cos(angle)-side*Math.sin(angle),b[1]-back*Math.sin(angle)+side*Math.cos(angle)];
    return path(d,color,width)+path(`M${num(left[0])} ${num(left[1])}L${num(b[0])} ${num(b[1])}L${num(right[0])} ${num(right[1])}`,color,width);
  }
  function rect(x,y,w,h,color=C.blue,opacity=.08,rx=10) {
    return `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${rx}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-width="3"/>`;
  }
  function tag(x,y,s=1) {
    return window.RFArt.tag(x,y,s);
  }
  function book(x,y,s=1) {
    return window.RFArt.book(x,y,s);
  }
  function bottle(x,y,s=1) {
    return window.RFArt.bottle(x,y,s);
  }
  function personAtTarget(x,y,scale,targetX,targetY) {
    // The shared illustrated actor computes a two-link arm from the exact
    // world-space wrist target. Scaling never detaches the hand from its object.
    return window.RFArt.person(x,y,(targetX-x)/scale,(targetY-y)/scale,scale);
  }
  function sensor(x,y,s=1) {
    return window.RFArt.radar(x,y,s);
  }
  function svg(name,body,description) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 460" role="img" aria-label="${esc(description)}" style="font-family:Arial,Helvetica,sans-serif"><title>${esc(name)}</title><desc>${esc(description)}</desc>${body}</svg>`;
  }
  function roomContents(room) {
    if(room===0) return window.RFArt.table(470,235,206)+path('M567 228V205H624V228',C.grid,4);
    if(room===1) return path('M572 58H679V290H572ZM572 128H679M572 201H679M588 81H616V116H588ZM635 151H663V190H635Z',C.grid,4);
    return path('M526 222H687V304H526ZM552 154H675V211H552ZM567 169H630V196H567ZM651 171V195M553 270H578M634 270H659',C.grid,4);
  }
  function dataCost(seconds) {
    const u=mod(seconds,12),stage=Math.min(4,Math.floor(u/2)),local=mod(u,2)/2;
    const environment=stage===0?Math.floor(local*3):stage===4?2:0;
    const identity=stage===1?Math.floor(local*5):1;
    const px=stage===2?430+100*(.5-.5*Math.cos(TAU*local)):480;
    const heading=stage===3?Math.sin(TAU*local)*Math.PI/2:0;
    const heightScale=.91+identity*.035;
    let out=path('M26 346V37H715V346',C.grid,3)+line(26,346,715,346,C.grid,3);
    out+=roomContents(environment)+sensor(116,207,.9)+text(111,286,'Sensors',C.blue,32);
    const bookX=px+67*heightScale,bookY=123+74*heightScale;
    // A width projection makes the orientation factor visibly affect the actor.
    // The entire actor-and-object group shares one projection, preserving the
    // exact wrist/object contact. This is a teaching pose, not a 3D mesh render.
    const facingWidth=.55+.45*Math.abs(Math.cos(heading));
    out+=`<g transform="translate(${num(px)} 0) scale(${num(facingWidth)} 1) translate(${num(-px)} 0)">`+personAtTarget(px,346-211*heightScale,heightScale,bookX,bookY)+book(bookX,bookY,.7)+'</g>';
    out+=path(`M${num(px-60)} 328Q${num(px)} 281 ${num(px+60)} 328`,C.grid,3);
    const hx=px-59*Math.cos(heading),hy=328-47*Math.sin(heading);
    out+=flow([[px,328],[hx,hy]],C.gold,4);
    out+=line(144,393,px,393,C.mint,3)+line(144,381,144,405,C.mint,3)+line(px,381,px,405,C.mint,3);
    out+=text((144+px)/2,436,'Sensor-to-user distance',C.muted,32);
    const factors=[['3','environments'],['5','users'],['4','distances'],['7','orientations']];
    factors.forEach((r,i)=>{
      const active=stage===i||stage===4,color=active?C.mint:C.muted,y=72+i*88;
      out+=text(855,y,r[0],color,44,'start',700)+text(918,y,r[1],color,36,'start',active?700:400);
      if(active)out+=line(852,y+32,1340,y+32,color,4);
    });
    const cue=stage===4?'Combine factor values into setups':['Change the environment','Change the user','Change the distance','Change the orientation'][stage];
    out+=text(1092,421,'7 actions × 3 target choices',C.white,32);out+=text(1092,467,'5 repetitions per HOI',C.muted,32);
    return svg('Setup factors multiply',out,'Schematic changes in environment, user, sensor-to-user distance and orientation. Factors change separately before their values are combined into different setups. This is an illustrative collection budget, not measured sample coverage.').replace('viewBox="0 0 1440 460"','viewBox="0 0 1440 500"');
  }
  function waveCard(x,y,color,phase=0) {
    let out=rect(x-70,y-43,140,86,color,.035,4);
    out+=path(Array.from({length:60},(_,i)=>`${i?'L':'M'}${num(x-58+i*116/59)} ${num(y+19*Math.sin(i*.42+phase))}`).join(''),color,3);
    return out;
  }
  function network(x,y,color=C.mint) {
    let out='';
    [[-44,-30],[-44,30]].forEach(a=>[[-1,-39],[-1,0],[-1,39]].forEach(b=>{out+=line(x+a[0],y+a[1],x+b[0],y+b[1],color,2);}));
    [[-1,-39],[-1,0],[-1,39]].forEach(a=>{out+=line(x+a[0],y+a[1],x+45,y,color,2);});
    [[-44,-30],[-44,30],[-1,-39],[-1,0],[-1,39],[45,0]].forEach(p=>{out+=`<rect x="${x+p[0]-5}" y="${y+p[1]-5}" width="10" height="10" fill="${color}"/>`;});
    return out;
  }
  function evaluation(seconds) {
    const u=mod(seconds,10)/10;
    const pre=.08+.10*(.5+.5*Math.cos(TAU*u)),fine=.08+.10*(.5+.5*Math.cos(TAU*(u-.33)));
    let out=text(0,28,'7,518 synthetic samples',C.white,34,'start',700);
    out+=waveCard(142,115,C.blue)+waveCard(163,135,C.gold,.6)+text(0,206,'50% train / 50% validation',C.muted,32,'start');
    out+=flow([[286,132],[417,132]],C.blue)+rect(440,84,230,96,C.blue,pre)+text(555,132,'Pre-train',C.white,36,'middle',700);
    out+=flow([[693,132],[820,132]],C.mint)+rect(843,84,230,96,C.mint,fine)+text(958,132,'Fine-tune',C.white,36,'middle',700);
    out+=flow([[1096,132],[1198,132]],C.mint)+network(1300,132)+text(1296,40,'RF-HOI model',C.mint,34,'middle',700);
    out+=text(158,269,'3,615 real samples',C.white,34,'middle',700)+waveCard(143,344,C.blue)+waveCard(165,361,C.gold,1.3);
    out+=flow([[287,343],[433,343]],C.blue)+path('M459 321L481 343L459 365L437 343Z',C.white,4);
    out+=text(517,423,'Random sample split',C.muted,32);
    out+=flow([[498,343],[733,343],[733,132],[820,132]],C.blue)+text(760,240,'30% training',C.blue,34,'start',700);
    out+=flow([[498,343],[1125,343]],C.gold)+text(897,304,'70% testing',C.gold,34,'middle',700);
    out+=flow([[1300,207],[1300,267]],C.mint)+rect(1149,289,278,108,C.gold,.06)+text(1288,324,'Evaluate',C.white,36,'middle',700)+text(1288,368,'Joint accuracy',C.gold,32);
    return svg('Train and test on separate real samples',out,'Synthetic data supplies pretraining. A random split of 3,615 real samples supplies 30 percent for fine-tuning and 70 percent for testing. The synthetic dataset contains 7,518 total samples with separate training and validation subsets. Test data does not enter training.');
  }
  function generalization(seconds) {
    const u=mod(seconds,12)/12,focus=Math.floor(u*3),lift=.5-.5*Math.cos(TAU*u);
    let out=line(463,32,463,432,C.grid,2)+line(947,32,947,432,C.grid,2);
    const titles=['Seen in real training','A new real HOI pair','A new setup combination'];
    titles.forEach((t,i)=>{out+=text(232+i*484,35,t,i===focus?C.mint:C.white,32,'middle',700);});
    out+=bottle(137,145,.9)+path('M82 173H105V147M82 173H64',C.mint,5)+text(266,146,'pick up',C.blue,35,'middle',700);
    out+=book(137,280,1.02)+path('M113 256L139 229L166 256M139 229V278',C.mint,4)+text(267,280,'open',C.blue,35,'middle',700);
    out+=text(232,373,'Action and object labels',C.muted,32)+text(232,416,'remain familiar',C.muted,32);
    out+=personAtTarget(611,80,.9,701,182-lift*28)+book(701,182-lift*28,.9)+text(719,290,'pick up + book',C.gold,36,'middle',700);
    out+=text(719,368,'Held out from real training',C.white,32)+text(719,414,'Present in synthetic training',C.muted,32);
    const ax=1265+12*Math.sin(TAU*u),orientation=Math.sin(TAU*u)*.8;
    out+=path('M987 278V100H1398V278',C.grid,3)+sensor(1041,217,.65)+personAtTarget(ax,130,.67,ax+65*.67,130+74*.67);
    out+=line(1088,297,ax,297,C.blue,3)+line(1088,286,1088,308,C.blue,3)+line(ax,286,ax,308,C.blue,3);
    out+=flow([[ax,267],[ax-44*Math.cos(orientation),267-25*Math.sin(orientation)]],C.gold,3.5);
    out+=text(1198,368,'Familiar factor values',C.white,32)+text(1198,414,'A held-out combination',C.muted,32);
    return svg('Different generalization tests hold out different combinations',out,'Left: pick-up and open actions with familiar bottle and book identities. Middle: a pick-up-book pair held out only from real training while included in synthetic pretraining. Right: held-out combinations of user, environment, distance and orientation. These are separate protocols, not unseen action or object labels.');
  }
  function processing(seconds) {
    const u=mod(seconds,12)/12;
    const starts=[.05,.21,.37,.53],duration=.16;
    // Dimensionless teaching intervals: acquire .16, then preprocess .10.
    // The final frame completes at .69 and preprocessing ends at .79;
    // sample inference starts at .80. No interval represents measured ms.
    let out=text(0,103,'Acquisition',C.blue,34,'start',700)+text(0,235,'Preprocessing',C.gold,34,'start',700)+text(0,369,'Inference',C.mint,34,'start',700);
    const x0=291,step=209,w=177;
    for(let i=0;i<4;i++) {
      const x=x0+i*step,fill=clamp((u-starts[i])/duration),prep=clamp((u-starts[i]-duration)/.10);
      out+=rect(x,63,w,78,C.blue,.04,5);
      if(fill>0)out+=`<rect x="${x+3}" y="66" width="${(w-6)*fill}" height="72" rx="3" fill="${C.blue}" fill-opacity=".22"/>`;
      out+=text(x+w/2,103,'Frame '+(i+1),C.white,34,'middle',fill>.98?700:400);
      out+=flow([[x+88,149],[x+88,177],[x+147,177],[x+147,194]],C.grid,3);
      out+=rect(x+59,204,w,64,C.gold,.025,5);
      if(prep>0)out+=`<rect x="${x+62}" y="207" width="${(w-6)*prep}" height="58" rx="3" fill="${C.gold}" fill-opacity=".26"/>`;
      out+=text(x+147,237,'Process '+(i+1),C.gold,32,'middle',prep>.98?700:400);
    }
    const lastX=x0+3*step+59+w;
    out+=flow([[lastX+10,237],[1374,237],[1374,323]],C.mint,4);
    out+=rect(1153,337,273,75,C.mint,.04,5);
    const infer=clamp((u-.80)/.13);
    if(infer>0)out+=`<rect x="1156" y="340" width="${267*infer}" height="69" rx="3" fill="${C.mint}" fill-opacity=".24"/>`;
    out+=text(1289,375,'One sample',C.mint,34,'middle',infer>.98?700:400);
    out+=text(770,439,'Schematic overlap after each complete frame',C.muted,32);
    return svg('Streaming preprocessing overlaps RF acquisition',out,'Each of four illustrative frames finishes acquisition before its preprocessing starts. That work overlaps acquisition of subsequent frames. Sample-level inference follows final-frame preprocessing. Displayed lengths and the animation clock are schematic and do not encode measured millisecond delays.');
  }
  const builders={'data-cost':dataCost,evaluation,generalization,processing};
  window.RFStoryScenes={names:Object.freeze(Object.keys(builders)),render(name,seconds){
    const builder=builders[name];if(!builder)return false;
    document.querySelectorAll('[data-story]').forEach(node=>{if(node.dataset.story===name)node.innerHTML=builder(Number(seconds)||0);});
    return true;
  }};
})();
