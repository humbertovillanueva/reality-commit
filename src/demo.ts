import type { Workspace } from './domain';
export const photoSources = {
  before: 'https://commons.wikimedia.org/wiki/File:Close_view_of_pump.JPG',
  after: 'https://commons.wikimedia.org/wiki/File:Clean_pump.JPG',
};
// Source EXIF calendar dates, not verified inspection dates. P-001 is a demo ID.
export function demoWorkspace(): Workspace {
  return { version: 1, name: 'Pump cleaning / Photo study', demo: true, commits: [], captures: [
    { id: 'baseline', title: 'Before cleaning · source photo', capturedAt: '2009-02-11T12:00:00', image: './pump-before.jpg', observations: [
      { assetId: 'P-001', label: 'Pump housing', condition: 'Heavy deposits cover the internal housing around the shaft opening. The underlying surface cannot be fully assessed in this photo.', x: .34, y: .49 },
    ] },
    { id: 'followup', title: 'After cleaning · source photo', capturedAt: '2009-02-18T12:00:00', image: './pump-after.jpg', observations: [
      { assetId: 'P-001', label: 'Pump housing', condition: 'Much of the deposit layer is removed, exposing an uneven, pitted internal surface. Cleaning is documented; restored serviceability is not established.', x: .38, y: .56 },
    ] },
  ] };
}

export function initialWorkspace(saved?: Workspace): Workspace {
  // Never replace personal captures or saved reviews. Legacy images remain available.
  if (!saved || (saved.demo && !saved.commits.length && saved.captures.every(c => c.image === './demo-before.svg' || c.image === './demo-after.svg'))) return demoWorkspace();
  return saved;
}
