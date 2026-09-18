import type { Workspace } from './domain';
// Entirely synthetic fixture. No customer site imagery or operational records.
export function demoWorkspace(): Workspace {
  return { version: 1, name: 'North plant / Mechanical room', demo: true, commits: [], captures: [
    { id: 'baseline', title: 'Baseline walkthrough', capturedAt: '2026-09-16T09:00:00Z', image: './demo-before.svg', observations: [
      { assetId: 'P-001', label: 'Circulation pump', condition: 'Paint intact; no visible surface staining', x: .31, y: .66 },
      { assetId: 'V-002', label: 'Isolation valve', condition: 'Pipe section uninsulated', x: .67, y: .36 },
      { assetId: 'T-003', label: 'Service toolbox', condition: 'Visible on floor beside pump', x: .76, y: .81 },
    ] },
    { id: 'followup', title: 'Follow-up walkthrough', capturedAt: '2026-09-23T09:15:00Z', image: './demo-after.svg', observations: [
      { assetId: 'P-001', label: 'Circulation pump', condition: 'Brown surface staining visible on casing', x: .31, y: .66 },
      { assetId: 'V-002', label: 'Isolation valve', condition: 'Pipe section has visible insulation wrap', x: .67, y: .36 },
      { assetId: 'G-004', label: 'Pressure gauge', condition: 'Gauge visible above pump', x: .39, y: .40 },
    ] },
  ] };
}
