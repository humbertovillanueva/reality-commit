import { openDB } from 'idb';
import type { Workspace } from './domain';
const database = () => openDB('reality-commit', 1, { upgrade(db) { db.createObjectStore('workspace'); } });
export async function loadWorkspace(): Promise<Workspace | undefined> { return (await database()).get('workspace', 'current'); }
export async function saveWorkspace(workspace: Workspace) { return (await database()).put('workspace', workspace, 'current'); }
