import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, Box, Camera, Check, CheckCheck, ChevronRight, CircleHelp, Clock3, FileCheck2, GitCommitHorizontal, GitCompareArrows, Layers3, Plus, ScanLine, ShieldCheck, X } from 'lucide-react';
import { compareCaptures, createCommit, kindLabel, type Capture, type Change, type Decision, type Observation, type Workspace } from './domain';
import { demoWorkspace } from './demo';
import { loadWorkspace, saveWorkspace } from './storage';
import Welcome from './Welcome';

const date = (value: string) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const message = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong.';
type View = 'compare' | 'assets' | 'history';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(() => window.location.hash !== '#workspace');
  const navigationFocus = useRef(false);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [view, setView] = useState<View>('compare');
  const [beforeId, setBeforeId] = useState('baseline');
  const [afterId, setAfterId] = useState('followup');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [selected, setSelected] = useState<string>();
  const [upload, setUpload] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeAsset, setActiveAsset] = useState<string>();
  const [inspectCommit, setInspectCommit] = useState<string>();
  const [reviewer, setReviewer] = useState('');
  const [commitTitle, setCommitTitle] = useState('');
  useEffect(() => {
    const syncPage = () => { navigationFocus.current = true; setShowWelcome(window.location.hash !== '#workspace'); };
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);
  useEffect(() => {
    if (!workspace || !navigationFocus.current) return;
    if (upload) { navigationFocus.current = false; return; }
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    navigationFocus.current = false;
  }, [showWelcome, workspace, upload]);
  function enterWorkspace(capture = false) {
    navigationFocus.current = true;
    window.location.hash = 'workspace';
    setShowWelcome(false);
    if (capture) setUpload(true);
  }
  useEffect(() => { loadWorkspace().then(saved => {
    const w = saved ?? demoWorkspace(); setWorkspace(w);
    setBeforeId(w.captures.at(-2)?.id ?? w.captures[0]?.id ?? ''); setAfterId(w.captures.at(-1)?.id ?? '');
  }).catch(() => { setWorkspace(demoWorkspace()); setError('Browser storage is unavailable. Changes cannot be saved until storage is enabled.'); }); }, []);

  async function persist(next: Workspace) {
    setBusy(true);
    try { await saveWorkspace(next); setWorkspace(next); setError(''); return true; }
    catch (e) { setError(`Could not save: ${message(e)} Your previous workspace is unchanged. Export a backup before clearing browser data.`); return false; }
    finally { setBusy(false); }
  }
  function choosePair(side: 'before' | 'after', id: string) {
    if (Object.keys(decisions).length && !window.confirm('Switch captures and discard this unsaved review?')) return;
    side === 'before' ? setBeforeId(id) : setAfterId(id); setDecisions({}); setSelected(undefined);
  }
  if (!workspace) return <div className="loading"><ScanLine size={32}/><p>Opening your workspace…</p></div>;
  const before = workspace.captures.find(c => c.id === beforeId);
  const after = workspace.captures.find(c => c.id === afterId);
  const validPair = !!before && !!after && before.id !== after.id && Date.parse(before.capturedAt) < Date.parse(after.capturedAt);
  const changes = validPair ? compareCaptures(before!, after!) : [];
  const existing = workspace.commits.find(c => c.beforeId === beforeId && c.afterId === afterId);
  const review = existing?.decisions ?? decisions;
  const current = changes.find(c => c.id === selected) ?? changes[0];
  const accepted = changes.filter(c => review[c.id]?.status === 'accepted').length;
  const pending = changes.filter(c => !review[c.id] || review[c.id].status === 'needs-evidence').length;
  const assets = [...new Map(workspace.captures.flatMap(c => c.observations).map(o => [o.assetId, o])).values()];
  const inspected = workspace.commits.find(c => c.id === inspectCommit);
  async function commit() {
    try {
      const c = createCommit(workspace!, beforeId, afterId, commitTitle, reviewer, decisions);
      if (await persist({ ...workspace!, commits: [...workspace!.commits, c] })) { setCommitOpen(false); setDecisions({}); setView('history'); setInspectCommit(c.id); }
    } catch (e) { setError(message(e)); }
  }
  async function addCapture(capture: Capture, name: string) {
    const resetDemo = workspace!.demo;
    const next: Workspace = resetDemo ? { version: 1, demo: false, name, captures: [capture], commits: [] } : { ...workspace!, captures: [...workspace!.captures, capture].sort((a,b) => Date.parse(a.capturedAt)-Date.parse(b.capturedAt)) };
    if (await persist(next)) { setBeforeId(next.captures.at(-2)?.id ?? capture.id); setAfterId(next.captures.at(-1)!.id); setDecisions({}); setUpload(false); setView('compare'); }
  }
  function exportWorkspace() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'reality-commit-export.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (showWelcome) return <Welcome hasSavedWorkspace={!workspace.demo || workspace.commits.length > 0} onExplore={() => enterWorkspace()} onCapture={() => enterWorkspace(true)} />;
  return <div className="app">
    <aside className="sidebar">
      <a className="brand" href="#" aria-label="Reality Commit introduction"><span className="brand-icon"><img src="./mark.svg" alt="" width="32" height="32"/></span><span>reality<span className="brand-light">commit</span><small>PHYSICAL WORLD · VERSIONED</small></span></a>
      <div className="workspace-label">WORKSPACE <span>LOCAL</span></div>
      <div className="workspace-name"><span className="plant-icon"><Layers3 size={18}/></span><div>{workspace.demo ? 'North plant' : workspace.name}<small>{workspace.demo ? 'Mechanical room · Sample site' : 'Private browser workspace'}</small></div></div>
      <nav aria-label="Main navigation">
        <button className={view === 'compare' ? 'active' : ''} onClick={() => setView('compare')}><GitCompareArrows size={18}/> Compare captures <span>{changes.length}</span></button>
        <button className={view === 'assets' ? 'active' : ''} onClick={() => setView('assets')}><Box size={18}/> Asset register <span>{assets.length}</span></button>
        <button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}><GitCommitHorizontal size={18}/> Commit history <span>{workspace.commits.length}</span></button>
      </nav>
      <div className="sidebar-note"><ScanLine size={22}/><h3>A memory for every space.</h3><p>Capture the evidence.<br/>Review the changes.<br/>Keep the history.</p><div className="version">EARLY BUILD <span>v0.1</span></div></div>
      <div className="sidebar-bottom"><ShieldCheck size={16}/><span>Images stay in this browser</span></div>
    </aside>
    <main>
      <header className="topbar"><div className="breadcrumb">Workspace <ChevronRight size={14}/><b>{workspace.demo ? 'North plant' : workspace.name}</b></div><div className="top-actions"><span className="local-dot"/> Local storage <a href="https://github.com/humbertovillanueva/reality-commit" target="_blank" rel="noreferrer">GitHub ↗</a></div></header>
      <div className="main-content">
        {error && <div role="alert" className="error">{error}<button aria-label="Dismiss error" onClick={() => setError('')}><X size={16}/></button></div>}
        <div className="page-heading"><div><div className="eyebrow">{view === 'compare' ? 'OBSERVE → REVIEW → COMMIT' : 'THE RECORD OF REALITY'}</div><h1>{view === 'compare' ? 'What changed?' : view === 'assets' ? 'Every asset has a story.' : 'A history you can inspect.'}</h1><p>{view === 'compare' ? 'Turn separate site visits into a continuous, evidence-backed history.' : view === 'assets' ? 'Persistent identities connect observations across captures.' : 'Reviewed changes, their evidence, and the person who confirmed them.'}</p></div><button className="primary" onClick={() => setUpload(true)}><Plus size={17}/> New capture</button></div>
        {workspace.demo && <div className="demo-banner"><span><span className="badge">SAMPLE WORKSPACE</span> Synthetic illustrations and recorded observations. No AI detections.</span><button onClick={() => setUpload(true)}>Try your own images <ArrowRight size={15}/></button></div>}
        {view === 'compare' && <>
          <div className="comparison-toolbar"><div className="pair"><label>BASELINE<select aria-label="Baseline capture" value={beforeId} onChange={e => choosePair('before', e.target.value)}>{workspace.captures.map(c => <option value={c.id} key={c.id}>{c.title} · {date(c.capturedAt)}</option>)}</select></label><ArrowRight size={18}/><label>CURRENT<select aria-label="Current capture" value={afterId} onChange={e => choosePair('after', e.target.value)}>{workspace.captures.map(c => <option value={c.id} key={c.id}>{c.title} · {date(c.capturedAt)}</option>)}</select></label></div><span className="comparison-status">{existing ? '✓ Committed' : 'Awaiting review'}</span></div>
          {!validPair ? <div className="empty"><Camera size={36}/><h2>{workspace.captures.length < 2 ? 'Your baseline is ready.' : 'Choose a chronological pair.'}</h2><p>{workspace.captures.length < 2 ? 'Add a later capture of the same space. Reuse asset IDs to compare observations.' : 'Choose two different captures with the baseline earlier than the current visit.'}</p><button className="primary" onClick={() => setUpload(true)}>Add capture</button></div> : <>
            <div className="evidence-grid"><Evidence capture={before!} observation={current?.before} label="01 / BEFORE"/><Evidence capture={after!} observation={current?.after} label="02 / AFTER"/></div>
            <div className="review-layout"><section className="change-list"><div className="section-title"><h2>Proposed changes <span>{changes.length}</span></h2><small>{pending} need review</small></div>{!changes.length && <p className="empty-copy">No differences in recorded observations. This does not establish that the physical space is unchanged.</p>}{changes.map((c, i) => <button key={c.id} className={`change-row ${current?.id === c.id ? 'selected' : ''}`} onClick={() => setSelected(c.id)}><span className={`change-symbol ${c.kind}`}>{c.kind === 'newly-observed' ? '+' : c.kind === 'not-observed' ? '?' : '↗'}</span><span className="change-copy"><b>{c.label}</b><small>{c.assetId} <span>·</span> {kindLabel[c.kind]}</small></span><span className="row-status">{review[c.id]?.status === 'accepted' ? <Check size={16}/> : review[c.id]?.status === 'rejected' ? <X size={16}/> : <span>0{i+1}</span>}</span></button>)}</section>
            <section className="review-panel">{current ? <><div className="section-title"><span className="eyebrow">EVIDENCE REVIEW</span><span className="badge">{current.assetId}</span></div><h2>{current.label}</h2><p className="review-description">{current.kind === 'not-observed' ? 'This asset was not annotated in the current capture. It may be obscured or outside the frame; removal is not established.' : current.kind === 'newly-observed' ? 'This asset appears in the current annotations. Its installation date is not established.' : 'The recorded condition differs between visits. Review the source images before accepting.'}</p><dl><dt>BEFORE</dt><dd>{current.before?.condition ?? 'No recorded observation'}</dd><dt>AFTER</dt><dd>{current.after?.condition ?? 'No recorded observation'}</dd></dl><label className="field">Verification note<textarea aria-label="Verification note" disabled={!!existing} value={review[current.id]?.note ?? ''} placeholder="What does the evidence establish? Required to accept." onChange={e => setDecisions({ ...decisions, [current.id]: { status: decisions[current.id]?.status ?? 'needs-evidence', note: e.target.value } })}/></label><div className="decision-actions">{(['accepted', 'rejected', 'needs-evidence'] as const).map(status => <button disabled={!!existing} className={review[current.id]?.status === status ? 'chosen' : ''} key={status} onClick={() => setDecisions({ ...decisions, [current.id]: { status, note: decisions[current.id]?.note ?? '' } })}>{status === 'accepted' ? <Check size={15}/> : status === 'rejected' ? <X size={15}/> : <CircleHelp size={15}/>} {status === 'accepted' ? 'Accept' : status === 'rejected' ? 'Reject' : 'Need evidence'}</button>)}</div></> : <><ShieldCheck/><h2>No proposals to review</h2><p>Comparison uses your asset IDs and condition notes. Automatic visual recognition is planned.</p></>}</section></div>
            <footer className="commit-bar"><div><GitCommitHorizontal size={22}/><span><b>{existing ? 'This comparison is committed' : `${accepted} accepted · ${pending} unresolved`}</b><small>{existing ? `Reviewed by ${existing.reviewer}` : 'Only reviewed observations enter the record.'}</small></span></div><button className="primary" disabled={!!existing || !changes.length || pending > 0 || busy} onClick={() => {setCommitTitle(''); setCommitOpen(true);}}><CheckCheck size={17}/> Commit review</button></footer>
          </>}
        </>}
        {view === 'assets' && <div className="asset-layout"><section className="asset-grid">{assets.map(a => <button className={`asset-card ${activeAsset === a.assetId ? 'selected' : ''}`} key={a.assetId} onClick={() => setActiveAsset(a.assetId)}><Box size={24}/><span className="eyebrow">{a.assetId}</span><h2>{a.label}</h2><p>{workspace.captures.filter(c => c.observations.some(o => o.assetId === a.assetId)).length} recorded observations</p><span className="text-link">Explore history <ArrowRight size={15}/></span></button>)}</section>{activeAsset && <section className="panel"><h2>{assets.find(a => a.assetId === activeAsset)?.label}</h2><p className="muted">Observations are not automatically verified facts.</p>{workspace.captures.filter(c => c.observations.some(o => o.assetId === activeAsset)).map(c => <div className="timeline-item" key={c.id}><small>{date(c.capturedAt)} · {c.title}</small><p>{c.observations.find(o => o.assetId === activeAsset)!.condition}</p></div>)}<h3>Reviewed changes</h3>{workspace.commits.flatMap(c => c.changes.filter(ch => ch.assetId === activeAsset && c.decisions[ch.id]?.status === 'accepted').map(ch => <div className="timeline-item" key={c.id + ch.id}><small>{date(c.createdAt)} · {c.reviewer}</small><p>{kindLabel[ch.kind]}: {c.decisions[ch.id].note}</p></div>))}</section>}</div>}
        {view === 'history' && <><div className="section-title"><h2>{workspace.commits.length} committed reviews</h2><button className="secondary" onClick={exportWorkspace}><ArrowDownToLine size={16}/> Export workspace</button></div>{!workspace.commits.length ? <div className="empty"><GitCommitHorizontal size={40}/><h2>Your first commit starts with a review.</h2><p>Compare two captures, review every proposal, and record your findings.</p><button className="primary" onClick={() => setView('compare')}>Review changes</button></div> : workspace.commits.slice().reverse().map(c => <button className="commit-row" key={c.id} onClick={() => setInspectCommit(c.id)}><GitCommitHorizontal size={25}/><span><b>{c.title}</b><small>{c.reviewer} · {date(c.createdAt)} · {c.changes.filter(ch => c.decisions[ch.id].status === 'accepted').length} accepted</small></span><code>{c.id.slice(0,8)}</code><ChevronRight size={17}/></button>)}{inspected && <section className="panel"><div className="section-title"><h2>{inspected.title}</h2><button className="icon-button" aria-label="Close commit details" onClick={() => setInspectCommit(undefined)}><X size={18}/></button></div><p className="muted">Review ID {inspected.id}. Local audit record; not cryptographically signed.</p>{inspected.changes.map(c => <div className="timeline-item" key={c.id}><small>{c.assetId} · {kindLabel[c.kind]} · {inspected.decisions[c.id].status}</small><p>{inspected.decisions[c.id].note || 'No note provided.'}</p></div>)}<button className="secondary" onClick={() => {setBeforeId(inspected.beforeId);setAfterId(inspected.afterId);setSelected(undefined);setDecisions({});setView('compare');}}>View capture evidence <ArrowRight size={15}/></button></section>}</>}
        <div className="bottom-note"><span>REALITY COMMIT / OPEN SOURCE</span><span>Observations first. Conclusions with evidence.</span></div>
      </div>
    </main>
    {upload && <CaptureDialog workspace={workspace} busy={busy} onClose={() => setUpload(false)} onSave={addCapture}/>}
    {commitOpen && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="commit-heading"><button className="close" aria-label="Close commit dialog" onClick={() => setCommitOpen(false)}><X/></button><GitCommitHorizontal size={30}/><h2 id="commit-heading">Commit this review</h2><p>Preserve all decisions, verification notes, and references to the original captures.</p><label className="field">Commit message<input autoFocus value={commitTitle} onChange={e => setCommitTitle(e.target.value)} placeholder="Reviewed mechanical room follow-up" maxLength={180}/></label><label className="field">Reviewer name<input value={reviewer} onChange={e => setReviewer(e.target.value)} placeholder="Your name" maxLength={100}/></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary full" disabled={busy || !reviewer.trim() || !commitTitle.trim()} onClick={commit}>Save commit</button><p className="fine-print">Reviewer names are self-reported. This local prototype has no authenticated identities.</p></section></div>}
  </div>;
}

