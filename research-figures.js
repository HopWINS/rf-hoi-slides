/* Editable vector redraw of RF-HOI Figure 9(b), PDF page 11.
 * The 23 samples below are APPROXIMATE DIGITIZATION of the source raster,
 * not original numerical data and not measured RF. The source is an example
 * TRUMANS pick-up trajectory. Axes preserve absolute hand/object coordinates;
 * the offset is intentionally retained rather than normalizing it away.
 * The graphic does not claim an exact kinematic constraint or estimate error.
 * Digitization/provenance: SOURCE_NOTES.md, redrawn figure provenance.
 */
(function(root){
  'use strict';
  const C={white:'#FFFFFF',muted:'#C4D8ED',hand:'#96E1CD',object:'#F1C400',grid:'#416596'};
  const hand=Object.freeze([.9508,.9534,.9563,.9588,.9703,.9804,.9927,.9999,1.0157,1.0352,1.0680,1.0929,1.1178,1.1506,1.1769,1.1849,1.1960,1.2054,1.2076,1.2094,1.2101,1.2105,1.2105]);
  const object=Object.freeze([.8784,.8794,.8838,.8867,.8996,.9115,.9256,.9335,.9519,.9743,1.0118,1.0395,1.0673,1.1048,1.1326,1.1401,1.1510,1.1603,1.1621,1.1636,1.1636,1.1629,1.1629]);
  const n=x=>Number(x).toFixed(2);
  const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const text=(x,y,v,size=32,color=C.white,anchor='middle',weight=400)=>`<text x="${n(x)}" y="${n(y)}" fill="${color}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="middle" font-weight="${weight}">${esc(v)}</text>`;
  const line=(x1,y1,x2,y2,color=C.grid,width=2)=>`<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="${width}"/>`;
  function handObject(){
    const chart={left:110,right:654,top:112,bottom:385,min:.86,max:1.23},x=i=>chart.left+i/22*(chart.right-chart.left),y=v=>chart.bottom-(v-chart.min)/(chart.max-chart.min)*(chart.bottom-chart.top);
    let out=text(chart.left,29,'y-coordinate (m)',34,C.muted,'start');
    out+=line(259,73,304,73,C.hand,5)+text(317,73,'Hand',32,C.hand,'start',700)+line(459,73,504,73,C.object,5)+text(517,73,'Object',32,C.object,'start',700);
    [.9,1,1.1,1.2].forEach(v=>{out+=line(chart.left,y(v),chart.right,y(v),C.grid,2)+text(chart.left-17,y(v),v.toFixed(1),32,C.muted,'end');});
    [0,10,20].forEach(i=>{out+=line(x(i),chart.top,x(i),chart.bottom,C.grid,1.5)+text(x(i),419,String(i),32,C.muted);});
    out+=line(chart.left,chart.top,chart.left,chart.bottom,C.muted,2.5)+line(chart.left,chart.bottom,chart.right,chart.bottom,C.muted,2.5);
    for(const [values,color,name] of [[hand,C.hand,'hand'],[object,C.object,'object']]){
      const d=values.map((v,i)=>`${i?'L':'M'}${n(x(i))} ${n(y(v))}`).join('');
      out+=`<path data-digitized-series="${name}" d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    out+=text(382,457,'Frames',32,C.muted)+text(382,491,'Redrawn from Fig. 9b (approx.)',28,C.muted);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 515" role="img" aria-label="Hand and object coordinates during a pick-up action, approximately digitized and redrawn from Figure 9b" style="font-family:Arial,Helvetica,sans-serif"><title>Similar coordinate trends with a distinct absolute offset</title><desc>23 approximate samples, frames zero to22, digitized from the supplied Figure9b. The hand rises from about0.951 to1.211metres and the object from0.878 to1.163metres. The two trajectories are similar but not identical. This is coordinate evidence, not radar or RFID data.</desc>${out}</svg>`;
  }
  const builders=Object.freeze({'hand-object':handObject});
  root.RFFigures=Object.freeze({names:Object.freeze(Object.keys(builders)),data:Object.freeze({hand,object}),render(name,_seconds){const build=builders[name];if(!build)return false;document.querySelectorAll(`[data-figure="${name}"]`).forEach(node=>{if(node.dataset.figureRendered!==name){node.innerHTML=build();node.dataset.figureRendered=name;}});return true;}});
})(typeof window==='object'?window:globalThis);
