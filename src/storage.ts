import { openDB } from 'idb';
import type { Workspace } from './domain';
import { demoWorkspace, workspaceKey, type SampleId } from './demo';
const database = () => openDB('reality-commit', 1, { upgrade(db) { db.createObjectStore('workspace'); } });
export async function loadWorkspace(): Promise<Workspace | undefined> { return (await database()).get('workspace', 'current'); }
export async function saveWorkspace(workspace: Workspace) {
  const tx = (await database()).transaction('workspace', 'readwrite');
  await tx.store.put(workspace, workspaceKey(workspace));
  await tx.store.put(workspace, 'current');
  await tx.done;
}

export async function savedWorkspaceKeys(): Promise<string[]> {
  const db = await database();
  const keys = (await db.getAllKeys('workspace')).map(String);
  const current = await db.get('workspace', 'current') as Workspace | undefined;
  return [...new Set([...keys, ...(current ? [workspaceKey(current)] : [])])];
}

// Archive the current workspace and change selection atomically. No sample switch
// can overwrite a personal workspace or another sample's committed reviews.
export async function switchWorkspace(current: Workspace, key: string, sample?: SampleId): Promise<Workspace> {
  const tx = (await database()).transaction('workspace', 'readwrite');
  await tx.store.put(current, workspaceKey(current));
  const saved = await tx.store.get(key) as Workspace | undefined;
  const next = saved ?? (sample && key === `sample:${sample}` ? demoWorkspace(sample) : undefined);
  if (!next) { tx.abort(); await tx.done.catch(() => {}); throw new Error('That saved workspace is unavailable. Your current workspace is unchanged.'); }
  await tx.store.put(next, key);
  await tx.store.put(next, 'current');
  await tx.done;
  return next;
}
