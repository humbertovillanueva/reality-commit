import { samples, sampleId, type SampleId } from './demo';
import type { Workspace } from './domain';
import CaptureImage from './CaptureImage';

export default function SamplePicker({ workspace, busy, savedKeys, onChoose }: { workspace: Workspace; busy: boolean; savedKeys: string[]; onChoose: (key: string, sample?: SampleId) => void }) {
  const active = sampleId(workspace);
  return <section className="sample-picker" aria-label="Choose an example">
    <div className="sample-picker-heading"><div><span className="eyebrow">TWO REAL-WORLD EXAMPLES</span><h2>Different places. The same evidence-first approach.</h2></div><span>Saved reviews stay with each workspace.</span></div>
    <div className="sample-cards">{samples.map(sample => <button key={sample.id} disabled={busy} aria-pressed={active === sample.id} className="sample-card" onClick={() => onChoose(`sample:${sample.id}`, sample.id)}>
      <div className="sample-thumb"><CaptureImage image={sample.image} imageView={sample.imageView} alt="" /></div>
      <span className="sample-card-copy"><small>{sample.category}</small><b>{sample.title}</b><span>{sample.description}</span><em>{active === sample.id ? 'Viewing this sample' : 'Explore sample →'}</em></span>
    </button>)}</div>
    <div className="saved-workspace-links">{savedKeys.includes('personal') && <button disabled={busy || !workspace.demo} onClick={() => onChoose('personal')}>{workspace.demo ? 'Return to my photos & reviews' : 'Viewing my photos & reviews'}</button>}{savedKeys.includes('sample:legacy') && <button disabled={busy || (workspace.demo && !active)} onClick={() => onChoose('sample:legacy')}>Saved original sample</button>}</div>
  </section>;
}
