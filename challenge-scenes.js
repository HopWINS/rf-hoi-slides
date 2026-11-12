/* Challenge-led RF-HOI explanations.
 * Sources: supplied paper Secs.3.2,3.3.1–3.3.4,3.5.2 (pp.7–10,13).
 * All architecture grids/glyphs show types and information access, not measured
 * activations, dimensions, classifier confidence or experimental heatmaps.
 * Geometry uses the shared ideal SlideModel, with its documented units and
 * simplifications. Irregular RFID timestamps are an illustrative 400-ms window
 * inside real 100-ms radar intervals, not measured reader timing. Pooling is
 * over each whole sample independently; it does not equate feature dimensions
 * or claim online/causal Transformer operation. The candidate example is the
 * paper's familiar-label recombination example, not an arbitrary zero-shot
 * action/object recognition result. Tag names are known through the tag table.
 */
(function(){
'use strict';
const C={bg:'#002D72',blue:'#68ACE5',gold:'#F1C400',mint:'#96E1CD',white:'#FFFFFF',muted:'#C4D8ED',grid:'#416596'};
const n=x=>Number(x).toFixed(2),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{const q=clamp(x);return q*q*(3-2*q);},mod=(x,m)=>((x%m)+m)%m;
const phase=t=>mod(Number(t)||0,12);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function T(A,x,y,s,c=C.white,size=34,anchor='middle',weight=400){return A.text(x,y,s,c,size,anchor,weight);}
function L(A,x1,y1,x2,y2,c=C.grid,w=2,more=''){return A.path(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`,c,w,more);}
function B(A,x,y,w,h,c=C.blue,fill=.035){return A.rect(x,y,w,h,c,8,fill);}
function arrow(A,d,c=C.mint,w=4){return A.lineArrow(d,c,w);}
function feature(A,x,y,c,w=150,h=48,filled=true){const gap=5,cw=(w-15)/4;return Array.from({length:4},(_,i)=>A.rect(x+i*(cw+gap),y,cw,h,c,3,filled?.6:.02)).join('');}
function combined(A,x,y,w=202,h=46,fill=true){const half=(w-8)/2;return feature(A,x,y,C.blue,half,h,fill)+feature(A,x+half+8,y,C.gold,half,h,fill);}
function svg(A,out,title,desc){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 520" role="img" aria-label="${esc(title)}" style="font-family:Arial,Helvetica,sans-serif"><title>${esc(title)}</title><desc>${esc(desc)}</desc>${A.defs()}${out}</svg>`;}
function grid(A,x,y,w,h,c=C.blue){let o=B(A,x,y,w,h,c);for(let i=1;i<5;i++)o+=L(A,x+i*w/5,y,x+i*w/5,y+h,c,1.3);for(let i=1;i<4;i++)o+=L(A,x,y+i*h/4,x+w,y+i*h/4,c,1.3);return o;}
function mapIcon(A,x,y,w=136,h=92,kind=0){let o=grid(A,x,y,w,h,C.blue);const pts=kind===0?[[.18,.68],[.4,.56],[.63,.39],[.83,.25]]:kind===1?[[.25,.7],[.4,.48],[.58,.32],[.75,.39]]:[[.25,.62],[.4,.4],[.6,.4],[.75,.62]];pts.forEach(([xx,yy],i)=>{o+=A.rect(x+xx*w-7,y+yy*h-7,14,14,C.blue,2,.5+i*.1);});return o;}
function rawFrame(A,x,y,c,w=30,h=44){return B(A,x,y,w,h,c)+A.path(`M${n(x+7)} ${n(y+12)}H${n(x+w-7)}M${n(x+7)} ${n(y+23)}H${n(x+w-7)}M${n(x+7)} ${n(y+34)}H${n(x+w-7)}`,c,2);}
function cross(A,x,y,c=C.gold,size=10){return L(A,x-size,y-size,x+size,y+size,c,4)+L(A,x-size,y+size,x+size,y-size,c,4);}
function actor(A,t,x=690,y=150,s=1.05){const M=window.SlideModel,st=M.state(t),bx=x+110*s+16*st.lift,by=y+114*s-58*st.lift;return A.person(x,y,(bx-x)/s,(by-y)/s,s)+A.book(bx,by,.79)+A.table(x+72*s,y+163*s,155*s);}

function overview(t,A){
let o=T(A,350,42,'CHALLENGE 1',C.gold,29,'middle',700)+T(A,1090,42,'CHALLENGE 2',C.gold,29,'middle',700);
o+=T(A,350,99,'Make unlike evidence work together',C.white,37,'middle',700)+T(A,1090,99,'Cover real-world variation',C.white,37,'middle',700);
o+=L(A,720,30,720,480,C.grid,2);
o+=mapIcon(A,110,159,152,101,0)+A.tag(421,201,.7);
[0,25,84,118].forEach(x=>{o+=L(A,325+x,255,325+x,295,C.gold,4);});
o+=T(A,350,342,'Different meanings and different clocks',C.muted,32);
o+=arrow(A,'M350 371V410',C.mint,4)+T(A,350,457,'Encode separately, fuse jointly',C.mint,36,'middle',700);
// Coverage factors are conceptual; no dataset size is implied by these icons.
o+=grid(A,870,159,114,95,C.blue)+T(A,927,291,'Rooms',C.muted,32);
o+=A.person(1060,166,58,60,.40)+A.person(1116,166,58,60,.40)+T(A,1090,291,'People',C.muted,32);
o+=A.radar(1251,205,.67)+T(A,1251,291,'Geometry',C.muted,32);
o+=T(A,1090,342,'Too many combinations to record',C.muted,32);
o+=arrow(A,'M1090 371V410',C.mint,4)+T(A,1090,457,'Generate RF from motion and physics',C.mint,35,'middle',700);
return svg(A,o,'Complementary radios leave two challenges: heterogeneous evidence and real-world coverage','Roadmap: independently encode spatial and temporal modality features before joint prediction; synthesize paired RF from annotated motion and physics to broaden coverage. Conceptual icons are not counts or experimental data.');
}
function representations(t,A){
const p=phase(t),u=smooth((p-2)/3),ready=p>5&&p<11.5;
let o=T(A,254,39,'Dense motion maps',C.blue,37,'middle',700)+T(A,1176,39,'Object-linked readings',C.gold,37,'middle',700)+T(A,720,48,'One interaction',C.white,33,'middle',700);
o+=mapIcon(A,15,117,136,92,0)+mapIcon(A,185,117,136,92,1)+mapIcon(A,355,117,136,92,2);
o+=T(A,83,251,'Range–time',C.muted,31)+T(A,253,251,'Doppler',C.muted,31)+T(A,423,251,'Angle',C.muted,31);
o+=actor(A,t,656,125,1.03);
// Different topology, not a made-up numeric RFID observation.
o+=B(A,964,104,433,177,C.gold);const ys=[139,192,245];['Tag A','Tag B','Tag C'].forEach((name,i)=>{o+=T(A,1002,ys[i],name,C.gold,32,'start');for(let j=0;j<4;j++)o+=B(A,1148+j*55,ys[i]-18,34,36,C.gold,.12);});
o+=T(A,1180,314,'Per-tag phase, across antennas',C.muted,32);
o+=arrow(A,'M253 287V334',C.blue,4)+B(A,89,353,328,68,C.blue)+T(A,253,387,'CNN map encoders',C.white,33,'middle',700);
o+=arrow(A,'M1180 338V353',C.gold,4)+B(A,1018,371,328,68,C.gold)+T(A,1182,405,'Phase encoder',C.white,33,'middle',700);
if(u>0){o+=feature(A,170,453,C.blue,168,43,ready)+feature(A,1093,453,C.gold,178,43,ready);}
o+=arrow(A,'M253 424V441',C.blue,3)+arrow(A,'M1180 441V452',C.gold,3);
o+=T(A,720,447,'Separate tag metadata',C.muted,31)+T(A,720,485,'A: book   B: bottle   C: phone',C.gold,32);
return svg(A,o,'Radar maps and per-object RFID readings need different spatial encoders','Schematic representation shapes only. Radar uses three spectrum heatmaps with dedicated CNN encoders; RFID projects only per-tag/per-antenna phase cues at this stage. The separate tag-to-name table supplies metadata; names bypass temporal encoding and join after mean pooling on the following architecture page. The body drawing depicts one common interaction and is not a reconstructed subject. Feature glyphs are not values or exact layer dimensions.');
}
function geometry(t,A){
const M=window.SlideModel,s=M.state(t),pts=M.samples(),bx=351+72*s.lift,by=239-76*s.lift;
const rangeChange=M.distance(s.object,M.ANTENNAS[0])-M.distance(M.objectPosition(s.u-M.SAMPLE_INTERVAL/M.DURATION_SECONDS),M.ANTENNAS[0]);
let o=T(A,304,36,'Tag identity stays fixed',C.gold,35,'middle',700)+T(A,1050,36,'Motion changes the phase cue',C.white,35,'middle',700);
o+=A.reader(68,172,.65)+A.reader(68,353,.65)+T(A,68,232,'Ant. 1',C.muted,31)+T(A,68,408,'Ant. 2',C.muted,31);
o+=L(A,113,172,bx-34,by,C.gold,4,'stroke-dasharray="8 8"')+L(A,113,353,bx-34,by,C.blue,4,'stroke-dasharray="8 8"');
o+=A.book(bx,by,1.05)+T(A,351,103,'ID → book',C.gold,36,'middle',700)+A.tag(441,381,.69)+T(A,440,431,'Static candidate',C.muted,31);
o+=T(A,324,477,'Range change '+(rangeChange>=0?'+':'')+(rangeChange*1000).toFixed(1)+' mm',C.white,33,'middle',700);
const q={x:726,y:115,w:642,h:268,min:-.8,max:.8};
o+=L(A,q.x,q.y,q.x,q.y+q.h,C.grid,2)+L(A,q.x,q.y+q.h/2,q.x+q.w,q.y+q.h/2,C.grid,2);
[-.8,0,.8].forEach(v=>o+=T(A,q.x-20,q.y+q.h-(v+.8)/1.6*q.h,String(v),C.muted,31,'end'));
o+=T(A,1046,80,'Modeled adjacent-frame phase change (rad)',C.muted,32);
o+=A.plot(pts,{...q,value:x=>x.phases[0]},C.gold,4.5)+A.plot(pts,{...q,value:x=>x.phases[1]},C.blue,4.5,'stroke-dasharray="8 7"');
o+=L(A,q.x,q.y+q.h/2,q.x+q.w,q.y+q.h/2,C.muted,2.5,'stroke-dasharray="9 7"');
const xx=q.x+s.u*q.w;o+=L(A,xx,q.y-5,xx,q.y+q.h+5,C.muted,1.5);s.phases.forEach((v,i)=>o+=A.dot(xx,q.y+q.h-(v+.8)/1.6*q.h,i?C.blue:C.gold,7));
o+=T(A,1347,151,'Ant. 1',C.gold,31,'end')+T(A,1347,189,'Ant. 2',C.blue,31,'end');
o+=T(A,q.x,427,'0 s',C.muted,31,'start')+T(A,q.x+q.w,427,'2.4 s',C.muted,31,'end')+T(A,1051,476,'Static object: zero motion-induced change',C.muted,32);

return svg(A,o,'Motion changes range and adjacent-frame RFID phase while tag identity stays fixed','The shared ideal geometric model supplies both the moving book and plotted phase samples. Phase increments use adjacent 0.05-second samples, 0.33-meter wavelength, and a 2.4-second lift/return trajectory. Unknown multipath is omitted; no localization or measured phase claim is made. Known tag ID supplies the candidate name.');
}
const READ_MS=Object.freeze([18,44,91,126,209,248,269,334,372,389]);
function clockState(t){const p=phase(t),now=p<8?400*smooth(p/8):400;return {now,counts:[0,1,2,3].map(k=>READ_MS.filter(v=>v>=100*k&&v<100*(k+1)&&v<=now).length),complete:[0,1,2,3].map(k=>now>=100*(k+1))};}
function clocks(t,A){
const s=clockState(t),x0=256,w=1070,map=ms=>x0+ms/400*w;let o=T(A,23,49,'Time (ms)',C.muted,31,'start');
o+=T(A,23,131,'Radar frames',C.blue,35,'start',700)+T(A,23,316,'RFID reads',C.gold,35,'start',700);
[0,100,200,300,400].forEach(v=>{const xx=map(v);o+=T(A,xx,49,String(v),C.muted,32)+L(A,xx,82,xx,363,C.grid,2);});
for(let k=0;k<4;k++){
 const x=map(k*100),cw=w/4;const done=s.complete[k];
 o+=B(A,x+9,105,cw-18,62,C.blue,.035)+T(A,x+cw/2,136,'Frame '+(k+1),C.white,34,'middle',700);
 o+=L(A,x+cw/2,173,x+cw/2,236,C.muted,2,'stroke-dasharray="5 7"');
 if(done&&s.counts[k]!==1)o+=cross(A,x+cw/2,211,C.gold,12);
 o+=T(A,x+cw/2,259,'1 frame',C.blue,32);
 const count=s.counts[k],word=count===1?'read':'reads';
 const label=s.now<k*100?'Pending':done?`${count} ${word}`:`${count} ${word} so far`;
 o+=T(A,x+cw/2,402,label,C.gold,33,'middle',700);
}
READ_MS.forEach(ms=>{if(ms<=s.now)o+=L(A,map(ms),298,map(ms),349,C.gold,5)+A.dot(map(ms),298,C.gold,4);});
o+=T(A,817,473,s.now<100?'Watch one fixed radar interval fill with RFID reads':'One frame does not imply one RFID reading',C.white,36,'middle',700);
return svg(A,o,'A fixed radar frame can contain different numbers of RFID readings','Radar frames are 100 milliseconds. The ten illustrative RFID readings at18,44,91,126,209,248,269,334,372,389milliseconds produce completed-window counts3,1,3,3. Crosses mark failed one-to-one assumptions, not failed RF reception. The diagram disproves a fixed one-to-one cross-modal frame correspondence, not the possibility of preprocessing alignment within RFID. Presentation time is distinct from the physical400-ms window.');
}
function summaryState(t){
 const p=phase(t),fresh=p>11.5;
 const encode=fresh?0:smooth((p-1)/2),pool=fresh?0:smooth((p-3)/2.7),nameProjection=fresh?0:smooth((p-1)/2);
 const pooled=pool>.995,namesReady=nameProjection>.995,joined=pooled&&namesReady;
 const alignment=joined?smooth((p-5.9)/2.2):0;
 return {p,encode,pool,nameProjection,pooled,namesReady,joined,alignment,aligned:alignment>.995};
}
function summaries(t,A){
const s=summaryState(t);let o='';
const rows=[{y:112,color:C.blue,label:'8 radar frames',times:[0,.14,.28,.42,.56,.70,.84,1],targetX:1290,sw:130},
 {y:310,color:C.gold,label:'RFID phase',times:[.01,.07,.16,.18,.31,.47,.51,.57,.73,.75,.90,.96],targetX:840,sw:110}];
rows.forEach(r=>{
 o+=T(A,145,r.y-70,r.label,r.color,34,'middle',700);
 r.times.forEach(q=>{o+=r.color===C.blue?rawFrame(A,40+q*225,r.y-20,r.color,25,42):L(A,40+q*225,r.y-22,40+q*225,r.y+22,r.color,4);});
 o+=arrow(A,`M294 ${r.y}H322`,r.color,4)+B(A,340,r.y-47,260,94,r.color);
 o+=T(A,470,r.y-16,'Temporal',C.white,32,'middle',700)+T(A,470,r.y+20,'Transformer',C.white,32,'middle',700);
 o+=arrow(A,`M619 ${r.y}H656`,r.color,4)+L(A,656,r.y,r.color===C.blue?1267:968,r.y,C.grid,2)+T(A,800,r.y-70,'Mean pool',r.color,34,'middle',700);
 if(!s.pooled){r.times.forEach((q,i)=>{
   const x0=675+i/(r.times.length-1)*130,xx=x0+(r.targetX-x0)*s.pool,ww=8+(r.sw-8)*s.pool;
   o+=B(A,xx,r.y-22,ww,44,r.color,s.encode>.01?.45:.02);
 });}
 // Pooling has one output rather than accumulated overlapping opacity.
 o+=feature(A,r.targetX,r.y-23,r.color,r.sw,46,s.pooled);
});
o+=arrow(A,'M968 112H1267',C.blue,4)+T(A,1280,42,'Radar summary',C.blue,34,'middle',700);
// Object names form a separate non-temporal branch. The full branch is gold
// because this is still RFID evidence; no radar component enters here.
o+=T(A,145,438,'Known names',C.gold,33,'middle',700)+T(A,145,483,'book, bottle, phone',C.gold,32);
o+=arrow(A,'M300 483H318',C.gold,4)+B(A,335,432,300,72,C.gold);
o+=T(A,485,451,'Name embedding',C.white,32,'middle',700)+T(A,485,486,'projection',C.white,32,'middle',700);
o+=arrow(A,'M654 483H699',C.gold,4)+feature(A,725,460,C.gold,135,46,s.namesReady);
// Both inputs join only after the phase sequence has been pooled.
o+=arrow(A,'M968 310H997V333',C.gold,4)+arrow(A,'M879 483H915V385H923',C.gold,4);
o+=B(A,940,350,115,70,C.gold,s.joined?.17:.02)+T(A,997,385,'Join',C.white,32,'middle',700);
o+=arrow(A,'M1073 385H1082',C.gold,3.5)+B(A,1100,350,115,70,C.gold,s.aligned?.17:.02)+T(A,1157,385,'Align',C.white,32,'middle',700);
o+=arrow(A,'M1233 385H1267',C.gold,4)+feature(A,1290,362,C.gold,130,46,s.aligned);
o+=T(A,1280,456,'RFID summary',C.gold,34,'middle',700)+T(A,1147,501,'Names join after pooling',C.muted,31);
return svg(A,o,'Prepare compatible summaries before cross-modal fusion','Both phase-feature and radar-feature sequences use their own temporal Transformer followed by mean pooling. Known object names take a separate embedding/projection branch, bypass temporal processing, and join only with the pooled RFID phase features. A linear alignment block then prepares the RFID summary for later concatenation with radar. All glyphs are schematic structure, not activations or exact dimensions. The entire RFID branch remains RFID colored through alignment.');
}
function shared(t,A){
const p=phase(t),merge=smooth((p-1.5)/3),share=smooth((p-4.6)/2.8),reset=p>11.4,m=reset?0:merge,s=reset?0:share;
let o=T(A,332,34,'Independent decisions',C.white,37,'middle',700)+T(A,1091,34,'Shared evidence',C.white,37,'middle',700)+L(A,711,22,711,489,C.grid,2);
o+=A.radar(50,154,.54)+A.reader(50,341,.52);
o+=feature(A,136,129,C.blue,150,49)+feature(A,136,315,C.gold,150,49);
o+=arrow(A,'M309 154H401',C.blue,4)+arrow(A,'M309 340H401',C.gold,4);
o+=B(A,422,119,223,69,C.blue)+T(A,533,154,'Action',C.white,35,'middle',700)+B(A,422,305,223,69,C.gold)+T(A,533,340,'Target',C.white,35,'middle',700);
o+=T(A,335,451,'Each head misses the other radio',C.gold,33,'middle',700);
// Merge complete modality summaries; do not imply per-frame matching.
const bx=779,by=153+(228-153)*m,gx=779,gy=338+(280-338)*m;
o+=feature(A,bx,by-22,C.blue,140,44)+feature(A,gx,gy-22,C.gold,140,44);
o+=arrow(A,`M941 ${n(by)}H994V251H1029`,C.blue,4)+arrow(A,`M941 ${n(gy)}H994V284H1029`,C.gold,4);
o+=combined(A,1044,229,177,51,m>.995);
o+=T(A,1131,180,'Concatenate',C.white,33,'middle',700);
o+=arrow(A,'M1239 254H1262V111H1271',C.mint,4)+arrow(A,'M1262 254V398H1271',C.mint,4);
o+=T(A,1341,65,'Action',C.white,33,'middle',700)+T(A,1341,450,'Target',C.white,33,'middle',700);
o+=combined(A,1287,92,128,42,s>.995)+combined(A,1287,377,128,42,s>.995);
if(s>0&&s<.995){o+=combined(A,1100+187*s,92,128,42,true)+combined(A,1100+187*s,377,128,42,true);}
o+=T(A,1090,494,'Both heads receive both modalities',C.mint,33,'middle',700);
return svg(A,o,'Both decisions need access to both radio modalities','Fixed independent baseline: action uses radar only and target uses RFID only. Design change: whole-sample summaries concatenate, then identical two-color fused information reaches both heads. Colors denote modality access, not learned activations, confidence or numerical predictions.');
}
function compositional(t,A){
const p=phase(t),lookup=smooth((p-2)/2.5),compose=smooth((p-5)/2.5),ready=compose>.5;
let o=T(A,318,36,'One class per pair',C.white,37,'middle',700)+T(A,1085,36,'Separate action and target',C.white,37,'middle',700)+L(A,690,32,690,486,C.grid,2);
o+=A.book(275,114,.84)+A.bottle(476,114,.61)+T(A,275,166,'book',C.muted,32)+T(A,476,166,'bottle',C.muted,32);
o+=T(A,31,249,'pick up',C.blue,34,'start',700)+T(A,31,363,'open',C.blue,34,'start',700);
const xx=[187,387],yy=[208,322];for(let r=0;r<2;r++)for(let c=0;c<2;c++)o+=B(A,xx[c],yy[r],176,82,(r===0&&c===0)?C.gold:C.grid,.015);
o+=T(A,275,249,'new pair',C.gold,33,'middle',700)+T(A,475,249,'seen',C.muted,33)+T(A,275,363,'seen',C.muted,33)+T(A,475,363,'—',C.muted,33);
o+=T(A,318,465,'New combination becomes a new class',C.gold,32,'middle',700);
o+=T(A,772,104,'Action',C.blue,33,'start',700)+arrow(A,'M914 104H995',C.blue,4)+T(A,1167,104,'pick up',C.blue,39,'middle',700);
o+=T(A,775,192,'Current candidates',C.muted,32,'start');
o+=A.bottle(819,267,.65)+A.book(960,267,.84)+T(A,819,330,'1  bottle',C.muted,31)+T(A,960,330,'2  book',C.gold,32,'middle',700)+B(A,910,224,104,86,C.gold,.025);
o+=arrow(A,'M1032 269H1082',C.gold,4)+T(A,1180,220,'Target index',C.gold,32,'middle',700)+T(A,1180,270,'2',C.gold,45,'middle',700);
o+=arrow(A,'M1243 269H1280',C.gold,4)+T(A,1356,269,lookup>.5?'book':'name',C.gold,35,'middle',700);
o+=arrow(A,'M1167 140H1425V363H1100V389',C.blue,3.5)+arrow(A,'M1356 300V424H1300',C.gold,3.5);
o+=T(A,1100,424,ready?'〈pick up, book〉':'Compose action + object',ready?C.mint:C.muted,ready?43:34,'middle',ready?700:400);
o+=T(A,1100,484,'Known labels can form a different pair',C.muted,32);
return svg(A,o,'A candidate-index target output can compose known labels without a fixed class for every pair','The paper illustrates familiar pick-up-bottle and open-book constituents recombining as pick-up-book. The matrix is illustrative training-label coverage, not experimental counts. The right target head predicts current candidate index2; a known tag/name table supplies book. Separate outputs permit representation of recombinations; they do not alone prove arbitrary zero-shot recognition or learning unseen actions.');
}
const builders={overview,representations,geometry,clocks,summaries,shared,compositional};
window.RFChallenges={names:Object.freeze(Object.keys(builders)),clockState,summaryState,render(name,t){const fn=builders[name],A=window.RFArt;if(!fn||!A)return false;document.querySelectorAll(`[data-challenge="${name}"]`).forEach(el=>{el.innerHTML=fn(Number(t)||0,A).replace(/arrow-(radar|tag|fused)/g,`arrow-challenge-${name}-$1`);});return true;}};
})();
