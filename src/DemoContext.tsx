import { photoSources } from './demo';

export function PhotoCredits() {
  return <span>Photos: Oldforgefarm · public-domain dedication · <a href={photoSources.before} target="_blank" rel="noreferrer">Before / source</a> · <a href={photoSources.after} target="_blank" rel="noreferrer">After / source</a></span>;
}

export default function DemoContext() {
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
