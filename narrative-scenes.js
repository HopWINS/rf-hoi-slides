/* RF-HOI causal teaching scenes. Sources are listed in AUTHOR_NOTES.md.
 * Shared RFArt figures are illustrations, not reconstructed human meshes.
 * No diagram produces recognition probabilities, learned weights or accuracy.
 * The preprocessing schedule repeats the largest reported radar preprocessing
 * time on illustrative consecutive 100-ms frames. It is not a recorded trace.
 */
(function () {
  'use strict';
  const C={bg:'#002D72',white:'#FFFFFF',muted:'#C4D8ED',blue:'#68ACE5',gold:'#F1C400',mint:'#96E1CD',grid:'#416596'};
  const TAU=2*Math.PI;
  const mod=(x,n)=>((x%n)+n)%n;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{const u=clamp(x);return u*u*(3-2*u);};
  const f=x=>Number(x).toFixed(2);
  const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function text(x,y,t,color=C.white,size=34,anchor='middle',weight=400){return `<text x="${f(x)}" y="${f(y)}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" dominant-baseline="middle">${esc(t)}</text>`;}
  function path(d,color=C.white,width=5,extra=''){return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;}
  function line(x1,y1,x2,y2,color=C.grid,width=2,extra=''){return path(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`,color,width,extra);}
  function rect(x,y,w,h,color=C.blue,alpha=.07,r=7){return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${color}" fill-opacity="${alpha}" stroke="${color}" stroke-width="3"/>`;}
  function poly(points,color=C.blue,width=5,progress=1,arrow=true){
    const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
    let remaining=lengths.reduce((a,b)=>a+b,0)*clamp(progress),drawn=[points[0]];
    for(let i=0;i<lengths.length&&remaining>0;i++){
      const a=points[i],b=points[i+1],u=Math.min(1,remaining/lengths[i]);
      drawn.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]);remaining-=lengths[i];
    }
    if(drawn.length<2)return '';
    let out=path(drawn.map((p,i)=>(i?'L':'M')+f(p[0])+' '+f(p[1])).join(''),color,width);
    if(arrow){const a=drawn[drawn.length-2],b=drawn[drawn.length-1],angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
      const p=[b[0]-14*Math.cos(angle)+8*Math.sin(angle),b[1]-14*Math.sin(angle)-8*Math.cos(angle)],q=[b[0]-14*Math.cos(angle)-8*Math.sin(angle),b[1]-14*Math.sin(angle)+8*Math.cos(angle)];
      out+=path(`M${f(p[0])} ${f(p[1])}L${f(b[0])} ${f(b[1])}L${f(q[0])} ${f(q[1])}`,color,width);}
    return out;
  }
  function svg(name,body,desc){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 500" role="img" aria-label="${esc(desc)}" style="font-family:Arial,Helvetica,sans-serif"><title>${esc(name)}</title><desc>${esc(desc)}</desc>${body}</svg>`;}
  function actor(x,y,s,wx,wy,mirror=false){
    if(!mirror)return window.RFArt.person(x,y,(wx-x)/s,(wy-y)/s,s);
    const reflected=window.RFArt.person(x,y,(x-wx)/s,(wy-y)/s,s);
    return `<g transform="translate(${f(2*x)} 0) scale(-1 1)">${reflected}</g>`;
  }
  function pairedRF(x,y,s=1){
    // Plain modality-frame icons, not invented or recorded signal plots.
    let body=rect(-84,-63,168,60,C.blue,.035,4)+rect(-62,17,168,60,C.gold,.025,4);
    body+=text(0,-32,'Radar',C.blue,32,'middle',700)+text(22,48,'RFID',C.gold,32,'middle',700);
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">${body}</g>`;
  }
  function network(x,y,color=C.mint,s=1){
    let out='';const left=[[-58,-47],[-58,47]],middle=[[0,-65],[0,0],[0,65]],right=[[61,0]];
    left.forEach(a=>middle.forEach(b=>{out+=line(a[0],a[1],b[0],b[1],color,3);}));
    middle.forEach(a=>right.forEach(b=>{out+=line(a[0],a[1],b[0],b[1],color,3);}));
    [...left,...middle,...right].forEach(p=>{out+=`<rect x="${p[0]-7}" y="${p[1]-7}" width="14" height="14" rx="2" fill="${color}"/>`;});
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">${out}</g>`;
  }
  function crossEvidence(t){
    const u=mod(t,10),grow=u<2?0:u<5?smooth((u-2)/3):u<9?1:1-smooth(u-9);
    let out=line(710,30,710,470,C.grid,2)+text(345,40,'Independent heads',C.white,37,'middle',700)+text(1083,40,'Shared evidence',C.white,37,'middle',700);
    [0,745].forEach((off,i)=>{
      out+=window.RFArt.radar(off+66,155,.72)+text(off+176,108,'Radar',C.blue,34,'middle',700);
      out+=window.RFArt.reader(off+65,345,.67)+text(off+176,399,'RFID',C.gold,34,'middle',700);
      out+=poly([[off+215,155],[off+465,155]],C.blue)+poly([[off+215,345],[off+465,345]],C.gold);
      out+=text(off+563,155,'Action',C.white,37,'middle',700)+text(off+563,345,'Target',C.white,37,'middle',700);
      if(i===1){
        // Equivalent information paths: in the actual network, concatenation
        // of pooled features supplies the same fused vector to both heads.
        out+=poly([[off+255,155],[off+327,155],[off+327,345],[off+465,345]],C.blue,5,grow);
        out+=poly([[off+255,345],[off+380,345],[off+380,155],[off+465,155]],C.gold,5,grow);
      }
    });
    out+=text(345,455,'Each head misses the other radio',C.muted,32);
    out+=text(1083,443,'RFID also informs the action',C.gold,32)+text(1083,480,'Radar also informs the target',C.blue,32);
    return svg('Both decisions need both radios',out,'Left: the non-fusion baseline gives the action head only radar features and the target head only RFID features. Right: added information paths show that both heads access both modalities. This is an information-routing illustration of feature concatenation, not predicted scores or additional trainable cross-connections.');
  }
  function asynchronous(t){
    const FRAME_MS=100,END_MS=400,x0=282,width=1115,map=ms=>x0+width*ms/END_MS;
    const reads=[18,44,91,126,209,248,269,334,372,389]; // Illustrative timestamps only.
    const u=mod(t,10),now=u<8?END_MS*smooth(u/8):END_MS;
    let out=text(0,140,'Radar frames',C.blue,34,'start',700)+text(0,325,'RFID reads',C.gold,34,'start',700);
    [0,100,200,300,400].forEach(ms=>{out+=line(map(ms),70,map(ms),389,C.grid,2)+text(map(ms),34,String(ms),C.muted,32);});
    for(let i=0;i<4;i++){
      const start=i*FRAME_MS,end=start+FRAME_MS,visible=clamp((now-start)/FRAME_MS),x=map(start)+10,w=width/4-20;
      out+=rect(x,105,w,73,C.blue,.035,5);
      if(visible>0)out+=`<rect x="${f(x+3)}" y="108" width="${f((w-6)*visible)}" height="67" rx="3" fill="${C.blue}" fill-opacity=".18"/>`;
      out+=text(x+w/2,142,'Frame '+(i+1),C.white,34,'middle',700);
      const count=reads.filter(ms=>ms>=start&&ms<end&&ms<=now).length;
      const countLabel=now<start?'Pending':count+(count===1?' read':' reads')+(now<end?' so far':'');
      out+=text((map(start)+map(end))/2,413,countLabel,C.gold,32,'middle',700);
    }
    out+=text((map(0)+map(100))/2,217,'100 ms',C.blue,32);
    reads.forEach(ms=>{if(ms<=now)out+=path(`M${f(map(ms))} 287V359M${f(map(ms)-7)} 287H${f(map(ms)+7)}`,C.gold,5);});
    out+=line(map(now),249,map(now),375,C.white,2,'opacity=".65"');
    out+=text(840,475,'Illustrative RFID timestamps within fixed radar intervals',C.muted,32);
    return svg('Equal radar intervals contain unequal RFID counts',out,'The radar frame interval is 100 milliseconds in the prototype. RFID timestamps in this teaching example are illustrative, not measured reader rates. As reads arrive, equal radar intervals collect three, one, three and three RFID reads, demonstrating why a fixed one-to-one frame correspondence is inappropriate. The displayed counts are computed from the shown timestamps.');
  }
  function adaptation(t){
    const u=mod(t,12),stage=u<5?'pretrain':'finetune',pre=stage==='pretrain',first=smooth(u/3),second=smooth((u-5)/3);
    let out=text(185,51,'Synthetic RF',C.blue,37,'middle',700)+pairedRF(169,140,1.1);
    out+=text(185,294,'Real RF',C.gold,37,'middle',700)+window.RFArt.radar(111,374,.83)+window.RFArt.reader(241,374,.73)+window.RFArt.book(349,389,.7);
    out+=poly([[390,151],[590,151],[590,226],[683,226]],C.blue,5,first);
    if(!pre)out+=poly([[416,374],[626,374],[626,289],[683,289]],C.gold,5,second);
    out+=network(836,252,pre?C.blue:C.mint,1.34)+text(836,90,pre?'Pre-train':'Continue with real RF',pre?C.blue:C.gold,37,'middle',700);
    out+=text(836,420,pre?'Learn an initialization':'Adapt the same learned weights',C.white,34,'middle',700);
    out+=poly([[950,252],[1110,252]],C.mint)+text(1273,237,'RF-HOI',C.mint,39,'middle',700)+text(1273,281,'model',C.mint,36,'middle',700);
    out+=text(745,484,'The model structure stays fixed across both training stages',C.muted,32);
    return svg('Real fine-tuning continues synthetic pretraining',out,'The same network first learns from synthetic RF and then continues training on a small real RF subset. The network icon remains in the same position and structure. Color and input routes indicate training stage only; no illustrated connection is a numeric weight, accuracy estimate or simulated learning process.');
  }
  function realPairs(t){
    const lift=.5-.5*Math.cos(TAU*mod(t,8)/8),bx=1124,by=230-48*lift;
    let out=text(350,35,'Real training sees both labels',C.white,36,'middle',700)+text(1103,35,'Test a new real pairing',C.white,36,'middle',700)+line(720,80,720,453,C.grid,2);
    out+=window.RFArt.bottle(161,170,1.1)+text(405,172,'pick up + bottle',C.blue,37,'middle',700);
    out+=window.RFArt.book(161,337,1.15)+text(405,338,'open + book',C.gold,37,'middle',700);
    out+=poly([[659,172],[754,172]],C.blue)+poly([[659,338],[754,338]],C.gold);
    out+=actor(978,90,1.08,bx,by)+window.RFArt.book(bx,by,1.07)+text(1115,357,'pick up + book',C.mint,38,'middle',700);
    out+=text(350,452,'Action and object labels stay familiar',C.muted,32);
    out+=text(1100,417,'Omitted from real training',C.white,32)+text(1100,463,'Covered in synthetic pretraining',C.gold,32);
    return svg('Known labels form a held-out real action-object pair',out,'Pick-up-bottle and open-book illustrate real training examples with familiar actions and object identities. Pick-up-book illustrates a pair withheld from real fine-tuning but present in synthetic pretraining. These are explanatory examples of the protocol, not a claim that the paper used exactly these two training observations or that the actor is a measured test sample.');
  }
  function handCover(cx,cy,scale=1){
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${scale})"><path d="M-51 30Q-62 17 -55 2L-40 -28Q-35 -37 -28 -31L-34 -7L-23 -38Q-19 -48 -11 -42L-16 -8L-5 -37Q0 -46 7 -39L2 -4L13 -24Q20 -31 25 -24L17 7Q15 26 -5 42Z" fill="#E1AF8A" stroke="#A57656" stroke-width="2"/></g>`;
  }
  function occlusion(t){
    const u=mod(t,12),mode=u<3?'clear':u<7?'hand':'body',cover=mode==='hand'?smooth((u-3)/.7):0;
    const actorX=605,actorY=91,scale=1.3,targetX=449,targetY=223,otherX=mode==='body'?804:334,otherY=mode==='body'?204:356;
    let out=window.RFArt.radar(115,98,.85)+text(114,40,'Radar',C.blue,34,'middle',700)+window.RFArt.reader(115,240,.9)+text(114,332,'RFID',C.gold,34,'middle',700);
    out+=path('M204 98H555',C.blue,4,'stroke-dasharray="9 10"')+path(`M204 240L${targetX-45} ${targetY}`,C.gold,4,'stroke-dasharray="9 10"');
    out+=path(`M204 250L${otherX-40} ${otherY}`,C.gold,4,'stroke-dasharray="9 10"');
    out+=window.RFArt.book(otherX,otherY,.86)+actor(actorX,actorY,scale,targetX,targetY,true)+window.RFArt.book(targetX,targetY,1.02);
    if(cover>0)out+=`<g opacity="${f(cover)}">${handCover(targetX-5,targetY+26,.49)}</g>`;
    out+=text(448,280,'Moving target',C.white,34,'middle',700)+text(otherX,mode==='body'?298:422,'Non-target',C.muted,32);
    const title=mode==='clear'?'No occlusion':mode==='hand'?'Hand partially covers the target tag':'The body occludes a non-target tag';
    out+=text(864,41,title,C.white,36,'middle',700);
    const tagX=mode==='body'?otherX+4:targetX+5,tagY=mode==='body'?otherY+22:targetY+26;
    out+=line(tagX+40,tagY,1004,tagY,C.grid,2)+line(1004,tagY,1004,240,C.grid,2);
    out+=window.RFArt.tag(1195,240,2.12);
    if(cover>0)out+=`<g opacity="${f(cover)}">${handCover(1156,228,1.35)}</g>`;
    out+=text(1193,144,mode==='body'?'Non-target tag':'Target tag',C.gold,36,'middle',700);
    out+=text(1193,352,mode==='hand'?'Partial hand coverage':mode==='body'?'Object behind the user':'Unobstructed tag',C.muted,32);
    out+=text(780,480,'Separate tested conditions; the radar view of the user stays available',C.muted,32);
    return svg('Occlusion changes specific RFID paths',out,'Three distinct tested conditions are shown in sequence: unobstructed tags, partial hand coverage on the target tag, and the user body between antennas and a non-target object. The target remains in front of the user in the body-occlusion example. Dashed paths describe geometry, not exact attenuation, phase measurements or readability predictions. The enlarged tag is a detail view, not a new object.');
  }
  function preprocess(t){
    const FRAME_MS=100,PREP_MIN_MS=22.83,PREP_MAX_MS=36.52,END_MS=500,x0=267,width=1126,map=ms=>x0+width*ms/END_MS;
    const u=mod(t,12),now=u<9?450*smooth(u/9):450;
    let out=text(0,165,'RF frames',C.blue,35,'start',700)+text(0,283,'Radar',C.gold,35,'start',700)+text(0,326,'processing',C.gold,35,'start',700);
    [0,100,200,300,400,500].forEach(ms=>{out+=line(map(ms),74,map(ms),353,C.grid,2)+text(map(ms),37,String(ms),C.muted,32);});
    for(let i=0;i<4;i++){
      const start=i*FRAME_MS,end=start+FRAME_MS,x=map(start)+3,w=map(end)-map(start)-6,acquired=clamp((now-start)/FRAME_MS),processed=clamp((now-end)/PREP_MAX_MS);
      out+=rect(x,124,w,75,C.blue,.035,4);
      if(acquired>0)out+=`<rect x="${f(x+3)}" y="127" width="${f((w-6)*acquired)}" height="69" fill="${C.blue}" fill-opacity=".20" rx="3"/>`;
      out+=text(x+w/2,163,'Frame '+(i+1),C.white,34,'middle',acquired>.999?700:400);
      const px=map(end),pw=map(end+PREP_MAX_MS)-px;
      out+=rect(px,267,pw,62,C.gold,.025,4);
      if(processed>0)out+=`<rect x="${f(px+2)}" y="270" width="${f(Math.max(0,pw-4)*processed)}" height="56" fill="${C.gold}" fill-opacity=".28" rx="2"/>`;
      out+=text(px+pw/2,299,String(i+1),C.gold,33,'middle',700);
      out+=poly([[map(end)-2,208],[map(end)-2,249]],C.grid,3);
    }
    const xa=map(100),xb=map(100+PREP_MAX_MS);
    out+=line(xa,365,xb,365,C.gold,3)+line(xa,356,xa,374,C.gold,3)+line(xb,356,xb,374,C.gold,3);
    out+=path(`M${f((xa+xb)/2)} 374V416H601`,C.gold,2)+text(620,433,`${PREP_MIN_MS.toFixed(2)}–${PREP_MAX_MS.toFixed(2)} ms across tested GPUs`,C.gold,34,'start');
    out+=text(830,484,'Schematic frame schedule; each acquisition interval is 100 ms',C.muted,32);
    return svg('Radar preprocessing fits the next frame interval',out,'Physical axis values are milliseconds. Radar acquisition uses the measured prototype frame interval of 100 ms. Each completed frame is followed by an illustrative preprocessing block of 36.52 ms, the largest reported mean across tested GPUs; the reported range is 22.83 to 36.52 ms. These repeated blocks form a schematic schedule, not measured per-frame fluctuations. Work starts only after frame acquisition completes and overlaps subsequent acquisition. No action-boundary or end-to-end event-latency claim is illustrated.');
  }
  function check(x,y,correct){
    return correct?path(`M${f(x-13)} ${f(y)}l9 10 20-24`,C.mint,6):path(`M${f(x-11)} ${f(y-11)}l22 22M${f(x+11)} ${f(y-11)}l-22 22`,C.gold,6);
  }
  function evaluation(t){
    let out=line(568,32,568,463,C.grid,2)+text(270,43,'Real data protocol',C.white,36,'middle',700);
    out+=text(270,128,'3,615 real samples',C.white,37,'middle',700)+poly([[270,170],[270,227]],C.blue);
    out+=path('M270 234L290 254L270 274L250 254Z',C.white,4);
    out+=poly([[250,254],[141,254],[141,312]],C.blue)+poly([[290,254],[411,254],[411,312]],C.gold);
    out+=text(141,354,'30%',C.blue,40,'middle',700)+text(141,398,'training',C.blue,33);
    out+=text(411,354,'70%',C.gold,40,'middle',700)+text(411,398,'held-out test',C.gold,33);
    out+=text(270,467,'Random sample split',C.muted,32);
    out+=text(638,43,'Truth:',C.white,33,'start',700)+text(1003,43,'pick up + book',C.mint,38,'middle',700);
    out+=text(1004,108,'Illustrative scoring examples',C.muted,32);
    out+=text(799,170,'Prediction',C.white,33,'middle',700)+text(1030,170,'Action',C.white,32,'middle',700)+text(1168,170,'Target',C.white,32,'middle',700)+text(1334,170,'HOI',C.white,32,'middle',700);
    const truth={action:'pick up',target:'book'},examples=[{action:'pick up',target:'bottle'},{action:'open',target:'book'},{action:'pick up',target:'book'}];
    examples.forEach((prediction,i)=>{
      const y=241+i*91,actionOK=prediction.action===truth.action,targetOK=prediction.target===truth.target,joint=actionOK&&targetOK;
      out+=line(610,y-41,1422,y-41,C.grid,2)+text(799,y,prediction.action+' + '+prediction.target,C.white,34,'middle',joint?700:400);
      out+=check(1030,y,actionOK)+check(1168,y,targetOK)+text(1334,y,joint?'Correct':'Incorrect',joint?C.mint:C.gold,32,'middle',700);
    });
    out+=text(1012,481,'Both labels must match to count as correct',C.muted,32);
    return svg('Joint accuracy counts only fully correct interactions',out,'Left: 3,615 real samples use a random 30 percent training and 70 percent test split. Right: an explicitly illustrative truth tuple pick-up-book is compared with pick-up-bottle, open-book and pick-up-book predictions. Action and target checks are computed by string equality. A joint interaction is correct only when both checks pass. These examples define the metric and are not measured RF-HOI model outputs.');
  }
  const builders={'cross-evidence':crossEvidence,asynchronous,adaptation,'real-pairs':realPairs,occlusion,preprocess,evaluation};
  window.RFNarrative={names:Object.freeze(Object.keys(builders)),render(name,t){
    const builder=builders[name];if(!builder)return false;
    document.querySelectorAll('[data-narrative]').forEach(node=>{if(node.dataset.narrative===name)node.innerHTML=builder(Number(t)||0);});
    return true;
  }};
})();
