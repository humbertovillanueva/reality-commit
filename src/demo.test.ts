import { describe, expect, it } from 'vitest';
import { demoWorkspace, initialWorkspace, photoSources, workspaceKey } from './demo';
import { compareCaptures, chronologicalPair, createCommit, type Decision } from './domain';

describe('Curated photographic demo', () => {
  it('gives the bridge two observations and honest unknown dates', () => {
    const w = demoWorkspace('bridge');
    expect(w.captures.map(c => c.capturedAt)).toEqual(['','']);
    expect(w.captures.map(c => c.imageView)).toEqual(['left-half','right-half']);
    expect(compareCaptures(w.captures[0],w.captures[1]).map(c=>c.kind)).toEqual(['condition-changed','condition-changed']);
    expect(workspaceKey(w)).toBe('sample:bridge');
    expect(workspaceKey(demoWorkspace())).toBe('sample:pump');
    expect(workspaceKey({...w,demo:false})).toBe('personal');
  });
  it('uses documented source order only within one curated series', () => {
    const [a,b] = demoWorkspace('bridge').captures;
    expect(chronologicalPair(a,b,true)).toBe(true);
    expect(chronologicalPair(b,a,true)).toBe(false);
    expect(chronologicalPair(a,a,true)).toBe(false);
    expect(chronologicalPair(a,b,false)).toBe(false);
    expect(chronologicalPair(a,{...b,sourceSequence:{series:'unrelated',order:2}},true)).toBe(false);
  });
  it('allows a reviewed source-ordered bridge commit but not invented personal chronology', () => {
    const w = demoWorkspace('bridge');
    const decisions = Object.fromEntries(compareCaptures(w.captures[0],w.captures[1]).map(c=>[c.id,{status:'accepted',note:'Visual progress only; hidden work not verified.'} as Decision]));
    expect(createCommit(w,'bridge-during','bridge-after','Review','Tester',decisions).changes).toHaveLength(2);
    expect(()=>createCommit({...w,demo:false},'bridge-during','bridge-after','Review','Tester',decisions)).toThrow('later');
  });
  it('rejects invalid dates rather than silently allowing a commit', () => {
    const w = demoWorkspace();
    w.captures[0].capturedAt='not a date';
    expect(chronologicalPair(w.captures[0],w.captures[1],true)).toBe(false);
  });
  it('uses real attributed photos and one evidence-backed condition change', () => {
    const w = demoWorkspace();
    expect(w.captures.every(c => c.image.endsWith('.jpg'))).toBe(true);
    expect(Object.values(photoSources).every(s => s.startsWith('https://commons.wikimedia.org/'))).toBe(true);
    expect(compareCaptures(w.captures[0],w.captures[1]).map(c=>c.kind)).toEqual(['condition-changed']);
    expect(w.captures[1].observations[0].condition).toContain('serviceability is not established');
  });
  it('refreshes only an uncommitted legacy demo', () => {
    const old = demoWorkspace(); old.captures[0].image='./demo-before.svg'; old.captures[1].image='./demo-after.svg';
    expect(initialWorkspace(old).captures[0].image).toBe('./pump-before.jpg');
    old.demo=false;
    expect(initialWorkspace(old)).toBe(old);
  });
  it('preserves saved reviews', () => {
    const old = demoWorkspace(); old.captures[0].image='./demo-before.svg'; old.captures[1].image='./demo-after.svg';
    old.commits.push({id:'saved',createdAt:'2026-01-01',title:'Review',reviewer:'User',beforeId:'baseline',afterId:'followup',changes:[],decisions:{}});
    expect(initialWorkspace(old)).toBe(old);
  });
});
