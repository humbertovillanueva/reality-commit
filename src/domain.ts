export type Observation = { assetId: string; label: string; condition: string; x: number; y: number };
export type Capture = { id: string; title: string; capturedAt: string; image: string; observations: Observation[] };
export type ChangeKind = 'newly-observed' | 'not-observed' | 'condition-changed';
export type Change = { id: string; assetId: string; label: string; kind: ChangeKind; before?: Observation; after?: Observation };
export type Decision = { status: 'accepted' | 'rejected' | 'needs-evidence'; note: string };
export type Commit = { id: string; createdAt: string; title: string; reviewer: string; beforeId: string; afterId: string; changes: Change[]; decisions: Record<string, Decision> };
export type Workspace = { version: 1; name: string; demo: boolean; captures: Capture[]; commits: Commit[] };

// IDs, not appearance or image coordinates, establish identity in v0.1.
// A different camera position is not evidence that an object moved.
export function compareCaptures(before: Capture, after: Capture): Change[] {
  const previous = new Map(before.observations.map(o => [o.assetId, o]));
  const current = new Map(after.observations.map(o => [o.assetId, o]));
  const result: Change[] = [];
  for (const o of after.observations) {
    const old = previous.get(o.assetId);
    const kind = !old ? 'newly-observed' : old.condition.trim().toLowerCase() !== o.condition.trim().toLowerCase() ? 'condition-changed' : undefined;
    if (kind) result.push({ id: `${before.id}:${after.id}:${o.assetId}`, assetId: o.assetId, label: o.label, kind, before: old, after: o });
  }
  for (const o of before.observations) if (!current.has(o.assetId)) result.push({ id: `${before.id}:${after.id}:${o.assetId}`, assetId: o.assetId, label: o.label, kind: 'not-observed', before: o });
  return result;
}
export function createCommit(workspace: Workspace, beforeId: string, afterId: string, title: string, reviewer: string, decisions: Record<string, Decision>): Commit {
  const before = workspace.captures.find(c => c.id === beforeId);
  const after = workspace.captures.find(c => c.id === afterId);
  if (!before || !after || beforeId === afterId) throw new Error('Choose two different captures.');
  if (Date.parse(before.capturedAt) >= Date.parse(after.capturedAt)) throw new Error('The current capture must be later than the baseline.');
  if (!title.trim() || !reviewer.trim()) throw new Error('Add a commit message and reviewer name.');
  if (workspace.commits.some(c => c.beforeId === beforeId && c.afterId === afterId)) throw new Error('This comparison is already committed.');
  const changes = compareCaptures(before, after);
  if (!changes.length) throw new Error('No recorded changes to commit.');
  if (changes.some(c => !decisions[c.id] || decisions[c.id].status === 'needs-evidence')) throw new Error('Accept or reject every proposal before committing.');
  if (changes.some(c => decisions[c.id].status === 'accepted' && !decisions[c.id].note.trim())) throw new Error('Add a verification note to each accepted change.');
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), title: title.trim(), reviewer: reviewer.trim(), beforeId, afterId, changes: structuredClone(changes), decisions: structuredClone(decisions) };
}
export const kindLabel: Record<ChangeKind, string> = { 'newly-observed': 'Newly observed', 'not-observed': 'Not observed', 'condition-changed': 'Condition changed' };
