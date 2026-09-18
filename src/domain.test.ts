import { describe, expect, it } from 'vitest';
import { compareCaptures, createCommit, type Decision } from './domain';
import { demoWorkspace } from './demo';

const fixture = () => {
  const w = demoWorkspace();
  const decisions = Object.fromEntries(compareCaptures(...w.captures as [typeof w.captures[0], typeof w.captures[0]]).map(c => [c.id, { status: 'accepted', note: 'Checked against capture evidence.' } as Decision]));
  return { w, decisions };
};
describe('Evidence comparison', () => {
  it('detects condition, newly observed, and unobserved assets', () => {
    const w = demoWorkspace();
    expect(compareCaptures(w.captures[0], w.captures[1]).map(c => c.kind)).toEqual(['condition-changed', 'condition-changed', 'newly-observed', 'not-observed']);
  });
  it('does not claim movement from image coordinates', () => {
    const a = demoWorkspace().captures[0]; const b = structuredClone(a);
    b.observations[0].x = .9;
    expect(compareCaptures(a,b)).toEqual([]);
  });
  it('ignores case and surrounding whitespace in condition notes', () => {
    const a = demoWorkspace().captures[0]; const b = structuredClone(a);
    b.observations[0].condition = ` ${b.observations[0].condition.toUpperCase()} `;
    expect(compareCaptures(a,b)).toEqual([]);
  });
});
describe('Commit integrity', () => {
  it('requires every proposal to be resolved', () => {
    const {w} = fixture(); expect(() => createCommit(w,'baseline','followup','Review','Reviewer',{})).toThrow('every proposal');
  });
  it('requires evidence notes for accepted changes', () => {
    const {w,decisions} = fixture(); Object.values(decisions)[0].note = '';
    expect(() => createCommit(w,'baseline','followup','Review','Reviewer',decisions)).toThrow('verification note');
  });
  it('rejects reverse chronology and identical captures', () => {
    const {w,decisions} = fixture();
    expect(() => createCommit(w,'followup','baseline','Review','Reviewer',decisions)).toThrow('later');
    expect(() => createCommit(w,'baseline','baseline','Review','Reviewer',decisions)).toThrow('different');
  });
  it('requires reviewer attribution and message', () => {
    const {w,decisions} = fixture();
    expect(() => createCommit(w,'baseline','followup','','Reviewer',decisions)).toThrow('reviewer');
  });
  it('snapshots review data and prevents duplicate commits', () => {
    const {w,decisions} = fixture(); const c = createCommit(w,'baseline','followup','Review','Reviewer',decisions);
    Object.values(decisions)[0].note = 'Changed'; w.captures[1].observations[0].condition = 'Changed';
    expect(Object.values(c.decisions)[0].note).not.toBe('Changed'); expect(c.changes[0].after?.condition).not.toBe('Changed');
    w.commits.push(c);
    expect(() => createCommit(w,'baseline','followup','Review','Reviewer',decisions)).toThrow('already committed');
  });
});
