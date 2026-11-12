/* Native SVG teaching diagrams. See model.js for all numerical assumptions.
   Curves represent schematic motion or modeled geometry, never measurements. */
(function(){
'use strict';
const C={bg:'#002D72',radar:'#68ACE5',tag:'#F1C400',fused:'#96E1CD',white:'#FFFFFF',muted:'#C4D8ED',grid:'#416596'};
const M=window.SlideModel;
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n=x=>Number(x).toFixed(2);
function text(x,y,v,c=C.white,size=31,anchor='middle',weight=400){return `<text x="${n(x)}" y="${n(y)}" fill="${c}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" dominant-baseline="middle">${esc(v)}</text>`;}
function path(d,c=C.white,w=5,more=''){return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${more}/>`;}
function lineArrow(d,c=C.radar,w=5){const k=c===C.tag?'tag':c===C.fused?'fused':'radar';return path(d,c,w,`marker-end="url(#arrow-${k})"`);}
function arrow(x1,y1,x2,y2,c=C.radar,w=5){return lineArrow(`M${n(x1)} ${n(y1)}H${n(x2)}`,c,w);}
function rect(x,y,w,h,c=C.radar,rx=14,op=.08){return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${c}" fill-opacity="${op}" stroke="${c}" stroke-width="3"/>`;}
function dot(x,y,c=C.white,r=6){return `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${c}"/>`;}
function tag(x,y,s=1){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><rect x="-53" y="-21" width="106" height="42" rx="7" fill="${C.bg}" stroke="${C.tag}" stroke-width="1.6"/>${path('M-46 0H-36V-12H-26V12H-16V-12H-6M6 -12H16V12H26V-12H36V0H46',C.tag,3.5)}<rect x="-7" y="-7" width="14" height="14" fill="${C.tag}" rx="2"/></g>`;}
function book(x,y,s=1,c=C.white){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><path d="M-37 -33H28Q38 -33 38 -24V29H-34Q-40 29 -40 22V-25Q-40 -33 -37 -33Z" fill="#DDEAF5" stroke="${C.radar}" stroke-width="3"/><path d="M-37 -33H-25V29H-34Q-40 29 -40 22V-25Q-40 -33 -37 -33Z" fill="${C.radar}"/><path d="M-25 -26H29V21H-25" fill="#F4F8FC"/><path d="M-13 -13H20M-13 -4H20M-13 5H9" stroke="#83A5C6" stroke-width="2.5" stroke-linecap="round"/>${tag(5,25,.31)}</g>`;}
function bottle(x,y,s=1){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><path d="M-11 -36H11V-20Q11 -15 19 -9Q26 -3 26 8V35Q26 43 18 43H-18Q-26 43 -26 35V8Q-26 -3 -19 -9Q-11 -15 -11 -20Z" fill="#A8D7F0" fill-opacity=".35" stroke="#D7EBF9" stroke-width="3"/><rect x="-13" y="-44" width="26" height="11" rx="3" fill="${C.radar}" stroke="#D7EBF9" stroke-width="2"/><path d="M-17 4V31" stroke="#D7EBF9" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/>${tag(0,19,.35)}</g>`;}
function radar(x,y,s=1){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><rect x="-35" y="-35" width="70" height="70" rx="10" fill="#DFEDF7" stroke="${C.radar}" stroke-width="3"/><rect x="-22" y="-21" width="44" height="42" rx="4" fill="#8BB8D9"/><rect x="-8" y="-8" width="16" height="16" rx="2" fill="#264E7B"/>${[-24,24].flatMap(a=>[-24,24].map(b=>dot(a,b,'#648BAD',2.5))).join('')}${path('M45 -24Q66 0 45 24M58 -36Q89 0 58 36',C.radar,3.5)}</g>`;}
/* The hand target is exact in local coordinates. A two-link arm computes the
   elbow from shoulder and wrist; a small torso lean keeps everyday reaches
   natural. This is an explanatory pose, not a reconstructed human mesh. */
function reader(x,y,s=1){return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})"><rect x="-31" y="-42" width="62" height="84" rx="9" fill="#DCEAF6" stroke="${C.tag}" stroke-width="2.5"/><rect x="-22" y="-32" width="44" height="64" rx="5" fill="#EDF5FA"/><path d="M-10 -16Q8 0 -10 16M3 -25Q30 0 3 25" fill="none" stroke="#D6AD00" stroke-width="3.5" stroke-linecap="round"/><path d="M-23 44H23M0 43V58" fill="none" stroke="#8BAECF" stroke-width="5"/></g>`;}
function person(x,y,hx=100,hy=102,s=1,options={}){
 const seated=Math.max(0,Math.min(1,options.seated??(options.pose==='seated'?1:0)));
 const lean=Math.max(0,Math.min(43,(hx-85)*.60));
 const sx=lean+17,sy=49+lean*.15,dx=hx-sx,dy=hy-sy,d=Math.hypot(dx,dy);
 const armScale=Math.max(1,d/130.5),a=62*armScale,b=69*armScale;
 const theta=Math.atan2(dy,dx),cosA=Math.max(-1,Math.min(1,(d*d+a*a-b*b)/(2*Math.max(d,1e-6)*a)));
 const elbowAngle=theta+Math.acos(cosA),ex=sx+a*Math.cos(elbowAngle),ey=sy+a*Math.sin(elbowAngle);
 const capx=sx+(ex-sx)*.44,capy=sy+(ey-sy)*.44;
 const lerp=(v,w)=>v+(w-v)*seated;
 const backK={x:lerp(-16,55),y:lerp(160,132)},backF={x:lerp(-23,52),y:lerp(202,160)};
 const frontK={x:lerp(19,72),y:lerp(158,133)},frontF={x:lerp(30,72),y:lerp(202,160)};
 const leg=(hip,knee,foot,col)=>path(`M${hip} 113Q${n(knee.x)} ${n(knee.y-12)} ${n(knee.x)} ${n(knee.y)}L${n(foot.x)} ${n(foot.y)}`,col,21);
 const shoe=f=>`<path d="M${n(f.x-9)} ${n(f.y-4)}Q${n(f.x+4)} ${n(f.y-3)} ${n(f.x+11)} ${n(f.y+2)}L${n(f.x+21)} ${n(f.y+3)}Q${n(f.x+25)} ${n(f.y+8)} ${n(f.x+19)} ${n(f.y+9)}H${n(f.x-10)}Z" fill="#142B4D" stroke="#BCD3E7" stroke-width="1.5"/>`;
 let o=leg(-12,backK,backF,'#4D7AAB')+shoe(backF)+leg(12,frontK,frontF,'#729EC8')+shoe(frontF);
 o+=path(`M${n(lean-14)} 49Q-30 80 -27 112`,'#C99773',13)+`<ellipse cx="-27" cy="119" rx="7" ry="10" fill="#C99773"/>`;
 o+=`<path d="M${n(lean-21)} 33Q${n(lean+5)} 28 ${n(lean+28)} 40L${n(lean+28)} 66Q21 91 24 119Q0 126 -24 116L-21 81Z" fill="#E7F1F9" stroke="#AECBE2" stroke-width="1.8"/>`;
 o+=`<path d="M${n(lean-4)} 18L${n(lean-5)} 35Q${n(lean+5)} 44 ${n(lean+15)} 34L${n(lean+11)} 16Z" fill="#D8A37E"/><path d="M${n(lean-16)} -15Q${n(lean-5)} -27 ${n(lean+12)} -20Q${n(lean+23)} -16 ${n(lean+21)} -3L${n(lean+27)} 4Q${n(lean+28)} 8 ${n(lean+21)} 8L${n(lean+19)} 18Q${n(lean+12)} 26 ${n(lean+1)} 22L${n(lean-10)} 13Q${n(lean-17)} 4 ${n(lean-16)} -15Z" fill="#E1AF8A"/>`;
 o+=`<path d="M${n(lean-17)} 2Q${n(lean-24)} -17 ${n(lean-10)} -25Q${n(lean+9)} -34 ${n(lean+22)} -16L${n(lean+16)} -8Q${n(lean+4)} -14 ${n(lean-3)} -7L${n(lean-5)} 7L${n(lean-11)} 9Z" fill="#172D4B"/><path d="M${n(lean-9)} 1q7-5 9 3q-1 7-7 6" fill="#D8A17D"/><circle cx="${n(lean+16)}" cy="-1" r="1.7" fill="#243C58"/>`;
 o+=path(`M${n(capx)} ${n(capy)}L${n(ex)} ${n(ey)}L${n(hx)} ${n(hy)}`,'#E1AF8A',13);
 o+=path(`M${n(sx)} ${n(sy)}L${n(capx)} ${n(capy)}`,'#C4DDEF',22);
 o+=`<ellipse cx="${n(hx)}" cy="${n(hy)}" rx="9" ry="6.5" fill="#E6B995" transform="rotate(${n(Math.atan2(hy-ey,hx-ex)*180/Math.PI)} ${n(hx)} ${n(hy)})"/>`;
 return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">${o}</g>`;
}
function table(x,y,w=240){return `<g><path d="M${n(x+20)} ${n(y+8)}V${n(y+111)}H${n(x+32)}V${n(y+8)}M${n(x+w-31)} ${n(y+8)}V${n(y+111)}H${n(x+w-19)}V${n(y+8)}" fill="#7DA4C7"/><path d="M${x} ${y-5}H${x+w}V${y+8}H${x}Z" fill="#C1D7E8" stroke="#E6F0F8" stroke-width="2"/><path d="M${x+12} ${y+8}H${x+w-12}V${y+18}H${x+12}Z" fill="#86ADCD"/></g>`;}
function pulse(x,y,w,u,c){return dot(x+w*((u%1+1)%1),y,c,7);}
function plot(points,{x,y,w,h,value,min=-1,max=1},c,width=4,more=''){const ym=a=>y+h-(a-min)/(max-min)*h;return path(points.map((p,i)=>`${i?'L':'M'}${n(x+p.u*w)} ${n(ym(value(p)))}`).join(''),c,width,more);}
function defs(){return `<defs>${['radar','tag','fused'].map(k=>`<marker id="arrow-${k}" markerWidth="20" markerHeight="20" refX="17" refY="9" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L18 9L0 18" fill="none" stroke="${C[k]}" stroke-width="2.6" stroke-linejoin="round"/></marker>`).join('')}</defs>`;}
function svg(body,title,height=430){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${height}" role="img" aria-label="${esc(title)}" style="font-family:Arial,Helvetica,sans-serif">${defs()}${body}</svg>`;}
function interaction(t){
const s=M.state(t),bx=570+s.lift*20,by=229-s.lift*78;
let o=radar(65,122)+text(65,197,'Radar',C.radar,30);
o+=person(415,70,(bx-415)/1.4,(by-70)/1.4,1.4)+table(495,274,240)+book(bx,by,.9)+bottle(691,230,.72);
o+=text(425,405,'No device on the user',C.muted,31)+reader(65,303,.68)+text(65,365,'RFID',C.tag,30);
o+=path('M139 122H258',C.radar,5,'stroke-dasharray="8 9"')+path(`M139 303H458V${n(by)}H${n(bx-50)}`,C.tag,4,'stroke-dasharray="8 9"');
o+=text(1098,103,'Human motion',C.radar,34,'middle',700)+text(1098,144,'What action?',C.white,31);
o+=text(1098,291,'Object identity + motion',C.tag,34,'middle',700)+text(1098,332,'Which target?',C.white,31);
o+=lineArrow('M735 122H817',C.radar)+pulse(749,122,50,s.u*3,C.radar)+lineArrow('M735 303H817',C.tag)+pulse(749,303,50,s.u*3.3,C.tag);
o+=text(1098,215,'〈pick up, book〉',C.fused,38,'middle',700);
return svg(o,'Radar captures human motion while RFID identifies the tagged target object');}
function ambiguity(t){
const state=M.state(t),points=M.samples();let out='';
[0,750].forEach((off,i)=>{
 const ox=off+455+state.lift*16,oy=245-state.lift*75;
 // A shared floor: actor feet and the table legs both finish near y392.
 out+=radar(off+80,165,.9)+table(off+380,279,250);
 out+=person(off+280,75,(ox-(off+280))/1.5,(oy-75)/1.5,1.5);
 out+=i===0?book(ox,oy,.95):bottle(ox,oy,.68);
 out+=text(off+345,423,i===0?'Pick up a book':'Pick up a bottle',C.white,34,'middle',700);
 // Keep the original waveform aspect ratio. Its row moves as a unit.
 out+=plot(points,{x:off+78,y:459,w:530,h:55,value:q=>Math.sin(2*Math.PI*q.u)*(.7+.2*Math.cos(2*Math.PI*q.u))},C.radar,4);
 out+=dot(off+78+state.u*530,486.5-Math.sin(2*Math.PI*state.u)*(.7+.2*Math.cos(2*Math.PI*state.u))*27.5,C.radar,7);
});
out+=path('M720 30V520',C.grid,2)+text(720,554,'Schematic body motion leaves target identity ambiguous',C.muted,32);
return svg(out,'Two different targets can produce similar body motion observed by radar',600);}
function stationary(t){
const state=M.wipeState(t),handX=330+155*state.handX,handY=265;
// The actor and table share a floor near y461. Uniform scaling preserves the
// table's geometry; the arm endpoint remains on the moving cleaning cloth.
let out=`<g transform="translate(285 272) scale(1.7)">${table(0,0,190)}</g>`;
out+=person(205,60,(handX-205)/1.9,(handY-60)/1.9,1.9)+tag(550,296,.66);
out+=path(`M${n(handX-20)} ${handY}h45`,C.fused,9);
out+=text(390,524,'Wipe a stationary table',C.white,34,'middle',700);
const px=720,py=132,pw=650,ph=135*650/620;
out+=text(1045,74,'Human motion remains visible',C.radar,34,'middle',700);
out+=path(`M${px-10} ${n(py+ph/2)}H${px+pw+10}`,C.grid,2);
out+=plot(M.samples(97),{x:px,y:py,w:pw,h:ph,value:q=>Math.cos(2*Math.PI*q.u)},C.radar,5);
out+=dot(px+state.u*pw,py+ph/2-state.speed*ph/2,C.radar,7);
out+=text(1045,355,'Tag motion stays near zero',C.tag,34,'middle',700);
out+=path(`M${px} 447H${px+pw}`,C.tag,5)+dot(px+state.u*pw,447,C.tag,7);
out+=text(1045,550,'RFID alone misses the action',C.muted,32);
return svg(out,'During wiping the hand moves while the tag attached to the table remains stationary',600);}
function fusion(t){
const s=M.inferenceState(t);let o=text(150,35,'Radar frames',C.radar,32,'middle',700);
for(let i=0;i<6;i++)o+=rect(15+i*48,83,36,57,C.radar,5,.17);
o+=text(150,215,'RFID readings',C.tag,32,'middle',700);[16,57,87,151,182,211,269].forEach((x,i)=>{o+=path(`M${x} 267v${i%2?30:48}`,C.tag,6);});
o+=text(150,376,'Object names',C.tag,31)+arrow(305,111,370,111,C.radar)+pulse(312,111,45,s.packetRadar,C.radar)+arrow(305,288,370,288,C.tag)+pulse(312,288,45,s.packetRfid,C.tag);
o+=rect(395,61,320,105,C.radar)+text(555,94,'Sequence encoder',C.radar,31,'middle',700)+text(555,135,'Temporal pooling',C.white,30);
o+=rect(395,238,320,105,C.tag)+text(555,271,'Sequence encoder',C.tag,31,'middle',700)+text(555,312,'Temporal pooling',C.white,30)+lineArrow('M300 376H553V356',C.tag,4);
o+=lineArrow('M735 113H800V175H835',C.radar)+lineArrow('M735 290H800V255H835',C.tag)+rect(858,159,200,112,C.fused)+text(958,196,'Feature',C.fused,32,'middle',700)+text(958,239,'fusion',C.fused,32,'middle',700);
o+=lineArrow('M1079 215H1110V100H1140',C.fused)+lineArrow('M1110 215V322H1140',C.fused);
o+=rect(1160,47,267,107,C.fused)+text(1293,79,'Action head',C.white,31,'middle',700)+text(1293,123,'pick up',C.fused,33)+rect(1160,269,267,107,C.fused)+text(1293,301,'Target head',C.white,31,'middle',700)+text(1293,345,'candidate index',C.fused,30);
o+=text(707,416,'Each stream keeps its own sequence length',C.muted,31);
return svg(o,'Separate temporal encoders pool asynchronous radar and RFID sequences; both output heads use fused features');}
function phase(t){
const s=M.state(t),pts=M.samples(),tx=349+s.lift*80,ty=180-s.lift*65;
let o=radar(65,94,.65)+radar(65,282,.65)+text(65,147,'Ant. 1',C.radar,30)+text(65,335,'Ant. 2',C.radar,30);
o+=path(`M137 94L${n(tx-45)} ${n(ty)}M137 282L${n(tx-45)} ${n(ty)}`,C.tag,4,'stroke-dasharray="8 8"')+book(tx,ty,.95)+text(380,260,'Moved target',C.tag,31,'middle',700)+tag(389,326,.85)+text(389,389,'Static candidate',C.muted,30);
o+=text(1020,30,'Adjacent-frame phase difference',C.white,32,'middle',700)+path('M658 215H1390M658 70V360',C.grid,2)+text(670,389,'0 s',C.muted,30)+text(1390,389,'2.4 s',C.muted,30,'end');
o+=text(645,82,'0.8',C.muted,30,'end')+text(645,215,'0',C.muted,30,'end')+text(645,348,'−0.8',C.muted,30,'end')+text(720,250,'Static',C.muted,30,'start')+text(1370,95,'Ant. 1',C.tag,30,'end')+text(1370,137,'Ant. 2',C.radar,30,'end');
o+=plot(pts,{x:670,y:82,w:698,h:266,value:p=>p.phases[0],min:-.8,max:.8},C.tag,4.5)+plot(pts,{x:670,y:82,w:698,h:266,value:p=>p.phases[1],min:-.8,max:.8},C.radar,4.5,'stroke-dasharray="8 8"');
o+=path('M670 215H1368',C.muted,3,'stroke-dasharray="10 8"')+path(`M${n(670+s.u*698)} 76V354`,C.white,1.5,'opacity=".5"');
s.phases.forEach((v,i)=>{o+=dot(670+s.u*698,348-(v+.8)/1.6*266,i?C.radar:C.tag,7);});
o+=text(1010,420,'Geometric illustration, fixed scale in radians',C.muted,30);
return svg(o,'Movement changes antenna-to-object range and adjacent-frame backscatter phase; the static candidate stays at zero');}
function synthesis(t){
const s=M.state(t);let o=text(180,27,'Annotated HOI mesh',C.white,31,'middle',700);
o+=person(118,78,(126+13*s.lift)/1.1,(113-54*s.lift)/1.1,1.1)+book(244+13*s.lift,191-54*s.lift,.7)+path('M65 339H297',C.grid,2)+text(180,386,'One shared motion',C.muted,31);
const angle=(-35+70*s.lift)*Math.PI/180,sx=54+12*Math.sin(angle),sy=275+27*Math.cos(angle);
o+=radar(sx,sy,.33)+path(`M${n(sx+29)} ${n(sy)}L147 180`,C.radar,2.5,'stroke-dasharray="6 7"');
o+=lineArrow('M331 224H378V104H425',C.radar)+lineArrow('M378 224V326H425',C.tag);
o+=text(668,85,'Radar ray tracing',C.radar,34,'middle',700)+text(668,130,'Human mesh reflections',C.white,30);
o+=text(668,307,'RFID hand proxy',C.tag,34,'middle',700)+text(668,352,'Distance changes → phase',C.white,30)+text(675,215,'Vary distance and orientation',C.muted,31);
o+=arrow(910,104,1001,104,C.radar)+pulse(916,104,65,s.u*4,C.radar)+arrow(910,326,1001,326,C.tag)+pulse(916,326,65,s.u*3.3,C.tag);
o+=text(1230,36,'Paired synthetic RF data',C.fused,31,'middle',700);
o+=text(1215,93,'Range, Doppler, angle',C.radar,30)+path('M1065 133H1365',C.radar,4)+pulse(1065,133,300,s.u*4,C.radar)+plot(M.samples(),{x:1038,y:286,w:355,h:80,value:p=>p.phases[0],min:-.8,max:.8},C.tag,4);
o+=text(1215,185,'Radar representation',C.radar,30)+text(1215,411,'RFID representation',C.tag,30);
return svg(o,'A shared annotated human motion drives radar ray tracing and RFID hand-trajectory phase synthesis');}
function expansion(t){
const s=M.state(t),idx=Math.floor(s.u*3)%3,names=['jar','bowl','lunchbox'];
let o=text(225,37,'Known interaction primitive',C.white,32,'middle',700)+person(116,80,138/1.1,(125-s.lift*61)/1.1,1.1)+book(254,205-s.lift*61,.8)+text(222,374,'pick up / put down',C.radar,35,'middle',700);
o+=arrow(443,215,538,215,C.fused)+text(734,167,'Object semantics',C.tag,33,'middle',700)+text(734,225,'book → '+names[idx],C.white,36)+text(734,276,'same motion pattern',C.muted,30)+arrow(930,215,1027,215,C.fused)+text(1230,61,'Expanded synthetic data',C.fused,32,'middle',700);
if(idx===0)o+=`<path d="M1174 153H1278V168Q1294 179 1294 199V276H1158V199Q1158 179 1174 168Z" fill="#BBD7EA" fill-opacity=".26" stroke="#DCEBF5" stroke-width="4"/><rect x="1171" y="141" width="110" height="19" rx="4" fill="#81ADCD" stroke="#DCEBF5" stroke-width="2"/><path d="M1171 198V255" stroke="#C8E1F2" stroke-width="4" stroke-linecap="round" opacity=".7"/>`+tag(1226,228,.65);
else if(idx===1)o+=`<path d="M1138 185H1314Q1300 284 1226 284Q1152 284 1138 185Z" fill="#93BFDC" fill-opacity=".55" stroke="#DCEBF5" stroke-width="4"/><path d="M1138 185Q1226 175 1314 185Q1226 204 1138 185Z" fill="#DBECF7" stroke="#DCEBF5" stroke-width="3"/>`+tag(1226,228,.65);
else o+=`<rect x="1138" y="166" width="176" height="117" rx="14" fill="#81B1D3" fill-opacity=".50" stroke="#DCEBF5" stroke-width="3"/><path d="M1138 189H1314V180Q1314 166 1300 166H1152Q1138 166 1138 180Z" fill="#BCD8EB"/><path d="M1195 157V146H1256V157" fill="none" stroke="#DCEBF5" stroke-width="5" stroke-linecap="round"/>`+tag(1226,235,.65);
o+=text(1226,344,names[idx],C.tag,36,'middle',700)+text(740,421,'New object names; familiar interaction dynamics',C.muted,31);
return svg(o,'Synthetic category expansion pairs familiar pick-up and put-down motion with new object semantics');}
function hero(t){
 const s=M.state(t),bx=430+12*s.lift,by=296-92*s.lift;
 let o='';
 o+=path('M146 190Q211 190 258 232',C.radar,4,'stroke-dasharray="9 9"');
 o+=path(`M125 377H338V${n(by+22)}H${n(bx-44)}`,C.tag,4,'stroke-dasharray="9 9"');
 o+=table(350,345,245)+person(260,100,(bx-260)/1.8,(by-100)/1.8,1.8)+book(bx,by,1.08)+bottle(550,291,.9);
 o+=radar(74,191,.88)+text(75,266,'Radar',C.radar,30,'middle',700);
 o+=reader(75,377,.8)+text(75,453,'RFID',C.tag,30,'middle',700);
 o+=text(480,495,'No worn devices',C.muted,29);
 o+=text(366,552,'〈pick up, book〉',C.fused,46,'middle',700);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 600" role="img" aria-label="A person picks up a tagged book while radar senses the action and RFID supplies object identity" style="font-family:Arial,Helvetica,sans-serif">${defs()}${o}</svg>`;
}
window.RFArt={person,book,bottle,tag,table,radar,reader,text,path,rect,svg,dot,arrow,lineArrow,pulse,plot,defs,colors:C};
const renderers={hero,interaction,ambiguity,stationary,fusion,phase,synthesis,expansion};
window.RFScenes={names:Object.keys(renderers),render(name,seconds){const f=renderers[name];if(!f)return;document.querySelectorAll(`[data-scene="${name}"]`).forEach(el=>{el.innerHTML=f(seconds).replace(/arrow-(radar|tag|fused)/g,`arrow-${name}-$1`);});}};
})();
