import { openDB, IDBPDatabase } from 'idb';

let db: IDBPDatabase | null = null;
export async function initDB() {
  db = await openDB('offline-ai', 1, {
    upgrade(d) {
      d.createObjectStore('conversations', { keyPath: 'id', autoIncrement: true });
      d.createObjectStore('settings', { keyPath: 'key' });
      d.createObjectStore('model-cache', { keyPath: 'modelId' });
    },
  });
}
export const getDB = () => db!;
