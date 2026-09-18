# Architecture / v0.1

React + TypeScript + Vite. No backend. `src/domain.ts` is the pure comparison and commit layer, tested with Vitest. `src/storage.ts` uses IndexedDB through `idb`. `src/demo.ts` contains synthetic fixtures; `public/demo-*.svg` contains their illustrations.

Workspace → captures → observations. Observations join across visits by explicit asset ID. A comparison generates proposals. A commit snapshots the proposals and review decisions, referencing both capture IDs. Captures have no editing UI after saving.

`App.tsx` contains the initial review, asset register, history, and capture-entry interfaces. Split components as these workflows grow. Keep external inference behind a separate adapter; it must not write accepted facts directly.

Known limitations: single workspace, client-side validation, no authenticated identity, no tamper resistance, no server persistence, no original-file retention, no automated visual matching, no backup import. Any production evidence system needs substantially stronger validation, access control, durability, and capture provenance.
