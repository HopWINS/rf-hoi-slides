/* RF-HOI application diagrams: illustrative sequences and tested conditions.
 * Source: paper Fig. 1; Sections 3.3.4 and 5.6. Illustrations do not simulate
 * recognition scores. Candidate IDs refer to the current input set.
 * Uses the shared RFArt anatomy and physical-object helpers from scenes.js.
 */
(function () {
  'use strict';
  const C = { blue:'#002D72', radar:'#68ACE5', tag:'#F1C400', fused:'#96E1CD', white:'#FFFFFF', muted:'#C4D8ED', grid:'#416596', skin:'#DCA984' };
  const esc = value => String(value).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const num = value => Number(value).toFixed(2);
  const mod = (a,b) => ((a%b)+b)%b;
  const smooth = value => {const u=Math.max(0,Math.min(1,value));return u*u*(3-2*u);};
  function svg(body,label,height=460){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${height}" role="img" aria-label="${esc(label)}" style="font-family:Arial,Helvetica,sans-serif"><defs><marker id="app-arrow" markerWidth="18" markerHeight="18" refX="15" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1L15 8L1 15" fill="none" stroke="${C.fused}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${body}</svg>`;}
  function arrow(A,d,color=C.fused,width=4){return A.path(d,color,width,'marker-end="url(#app-arrow)"');}
  function phone(A,x,y,scale=.8,color=C.white){return `<g transform="translate(${num(x)} ${num(y)}) scale(${scale})">${A.rect(-25,-42,50,84,color,7,0)}${A.path('M-8 30H8',color,3)}${A.tag(0,13,.33)}</g>`;}
  function chair(A,x,y,scale=1,legHeight=61){return `<g transform="translate(${num(x)} ${num(y)}) scale(${scale})">${A.path(`M-24 -66V0H53M-15 0V${legHeight}M46 0V${legHeight}`,C.muted,7)}</g>`;}
  function shortTable(A,x,y,width,legScale=.35){return `<g transform="translate(0 ${num(y)}) scale(1 ${legScale})">${A.table(x,0,width)}</g>`;}
  function packet(A,x,y,color=C.fused){return A.rect(x-7,y-5,14,10,color,2,.95);}
  function context(seconds,A){
    const u=mod(seconds,12)/12;
    const active=Math.min(3,Math.floor(u*5));
    const phase=mod(u*5,1), bend=smooth(phase);
    const centers=[265,580,895,1210];
    const verbs=['Sit down','Stand up','Pick up','Put down'];
    const tuples=['sit down, chair','stand up, chair','pick up, book','put down, book'];
    let out='';
    centers.forEach((cx,i)=>{
      const isCurrent=i===active && u<.8;
      const scale=.88, floor=272;
      let seated=i===0?bend:i===1?1-bend:0;
      if(!isCurrent) seated=i===0?1:0;
      const headY=floor-scale*(207-42*seated);
      const px=cx-56;
      const bookLift=(i===2 ? bend : 1-bend)*76;
      let targetX=cx+56, targetY=191.5-bookLift;
      if(!isCurrent && i===2) targetY=115.5;
      if(!isCurrent && i===3) targetY=191.5;
      if(i<2){
        out+=chair(A,px+14,230,.88,53);
        out+=A.person(px,headY,77,98,scale,{seated});
      } else {
        out+=shortTable(A,cx+24,216,156,.5);
        out+=A.book(targetX,targetY,.78);
        out+=A.person(px,headY,(targetX-px)/scale,(targetY-headY)/scale,scale);
      }
      out+=A.text(cx,325,verbs[i],isCurrent?C.white:C.muted,36,'middle',isCurrent?700:400);
      const shown=u*5>=i+.45;
      const alpha=shown?1:.72;
      out+=`<g opacity="${num(alpha)}">${A.text(cx,410,tuples[i],shown?C.tag:C.muted,35,'middle',700)}</g>`;
      if(i<3)out+=arrow(A,`M${cx+124} 325H${cx+173}`,C.radar,3);
    });
    out+=A.text(8,325,'HAR',C.muted,36,'start',700);
    out+=A.text(8,410,'HOI',C.fused,36,'start',700);
    out+=A.path('M159 366H1366',C.grid,2);
    const goalOpacity=.55+.45*smooth((u-.63)/.19);
    out+=arrow(A,'M370 455V518H747');
    out+=`<g opacity="${num(goalOpacity)}">${A.text(1085,520,'Goal: checking a book',C.fused,43,'middle',700)}</g>`;
    return svg(out,'Four actions involving a chair and a book; object context supports the illustrative goal of checking a book',560);
  }
  function outputs(seconds,A){
    const u=mod(seconds,8)/8;
    let out=A.text(171,79,'Fused features',C.fused,35,'middle',700);
    const heights=[78,118,93,148,108,132,88,120];
    heights.forEach((h,i)=>{const pulse=.88+.12*Math.cos(2*Math.PI*(u-i*.08));out+=A.rect(51+i*29,253-h*pulse,17,h*pulse,i%2?C.tag:C.radar,3,.8);});
    out+=arrow(A,'M307 211H389');
    out+=A.path('M389 211H421V106H456M421 211V309H456',C.fused,4);
    out+=A.rect(478,60,302,92,C.fused,12,.06)+A.text(629,107,'Action classifier',C.white,34,'middle',700);
    out+=A.rect(478,263,302,92,C.fused,12,.06)+A.text(629,310,'Target identifier',C.white,34,'middle',700);
    out+=arrow(A,'M803 106H907')+A.text(1115,107,'pick up',C.fused,44,'middle',700);
    out+=A.text(1115,196,'Current candidate set',C.muted,33,'middle',700);
    out+=A.bottle(934,279,.83)+A.book(1115,279,1.05)+phone(A,1296,279,.83);
    out+=A.rect(1051,230,128,100,C.tag,12,.05);
    out+=A.text(934,371,'1  bottle',C.muted,32)+A.text(1115,371,'2  book',C.tag,34,'middle',700)+A.text(1296,371,'3  phone',C.muted,32);
    out+=arrow(A,'M803 309H846V419H1115V395');
    out+=A.text(626,408,'index in this set',C.muted,33);
    out+=A.text(171,291,'Shared input',C.muted,32);
    out+=packet(A,324+mod(u*3,1)*59,211,C.fused);
    const flow=mod(u*3,1);
    out+=packet(A,817+flow*70,106,C.fused);
    out+=packet(A,861+flow*218,419,C.fused);
    return svg(out,'Both prediction heads share fused RF features. The target head selects candidate index two, which maps to the book in the current candidate set');
  }
  function reader(A,x,y){return A.reader(x,y,.98);}
  function robustness(seconds,A){
    const u=mod(seconds,10)/10, bodyOcclusion=u>=.5;
    const wave=.5-.5*Math.cos(4*Math.PI*u);
    let out=A.text(345,25,'Separate occlusion tests',C.white,34,'middle',700);
    out+=A.text(1106,25,'Nearby unrelated activity',C.white,34,'middle',700);
    out+=A.path('M720 61V449',C.grid,2);
    // RFID and radar have different paths: body blocks only non-target tags.
    out+=reader(A,61,120)+A.text(62,53,'RFID',C.tag,32);
    out+=A.radar(62,270,.57)+A.text(65,331,'Radar',C.radar,32);
    const targetX=443+wave*15,targetY=195-wave*32;
    if(bodyOcclusion){
      out+=A.book(634,140,.61)+A.bottle(627,231,.5);
      out+=A.path('M101 120L613 140',C.tag,4,'stroke-dasharray="9 9"');
      out+=A.path('M102 124L613 225',C.tag,3,'stroke-dasharray="9 9" opacity=".65"');
    } else {
      out+=A.book(632,140,.61)+A.bottle(627,231,.5);
      out+=A.path(`M102 120L${num(targetX-18)} ${num(targetY+14)}`,C.tag,4,'stroke-dasharray="9 9"');
    }
    out+=A.path('M110 263L282 163',C.radar,4,'stroke-dasharray="8 9"');
    out+=A.table(402,244,141)+A.book(targetX,targetY,.8);
    const px=302,py=72,scale=.72;
    const handX=targetX,handY=targetY+(bodyOcclusion?0:17);
    out+=A.person(px,py,(handX-px)/scale,(handY-py)/scale,scale);
    if(!bodyOcclusion)out+=`<ellipse cx="${num(handX+3)}" cy="${num(handY)}" rx="21" ry="9" fill="${C.skin}" stroke="${C.blue}" stroke-width="2"/>`;
    out+=A.text(456,377,'Target',C.fused,32,'middle',700);
    out+=A.text(623,306,'Other tags',C.tag,32,'middle',700);
    out+=A.text(355,415,bodyOcclusion?'Body hides non-target tags':'Hand partly covers target tag',C.tag,34,'middle',700);
    // The tested bystander is separate from the interacting actor and holds an
    // untagged object. Radar keeps a direct view of the interacting person.
    const ax=998,ay=87,as=.66,bookX=1124,bookY=197-wave*30;
    out+=A.radar(817,214,.62)+A.path('M871 209L981 161',C.radar,4,'stroke-dasharray="8 9"');
    out+=A.table(1077,245,132)+A.book(bookX,bookY,.75);
    out+=A.person(ax,ay,(bookX-ax)/as,(bookY-ay)/as,as);
    const bx=1286,by=107,bs=.56,hx=1370,hy=181+9*Math.sin(2*Math.PI*u);
    // Plain cup has no RFID inlay.
    out+=A.path(`M${num(hx-16)} ${num(hy-16)}H${num(hx+16)}L${num(hx+12)} ${num(hy+23)}H${num(hx-12)}ZM${num(hx+16)} ${num(hy-8)}Q${num(hx+33)} ${num(hy-6)} ${num(hx+15)} ${num(hy+12)}`,C.white,4);
    out+=A.person(bx,by,(hx-bx)/bs,(hy-by)/bs,bs);
    out+=A.text(1031,347,'Actor',C.fused,33,'middle',700)+A.text(1303,347,'Bystander',C.muted,33,'middle',700);
    out+=A.text(1314,263,'Untagged',C.muted,32)+A.text(1314,299,'object',C.muted,32);
    out+=A.path('M1013 377V389H1340V377',C.muted,3)+A.text(1176,425,'1–2 m away',C.muted,34);
    return svg(out,'Separate hand and body occlusion conditions, alongside the nearby-bystander test. Radar keeps a direct view of one interacting actor, while the bystander handles an untagged object');
  }
  const renderers={context,outputs,robustness};
  window.RFApplications={names:Object.keys(renderers),render(name,seconds){const render=renderers[name],A=window.RFArt;if(!render||!A)return;document.querySelectorAll(`[data-app="${name}"]`).forEach(element=>{element.innerHTML=render(seconds,A).replace(/app-arrow/g,`app-arrow-${name}`);});}};
})();
