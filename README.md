# Reality Commit

**A memory for physical spaces.** Compare site visits, review evidence, and preserve an asset-level history.

Reality Commit explores version control for the physical world, starting with mechanical rooms and facility maintenance. A photo tells you what a place looked like. A reviewed sequence tells you what changed—and what the evidence actually supports.

## First working slice

- Compare two captures side by side with asset markers.
- Review changes in recorded conditions, newly observed assets, and assets not observed.
- Accept or reject proposals, with verification notes for accepted changes.
- Save review commits and browse a persistent asset register.
- Upload your own photographs and manually annotate stable asset IDs.
- Store captures and reviews in browser IndexedDB; export the workspace as JSON.

**This is an early, local-first prototype, not an automated inspection system.** The sample is synthetic. Comparison currently uses manually recorded asset IDs and condition notes, not AI image recognition. Reviewer names and capture times are self-reported. Commits are local snapshots, not cryptographically signed records.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
git clone https://github.com/humbertovillanueva/reality-commit.git
cd reality-commit
npm ci
npm run dev
```

Open the local address printed in your terminal.

```sh
npm test
npm run build
```

## Try it

1. Explore the four proposals in the sample workspace.
2. Write a verification note, then accept a proposal—or reject it.
3. Resolve all four proposals and select **Commit review**.
4. Enter a message and reviewer name. Inspect the saved record in **Commit history**.
5. To use your own evidence, select **New capture**. The first real upload replaces the sample. Upload two dated photographs, reusing the same asset IDs across visits.

## Evidence rules

- **Not observed is not removed.** A missing annotation may mean occlusion or incomplete coverage.
- **Newly observed is not newly installed.** First sighting does not establish installation time.
- **Different pixels are not movement.** Camera position changes too.
- **A stain is not a diagnosis.** The reviewer records what can actually be established.
- Rewording a condition note can generate a proposal; review is essential.

## Privacy and limits

Images are processed in your browser, resized to a maximum dimension of 1800 px, and re-encoded without original metadata. Original files are not preserved. Do not use this prototype as the sole repository for evidence or for safety, insurance, or compliance decisions.

There is no server, account system, cloud sync, or shared workspace. Your brother can collaborate on the code; captures do not sync between your devices. Browser data can be cleared or evicted. Export provides readable JSON, but restoration/import is not implemented yet. Review drafts are not persisted; saved captures and commits are. Demo exports reference bundled illustration files. Do not commit real facility photographs, credentials, or operational records to this public repository.

## Next milestones

1. **Reliable evidence:** export/import round-trip, original-file preservation, capture coverage, attachment integrity hashes.
2. **Assisted review:** opt-in vision proposals with source regions, uncertainty, and human confirmation; evaluate false positives before claiming reliability.
3. **Walkthroughs:** video frame extraction and cross-visit asset matching, including unresolved identity candidates.
4. **Collaboration:** authenticated reviewers, permissions, shared storage, and server-side audit history.

The next useful experiment is a real, consented two-visit dataset from one room—not a promise to recognize every object in every building.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [architecture notes](docs/architecture.md). Small, tested contributions are welcome.

MIT licensed. Created by [Humberto Villanueva](https://humbertovillanueva.dev).
