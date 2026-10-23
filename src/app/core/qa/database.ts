import { emptyQaStats, QA_DATABASE, QA_DATABASE_VERSION, QaDraft, QaEvent, QaSession, qaId, updateQaStats } from './types';

export interface QaStore {
  enabled(): Promise<boolean>;
  commit(gameKey: string, events: readonly QaDraft[], consent?: boolean): Promise<QaEvent[]>;
  sessions(): Promise<QaSession[]>;
  events(sessionId?: string, limit?: number): Promise<QaEvent[]>;
  clear(): Promise<void>;
  close(): void;
}
export function openQaDatabase(factory: IDBFactory = globalThis.indexedDB, name = QA_DATABASE): Promise<QaStore> {
  return new Promise((resolve, reject) => {
    if (!factory) { reject(new Error('IndexedDB unavailable')); return; }
    const request = factory.open(name, QA_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const events = db.createObjectStore('events', { keyPath: 'order', autoIncrement: true });
      events.createIndex('sessionId', 'sessionId'); events.createIndex('id', 'id', { unique: true });
      const sessions = db.createObjectStore('sessions', { keyPath: 'gameKey' });
      sessions.createIndex('id', 'id', { unique: true });
      db.createObjectStore('settings');
    };
    let blocked = false;
    request.onblocked = () => { blocked = true; reject(new Error('QA database is blocked by an older tab')); };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      const store = new IndexedDbQaStore(request.result);
      request.result.onversionchange = () => store.close();
      resolve(store);
    };
  });
}
export class IndexedDbQaStore implements QaStore {
  constructor(private readonly db: IDBDatabase) {}
  enabled(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readonly'); const r = tx.objectStore('settings').get('enabled');
      tx.oncomplete = () => resolve(r.result === true); tx.onabort = tx.onerror = () => reject(tx.error);
    });
  }
  /** One transaction allocates both session sequence and global order, including across tabs. */
  commit(gameKey: string, drafts: readonly QaDraft[], consent?: boolean): Promise<QaEvent[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['events', 'sessions', 'settings'], 'readwrite');
      const events = tx.objectStore('events'); const sessions = tx.objectStore('sessions'); const settings = tx.objectStore('settings');
      const written: QaEvent[] = [];
      tx.oncomplete = () => resolve(written); tx.onabort = tx.onerror = () => reject(tx.error ?? new Error('QA transaction failed'));
      const check = settings.get('enabled');
      check.onsuccess = () => {
        const wasEnabled = check.result === true;
        if (consent !== undefined) settings.put(consent, 'enabled');
        if (!(consent === true || wasEnabled) || !drafts.length) return;
        const found = sessions.get(gameKey);
        found.onsuccess = () => {
          const session: QaSession = found.result ?? { id: qaId(), gameKey, createdAt: drafts[0].timestamp, lastEventAt: drafts[0].timestamp, eventCount: 0, stats: emptyQaStats() };
          for (const draft of drafts) {
            const record = { ...draft, sessionId: session.id, sequence: ++session.eventCount };
            updateQaStats(session.stats, draft); session.lastEventAt = draft.timestamp;
            const added = events.add(record);
            added.onsuccess = () => written.push({ ...record, order: Number(added.result) });
          }
          sessions.put(session);
        };
      };
    });
  }
  sessions(): Promise<QaSession[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sessions', 'readonly'); const r = tx.objectStore('sessions').getAll();
      tx.oncomplete = () => resolve(r.result as QaSession[]); tx.onabort = tx.onerror = () => reject(tx.error);
    });
  }
  events(sessionId?: string, limit?: number): Promise<QaEvent[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('events', 'readonly'); const store = tx.objectStore('events');
      const rows: QaEvent[] = [];
      const cursor = sessionId ? store.index('sessionId').openCursor(sessionId, limit ? 'prev' : 'next') : store.openCursor(undefined, limit ? 'prev' : 'next');
      cursor.onsuccess = () => {
        const row = cursor.result; if (!row || limit && rows.length >= limit) return;
        rows.push(row.value as QaEvent); row.continue();
      };
      tx.oncomplete = () => resolve(rows.sort((a,b) => a.order - b.order)); tx.onabort = tx.onerror = () => reject(tx.error);
    });
  }
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['events', 'sessions', 'settings'], 'readwrite');
      tx.objectStore('events').clear(); tx.objectStore('sessions').clear(); tx.objectStore('settings').put(false, 'enabled');
      tx.oncomplete = () => resolve(); tx.onabort = tx.onerror = () => reject(tx.error);
    });
  }
  close(): void { this.db.close(); }
}
