import { photoSources, bridgeSource, type SampleId } from './demo';

export function PhotoCredits({ sample = 'pump' }: { sample?: SampleId }) {
  if (sample === 'bridge') return <span>Photos: National Park Service · public domain · <a href={bridgeSource} target="_blank" rel="noreferrer">Original composite & rights</a> · Panels displayed separately; image unaltered.</span>;
  return <span>Photos: Oldforgefarm · public-domain dedication · <a href={photoSources.before} target="_blank" rel="noreferrer">Before / source</a> · <a href={photoSources.after} target="_blank" rel="noreferrer">After / source</a></span>;
}

export default function DemoContext({ sample = 'pump' }: { sample?: SampleId }) {
  if (sample === 'bridge') return <section className="demo-context" aria-label="Bridge evidence context and photo provenance">
    <div><span className="eyebrow">PUBLIC INFRASTRUCTURE / EDUCATIONAL REVIEW</span><h2>A finished surface hides part of the story.</h2><p>NPS identifies these as the Old Faithful bridge during and after rehabilitation. This is a construction-progress comparison, not a photograph of an unrepaired defect or a current condition report.</p></div>
    <div className="maintenance-grid">
      <article><h3>What the evidence supports</h3><p>The exposed reinforcement in the work area gives way to a surfaced road with markings. Roadside railings are visible in the later view. Weather, framing, and camera position differ.</p></article>
      <article><h3>What an inspector would verify</h3><p>Request the pre-cover inspection records, approved drawings, material test results, and railing connection details. A qualified bridge inspection—not this photo pair—is needed to assess structural condition.</p></article>
      <article><h3>What remains unknown</h3><p>The photos do not establish reinforcement spacing or cover, concrete strength, hidden defects, rail anchorage, or load capacity. A vehicle on the bridge is not a load-test result.</p></article>
    </div>
    <details><summary>Photo rights, sequence & technical basis</summary><p><PhotoCredits sample="bridge" /></p><p>The source supplies the sequence but no usable capture dates. We display “Date not supplied” rather than using the upload date. B-001 and B-002 are illustrative tracking IDs, not official inventory numbers.</p><p><a href="https://www.nps.gov/yell/learn/management/infrastructure.htm" target="_blank" rel="noreferrer">NPS project context</a> · <a href="https://www.fhwa.dot.gov/bridge/nbis2022/qanda/08.cfm" target="_blank" rel="noreferrer">FHWA inspection guidance</a>. Photographs support documentation; they are not a substitute for physical examination and appropriate testing. No affiliation or endorsement by NPS or FHWA is implied.</p></details>
  </section>;
  return <section className="demo-context" aria-label="Maintenance context and photo provenance">
    <div><span className="eyebrow">REAL PHOTOS / EDUCATIONAL REVIEW</span><h2>Cleaned does not mean cleared for service.</h2><p>These photos from one contributor’s pump-repair series show deposits before cleaning and the exposed housing afterward. Matching this housing across the series is a curated interpretation—not automatic identification or a verified serial-number match.</p></div>
    <div className="maintenance-grid">
      <article><h3>What the evidence supports</h3><p>Deposits obscured the surface. After cleaning, pitting remains visible; the source author also reports pitting. Different framing and disassembly prevent a pixel-for-pixel comparison.</p></article>
      <article><h3>What a technician would verify</h3><p>Identify the pump model, inspect the casing and sealing surfaces, and assess damage against its manufacturer’s limits. Record measurements and the applicable leak and performance checks before a return-to-service decision.</p></article>
      <article><h3>What we cannot conclude</h3><p>No pit-depth measurements, wall thickness, pressure, flow, or test records are supplied. We cannot establish the failure cause, remaining life, or whether the pump is safe to operate.</p></article>
    </div>
    <details><summary>Photo rights, dates & technical basis</summary><p><PhotoCredits /></p><p>Dates shown are the source EXIF calendar dates (February 11 and 18, 2009), not independently verified inspection dates. The cleaned photo’s main date field is malformed. P-001 is a demo ID. The author’s report of a seal after reassembly is not a documented performance test.</p><p>General inspection principle: <a href="https://www.xylem.com/siteassets/brand/a-c-fire-pump/resources/manual/centrifugal-split-case-fire-pumps--series-8100-8150-8200-9100-iom-ac6102-rev-8.pdf" target="_blank" rel="noreferrer">Xylem maintenance manual, §10.3</a>. This is not the identified model’s manual; no model-specific limits or repair instructions are inferred. Work requires qualified personnel and appropriate isolation procedures.</p></details>
  </section>;
}
