import { useState } from 'preact/hooks';
import frames from './data/specimen-frames.json';

type Props = { locale: string; selected: number | null; onInspect: (index: number | null) => void;
  reduced: boolean; playing: boolean; progress: number };

/** Native Blender camera projections keep the four inspectable joints on the rendered model. */
export default function SpecimenView({locale, selected, onInspect, reduced, playing, progress}: Props) {
  const [angle, setAngle] = useState(50);
  const [failed, setFailed] = useState(false);
  const displayedAngle = reduced ? 50 : playing ? progress : angle;
  const position = displayedAngle * .06;
  const lo = Math.floor(position), hi = Math.min(6, lo + 1), mix = position - lo;
  const points = frames[lo].vertices.map(([x,y],i) => [x+(frames[hi].vertices[i][0]-x)*mix,y+(frames[hi].vertices[i][1]-y)*mix]);
  const english = locale === 'en';
  const inspect = (i: number) => onInspect(selected === i ? null : i);
  return <div className="physical-specimen">
    <svg viewBox="0 55 720 430" role="group" aria-label={english ? 'Rotatable C4 specimen; inspect any of its four vertices' : '可轉動的 C4 標本；選擇四個頂點檢查'}>
      {!failed && frames.map((frame,i) => <image key={frame.file} href={frame.file} width="720" height="540" opacity={i === lo ? 1 : i === hi ? mix : 0} onError={() => setFailed(true)} />)}
      {failed && <polygon points={points.map(point => point.join(',')).join(' ')} fill="none" stroke="currentColor" stroke-width="5" />}
      {points.map(([x,y],i) => <g key={i} className={`specimen-joint${selected === i ? ' is-selected' : ''}`} role="button" tabindex={0}
        aria-label={`v${i+1}, ${english ? 'degree 2' : '度數 2'}`} aria-pressed={selected === i}
        onClick={() => inspect(i)} onKeyDown={event => {if (event.key==='Enter'||event.key===' ') {event.preventDefault();inspect(i);}}}>
        <circle className="joint-hit" cx={x} cy={y} r="44" />
        <circle className="joint-ring" cx={x} cy={y} r="29" />
        <text x={x} y={y+5} textAnchor="middle">{i+1}</text>
      </g>)}
    </svg>
    <div className="specimen-instrument">
      <span aria-live="polite">{selected === null ? (english ? 'Select a blue joint' : '選一個藍色頂點') : `v${selected+1} · ${english ? 'degree 2 · 0 triangles' : '度數 2 · 0 個三角形'}`}</span>
      <label><span>{english ? 'Rotate specimen' : '轉動標本'}</span><input type="range" min="0" max="100" value={displayedAngle} disabled={reduced || playing} onInput={e=>setAngle(Number(e.currentTarget.value))} aria-valuetext={`${Math.round(displayedAngle*.36-18)}°`} /></label>
    </div>
  </div>;
}
