export function BarList({items=[], valueKey='value', labelKey='label', maxValue}) {
  const max = maxValue ?? Math.max(1, ...items.map(i => Number(i[valueKey] || 0)));
  if (!items.length) return <div className="emptyMini">Nessun dato per il grafico.</div>;
  return <div className="barList">{items.map((item, idx) => {
    const value = Number(item[valueKey] || 0);
    const pct = Math.max(3, Math.round((value / max) * 100));
    return <div className="barRow" key={`${item[labelKey]}-${idx}`}><div className="barLabel"><span>{item[labelKey]}</span><strong>{value}</strong></div><div className="barTrack"><div className="barFill" style={{width:`${pct}%`}} /></div></div>;
  })}</div>;
}

export function CompareBars({leftLabel='Noi', rightLabel='Avversario', left=0, right=0}) {
  const max = Math.max(1, Number(left || 0), Number(right || 0));
  return <div className="compareBars"><div className="compareItem"><div className="barLabel"><span>{leftLabel}</span><strong>{left}</strong></div><div className="barTrack"><div className="barFill successFill" style={{width:`${Math.max(3, left/max*100)}%`}} /></div></div><div className="compareItem"><div className="barLabel"><span>{rightLabel}</span><strong>{right}</strong></div><div className="barTrack"><div className="barFill dangerFill" style={{width:`${Math.max(3, right/max*100)}%`}} /></div></div></div>;
}

export function DonutChart({value=0,total=1,label='Completamento'}) {
  const pct = total ? Math.min(100, Math.round((Number(value||0)/Number(total||1))*100)) : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  return <div className="donutWrap"><svg viewBox="0 0 100 100" className="donut"><circle cx="50" cy="50" r={radius} className="donutBg"/><circle cx="50" cy="50" r={radius} className="donutFg" strokeDasharray={`${dash} ${circumference-dash}`}/><text x="50" y="54" textAnchor="middle">{pct}%</text></svg><span>{label}</span></div>;
}

export function PitchHeatmap({values={}, title='Heatmap'}) {
  const zones = [9,10,11,12,5,6,7,8,1,2,3,4];
  const max = Math.max(1, ...Object.values(values).map(v => Number(v || 0)));
  return <div className="pitchShell" aria-label={title}>
    <div className="pitchLines"><span className="midLine"/><span className="midCircle"/><span className="box leftBox"/><span className="box rightBox"/></div>
    <div className="pitchGrid">{zones.map(z => {
      const val = Number(values[z] || 0);
      const ratio = val / max;
      const cls = ratio === 0 ? 'z0' : ratio < .25 ? 'z1' : ratio < .5 ? 'z2' : ratio < .75 ? 'z3' : 'z4';
      return <div key={z} className={`pitchZone ${cls}`} title={`Zona ${z}: ${val}`}><strong>{val}</strong><span>Z{z}</span></div>;
    })}</div>
  </div>;
}

export function MiniTimeline({items=[], labelKey='label', aKey='a', bKey='b', aLabel='Noi', bLabel='Avversario'}) {
  const max = Math.max(1, ...items.flatMap(i => [Number(i[aKey]||0), Number(i[bKey]||0)]));
  if (!items.length) return <div className="emptyMini">Nessun dato temporale.</div>;
  return <div className="timelineBars">{items.map((i, idx) => <div className="timelineItem" key={`${i[labelKey]}-${idx}`}><span>{i[labelKey]}</span><div className="timelinePair"><div title={`${aLabel}: ${i[aKey]||0}`} className="timelineA" style={{height:`${Math.max(5, (Number(i[aKey]||0)/max)*70)}px`}}/><div title={`${bLabel}: ${i[bKey]||0}`} className="timelineB" style={{height:`${Math.max(5, (Number(i[bKey]||0)/max)*70)}px`}}/></div></div>)}</div>;
}