function Evidence({ capture, observation, label }: { capture: Capture; observation?: Observation; label: string }) {
  return <figure className="evidence"><figcaption><span>{label}</span><span><Clock3 size={12}/> {date(capture.capturedAt)}</span></figcaption><div className="evidence-image"><img src={capture.image} alt={`${capture.title}: captured evidence`}/>{observation && <span className="evidence-pin" style={{ left: `${observation.x*100}%`, top: `${observation.y*100}%` }}><span/><b>{observation.assetId}</b></span>}<span className="capture-title"><Camera size={13}/>{capture.title}</span></div></figure>;
}

function CaptureDialog({ workspace, busy, onClose, onSave }: { workspace: Workspace; busy: boolean; onClose: () => void; onSave: (c: Capture, name: string) => Promise<void> }) {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [site, setSite] = useState('My facility');
  const [capturedAt, setCapturedAt] = useState('');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [point, setPoint] = useState({ x: .5, y: .5 });
  const [assetId, setAssetId] = useState('');
  const [label, setLabel] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const known = workspace.demo ? [] : [...new Map(workspace.captures.flatMap(c => c.observations).map(o => [o.assetId, o])).values()];
  async function readImage(file?: File) {
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type)) {setError('Choose a PNG, JPEG, or WebP image.');return;}
    if (file.size > 20*1024*1024) {setError('Choose an image smaller than 20 MB.');return;}
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file); const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width*scale); canvas.height = Math.round(bitmap.height*scale);
      const ctx = canvas.getContext('2d')!; ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      setImage(canvas.toDataURL('image/jpeg', .88)); setObservations([]); setError('');
    } catch {setError('This image could not be decoded. Try a different file.');} finally {setProcessing(false);}
  }
  function addObservation() {
    const id = assetId.trim().toUpperCase();
    if (!id || !label.trim() || !condition.trim()) {setError('Add an asset ID, name, and condition.');return;}
    if (observations.some(o => o.assetId === id)) {setError('This asset is already annotated in this capture.');return;}
    setObservations([...observations, { assetId: id, label: label.trim(), condition: condition.trim(), ...point }]);setAssetId('');setLabel('');setCondition('');setError('');
  }
  async function submit() {
    if (!image || !title.trim() || !capturedAt || !observations.length) {setError('Add an image, title, date, and at least one observation.');return;}
    const timestamp = new Date(capturedAt).toISOString();
    if (Date.parse(timestamp) > Date.now()) {setError('A real capture cannot be dated in the future.');return;}
    if (!workspace.demo && workspace.captures.some(c => c.capturedAt === timestamp)) {setError('A capture with this timestamp already exists.');return;}
    await onSave({ id: crypto.randomUUID(), title: title.trim(), capturedAt: timestamp, image, observations }, site.trim() || 'My facility');
  }
  return <div className="modal-backdrop"><section className="modal capture-modal" role="dialog" aria-modal="true" aria-labelledby="capture-heading"><button className="close" aria-label="Close capture dialog" onClick={onClose}><X/></button><div className="eyebrow">NEW EVIDENCE</div><h2 id="capture-heading">Record a capture</h2><p>Upload a photo and mark the assets you can see. Reuse IDs across visits to preserve identity.</p>{workspace.demo && <div className="notice">Your first upload starts a private workspace and replaces the synthetic sample workspace.</div>}<div className="capture-form-grid"><div><input ref={fileRef} aria-label="Capture image file" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => readImage(e.target.files?.[0])}/>{image ? <div className="annotation-image" onClick={e => {const r = e.currentTarget.getBoundingClientRect();setPoint({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});}}><img src={image} alt="New capture; click to position an observation"/><span className="crosshair" style={{left:`${point.x*100}%`,top:`${point.y*100}%`}}>+</span></div> : <button className="upload-zone" onClick={() => fileRef.current?.click()}><Camera size={30}/>{processing ? 'Preparing image…' : 'Choose a capture image'}<small>JPEG, PNG, WebP · up to 20 MB</small></button>}<p className="fine-print">Click the image to place the next marker. Images are resized to 1800 px, metadata is stripped, and the original file is not retained.</p>{workspace.demo && <label className="field">Facility name<input autoFocus value={site} onChange={e => setSite(e.target.value)} maxLength={100}/></label>}<label className="field">Capture title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mechanical room, morning visit" maxLength={120}/></label><label className="field">Captured at (your local time)<input type="datetime-local" value={capturedAt} onChange={e => setCapturedAt(e.target.value)}/></label></div><div><h3>Record an observation</h3>{!!known.length && <label className="field">Existing asset<select aria-label="Existing asset" value="" onChange={e => {const a = known.find(o=>o.assetId===e.target.value);if(a){setAssetId(a.assetId);setLabel(a.label);}}}><option value="">Reuse an asset identity…</option>{known.map(o=><option key={o.assetId} value={o.assetId}>{o.assetId} / {o.label}</option>)}</select></label>}<label className="field">Asset ID<input value={assetId} onChange={e => setAssetId(e.target.value)} placeholder="P-001" maxLength={50}/></label><label className="field">Asset name<input value={label} onChange={e => setLabel(e.target.value)} placeholder="Circulation pump" maxLength={120}/></label><label className="field">Observed condition<textarea value={condition} onChange={e => setCondition(e.target.value)} placeholder="Describe only what you observed." maxLength={1500}/></label><button className="secondary full" onClick={addObservation} disabled={!image}><Plus size={15}/> Add observation</button><div className="annotation-list">{observations.map(o=><div key={o.assetId}><span><b>{o.assetId}</b> {o.label}</span><button aria-label={`Remove ${o.assetId}`} onClick={()=>setObservations(observations.filter(a=>a.assetId!==o.assetId))}><X size={14}/></button></div>)}</div></div></div>{error && <p className="error" role="alert">{error}</p>}<div className="dialog-footer"><span>{observations.length} observations · stored on this device</span><button className="primary" disabled={busy || processing} onClick={submit}><FileCheck2 size={17}/> Save capture</button></div></section></div>;
}
