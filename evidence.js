/* Fixed results from the RF-HOI paper. Presentation time never changes values,
 * bar endpoints, scales or opacity. Each chart has one matched comparison.
 * Fusion: Section 5.2/Fig.13, full real training partition. The no-fusion
 * endpoint is 96.97 - 19.87 = 77.10 percentage points.
 * Scarce: Section 5.4.3/Fig.18, 17% of the 30% real training partition.
 * New objects: Section 5.4.2/Fig.17, five new objects, pick up/put down,
 * 145 test-only real recordings. Seen-object scores are 94.5 -> 90.5;
 * both the new-object gain and seen-object tradeoff are plotted directly.
 * Goals: Table 3, Gemini 2.5 Flash only. These are measured task accuracies,
 * not LLM generation probabilities. Direct differences use the same arrays.
 */
(function(root){
  'use strict';
  const C={white:'#FFFFFF',muted:'#C4D8ED',blue:'#68ACE5',mint:'#96E1CD',gold:'#F1C400',grid:'#416596'};
  const esc=v=>String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const n=v=>Number(v).toFixed(3);
  function text(x,y,value,size=34,color=C.white,anchor='middle',weight=400){return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}" dominant-baseline="middle">${esc(value)}</text>`;}
  function line(x1,y1,x2,y2,color=C.grid,width=2,extra=''){return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="${width}" ${extra}/>`;}
  function path(d,color=C.mint,width=4,extra=''){return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;}
  function rect(x,y,w,h,color){return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="5" fill="${color}"/>`;}
  function svg(body,title,description){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 500" role="img" aria-label="${esc(title)}" style="font-family:Arial,Helvetica,sans-serif"><title>${esc(title)}</title><desc>${esc(description)}</desc><defs><marker id="evidence-arrow" markerWidth="18" markerHeight="18" refX="15" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1L15 8L1 15" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${body}</svg>`;}
  function arrow(x,y1,y2){return path(`M${n(x)} ${n(y1)}V${n(y2)}`,C.muted,3,'marker-end="url(#evidence-arrow)"');}
  const frame={x:250,top:100,bottom:405,right:1110};
  const accuracyY=value=>frame.bottom-value/100*(frame.bottom-frame.top);
  function accuracyAxis(label){let out=text(frame.x,32,label,34,C.muted,'start');[0,50,100].forEach(value=>{const y=accuracyY(value);out+=line(frame.x,y,frame.right,y,C.grid,value===0?3:2)+text(frame.x-28,y,String(value),32,C.muted,'end');});return out;}
  function measuredBar(cx,value,label,color,places=2,width=174){const y=accuracyY(value);return `<g data-measured-value="${value}" data-measured-series="${esc(label)}">${rect(cx-width/2,y,width,frame.bottom-y,color)}${text(cx,y-28,value.toFixed(places)+'%',40,color,'middle',700)}${text(cx,455,label,34,C.white)}</g>`;}
  function differenceBracket(first,second,{x,labelX,places=2}={}){const yLow=accuracyY(first.value),yHigh=accuracyY(second.value),gap=second.value-first.value;let out=line(first.right,yLow,x-12,yLow,C.muted,2,'stroke-dasharray="7 7"')+line(second.right,yHigh,x-12,yHigh,C.muted,2,'stroke-dasharray="7 7"');out+=path(`M${n(x-11)} ${n(yHigh)}H${n(x+11)}M${n(x)} ${n(yHigh)}V${n(yLow)}M${n(x-11)} ${n(yLow)}H${n(x+11)}`,C.gold,3);out+=text(labelX,(yHigh+yLow)/2,'+'+gap.toFixed(places)+' pp',38,C.gold,'middle',700);return out;}
  function fusion(){const values=[77.10,96.97],xs=[500,900],width=174;let out=accuracyAxis('Joint HOI accuracy (%)');out+=measuredBar(xs[0],values[0],'No fusion',C.blue,2,width)+measuredBar(xs[1],values[1],'RF-HOI',C.mint,2,width);out+=differenceBracket({value:values[0],right:xs[0]+width/2},{value:values[1],right:xs[1]+width/2},{x:1100,labelX:1260,places:2});return svg(out,'Feature fusion improves joint HOI accuracy by 19.87 percentage points','Matched synthetic pre-training and real fine-tuning: no fusion 77.10%, RF-HOI 96.97%. Full real training partition, main random sample split. Section 5.2 and Figure 13. The baseline endpoint is reconstructed from the explicitly reported difference.');}
  function objects(){
    const bottom=455,y=v=>bottom-v/100*295,groups=[{label:'New objects',values:[71.3,93.1],xs:[330,530],color:C.mint},{label:'Seen objects',values:[94.5,90.5],xs:[960,1160],color:C.blue}],width=122;
    let out=text(120,32,'Joint HOI accuracy (%)',34,C.muted,'start');
    [0,50,100].forEach(v=>{out+=line(120,y(v),1380,y(v),C.grid,v===0?3:2)+text(92,y(v),String(v),32,C.muted,'end');});
    out+=rect(816,19,29,29,C.blue)+text(859,34,'Original synthesis',32,C.muted,'start')+rect(1160,19,29,29,C.mint)+text(1203,34,'Expanded',32,C.muted,'start');
    groups.forEach(g=>{
      out+=text((g.xs[0]+g.xs[1])/2,88,g.label,36,C.white,'middle',700);
      g.values.forEach((v,i)=>{const labelY=g.label==='Seen objects'?Math.min(...g.values.map(y))-43:y(v)-25;out+=`<g data-measured-value="${v}" data-measured-series="${g.label}: ${i?'expanded':'original'}">${rect(g.xs[i]-width/2,y(v),width,bottom-y(v),i?C.mint:C.blue)}${text(g.xs[i],labelY,v.toFixed(1)+'%',36,i?C.mint:C.blue,'middle',700)}</g>`;});
      const delta=g.values[1]-g.values[0],x=g.xs[1]+112,yy0=y(g.values[0]),yy1=y(g.values[1]);
      out+=line(g.xs[0]+width/2,yy0,x,yy0,C.muted,2,'stroke-dasharray="6 6"')+line(g.xs[1]+width/2,yy1,x,yy1,C.muted,2,'stroke-dasharray="6 6"');
      out+=path(`M${n(x-9)} ${n(yy0)}H${n(x+9)}M${n(x)} ${n(yy0)}V${n(yy1)}M${n(x-9)} ${n(yy1)}H${n(x+9)}`,delta>0?C.gold:C.muted,3);
      out+=text(Math.min(x+103,1350),(yy0+yy1)/2,(delta>0?'+':'−')+Math.abs(delta).toFixed(1)+' pp',34,delta>0?C.gold:C.muted,'middle',700);
    });
    return svg(out,'Synthetic expansion improves new-object accuracy, with a seen-object tradeoff','Exact Figure 17 endpoints, redrawn as vector data: new objects 71.3% to 93.1%, gain 21.8 percentage points; seen objects 94.5% to 90.5%, decrease 4.0 percentage points. Original and expanded synthetic pretraining share the same original real-world fine-tuning dataset. The five new object categories have no real fine-tuning; the test uses pick-up/put-down actions and 145 new-object recordings. No animation changes values or axes.');
  }
  function scarce(){
    const gain=30.74,chart={left:990,right:1355,top:120,bottom:405,max:40},y=v=>chart.bottom-v/chart.max*(chart.bottom-chart.top);
    let out=text(220,34,'From scratch',36,C.white,'middle',700)+text(650,34,'With synthetic data',36,C.white,'middle',700);
    out+=text(220,135,'17% training partition',34,C.blue)+arrow(220,172,233)+text(220,274,'Train',36,C.white,'middle',700)+arrow(220,312,369)+text(220,413,'Real-only model',34,C.muted);
    out+=text(650,135,'Synthetic pre-train',34,C.gold)+arrow(650,172,233)+text(650,274,'Same 17% partition',34,C.blue)+arrow(650,312,369)+text(650,413,'Fine-tune',36,C.mint,'middle',700);
    out+=text(1167,34,'Joint HOI gain (pp)',34,C.muted);
    [0,20,40].forEach(value=>{const yy=y(value);out+=line(chart.left,yy,chart.right,yy,C.grid,value===0?3:2)+text(chart.left-24,yy,String(value),32,C.muted,'end');});
    const barX=1117,barW=142,top=y(gain);
    out+=`<g data-measured-gain-pp="${gain}">${rect(barX-barW/2,top,barW,chart.bottom-top,C.mint)}${text(barX,top-32,'+'+gain.toFixed(2)+' pp',40,C.mint,'middle',700)}</g>`;
    out+=text(1167,456,'0 = from-scratch model',32,C.muted);
    return svg(out,'Synthetic pre-training adds 30.74 percentage points with the same scarce real-data budget','At 17% of the real training partition, approximately 5% of the main real dataset, synthetic pre-training improves joint HOI accuracy by 30.74 percentage points versus the same architecture trained from scratch. The chart shows gain over the from-scratch model, not absolute accuracy. Both methods use the same real fine-tuning/training budget. Section 5.4.3 and Figure 18.');
  }
  function goals(){const values=[18.18,59.09,95.45],xs=[400,700,1000],width=154;let out=accuracyAxis('Goal inference accuracy (%)');out+=text(1187,32,'Gemini 2.5 Flash',34,C.muted);out+=measuredBar(xs[0],values[0],'Actions only',C.blue,2,width)+measuredBar(xs[1],values[1],'Objects only',C.blue,2,width)+measuredBar(xs[2],values[2],'Full HOI',C.mint,2,width);out+=differenceBracket({value:values[0],right:xs[0]+width/2},{value:values[2],right:xs[2]+width/2},{x:1174,labelX:1313,places:2});return svg(out,'Full HOI context improves Gemini goal inference by 77.27 percentage points over actions alone','Gemini 2.5 Flash only, Table 3: actions only 18.18%, objects only 59.09%, full RF-HOI 95.45%. The 77.27 percentage-point difference compares full HOI against actions only. Case study: 22 test sequences, 30 candidate goals, eight few-shot examples.');}
  const builders=Object.freeze({fusion,scarce,objects,goals});
  root.RFEvidence=Object.freeze({names:Object.freeze(Object.keys(builders)),render(name,_seconds){const build=builders[name];if(!build)return false;document.querySelectorAll(`[data-evidence="${name}"]`).forEach(element=>{if(element.dataset.evidenceRendered!==name){element.innerHTML=build().replace(/evidence-arrow/g,`evidence-arrow-${name}`);element.dataset.evidenceRendered=name;}});return true;}});
})(typeof window==='object'?window:globalThis);
