import { describe, expect, it } from 'vitest';
import { demoWorkspace, initialWorkspace, photoSources } from './demo';
import { compareCaptures } from './domain';

describe('Curated photographic demo', () => {
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
