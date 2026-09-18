import type { Workspace } from './domain';
export const photoSources = {
  before: 'https://commons.wikimedia.org/wiki/File:Close_view_of_pump.JPG',
  after: 'https://commons.wikimedia.org/wiki/File:Clean_pump.JPG',
};
export type SampleId = 'pump' | 'bridge';
export const bridgeSource = 'https://npgallery.nps.gov/AssetDetail/77430a60-a5f2-4b6b-a32e-d531213d9a1b';
export const samples = [
  { id: 'pump' as const, title: 'Pump cleaning', category: 'EQUIPMENT MAINTENANCE', description: 'Deposits removed. Residual pitting still needs assessment.', image: './pump-after.jpg' },
  { id: 'bridge' as const, title: 'Bridge rehabilitation', category: 'PUBLIC INFRASTRUCTURE', description: 'From exposed reinforcement to a finished road. What is now hidden?', image: './bridge-rehabilitation.jpg', imageView: 'right-half' as const },
];
// Source EXIF calendar dates, not verified inspection dates. P-001 is a demo ID.
export function demoWorkspace(sample: SampleId = 'pump'): Workspace {
  if (sample === 'bridge') return bridgeWorkspace();
  return { version: 1, name: 'Pump cleaning / Photo study', demo: true, commits: [], captures: [
    { id: 'baseline', title: 'Before cleaning · source photo', capturedAt: '2009-02-11T12:00:00', image: './pump-before.jpg', observations: [
      { assetId: 'P-001', label: 'Pump housing', condition: 'Heavy deposits cover the internal housing around the shaft opening. The underlying surface cannot be fully assessed in this photo.', x: .34, y: .49 },
    ] },
    { id: 'followup', title: 'After cleaning · source photo', capturedAt: '2009-02-18T12:00:00', image: './pump-after.jpg', observations: [
      { assetId: 'P-001', label: 'Pump housing', condition: 'Much of the deposit layer is removed, exposing an uneven, pitted internal surface. Cleaning is documented; restored serviceability is not established.', x: .38, y: .56 },
    ] },
  ] };
}

function bridgeWorkspace(): Workspace {
  return { version: 1, name: 'Old Faithful / Bridge rehabilitation', demo: true, commits: [], captures: [
    { id: 'bridge-during', title: 'During rehabilitation', capturedAt: '', image: './bridge-rehabilitation.jpg', imageView: 'left-half', sourceSequence: { series: bridgeSource, order: 1 }, observations: [
      { assetId: 'B-001', label: 'Bridge deck', condition: 'An exposed reinforcement grid occupies the work area. The final road surface is not present in this area; no bar spacing, cover depth, or material tests can be verified from this view.', x: .59, y: .48 },
      { assetId: 'B-002', label: 'Deck-edge protection', condition: 'Timber work-zone barriers and a concrete edge are visible. Permanent railing continuity and connections cannot be established from this construction view.', x: .08, y: .32 },
    ] },
    { id: 'bridge-after', title: 'After rehabilitation', capturedAt: '', image: './bridge-rehabilitation.jpg', imageView: 'right-half', sourceSequence: { series: bridgeSource, order: 2 }, observations: [
      { assetId: 'B-001', label: 'Bridge deck', condition: 'A continuous surfaced roadway with lane markings is visible. Reinforcement is no longer visible; its placement, concrete quality, and load capacity remain unverified by these photos.', x: .54, y: .56 },
      { assetId: 'B-002', label: 'Deck-edge protection', condition: 'Railings are visible along both road edges. Their appearance documents installation, not anchorage strength, dimensions, or compliance with the approved design.', x: .72, y: .48 },
    ] },
  ] };
}

export function sampleId(workspace: Workspace): SampleId | undefined {
  if (!workspace.demo) return undefined;
  if (workspace.captures[0]?.image === './pump-before.jpg') return 'pump';
  if (workspace.captures[0]?.image === './bridge-rehabilitation.jpg') return 'bridge';
  return undefined;
}

export function workspaceKey(workspace: Workspace): string {
  return workspace.demo ? `sample:${sampleId(workspace) ?? 'legacy'}` : 'personal';
}

export function initialWorkspace(saved?: Workspace): Workspace {
  // Never replace personal captures or saved reviews. Legacy images remain available.
  if (!saved || (saved.demo && !saved.commits.length && saved.captures.every(c => c.image === './demo-before.svg' || c.image === './demo-after.svg'))) return demoWorkspace();
  return saved;
}
