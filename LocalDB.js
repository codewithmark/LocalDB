class idbStore {
  constructor(dbName = 'AppDB', storeName = 'items') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async _tx(mode) {
    if (!this.db) await this.init();
    return this.db.transaction([this.storeName], mode).objectStore(this.storeName);
  }

  async add(item) {
    const store = await this._tx('readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async bulkAdd(items) {
    for (const item of items) {
      await this.add(item);
    }
  }

  async getAll() {
    const store = await this._tx('readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async get(id) {
    const store = await this._tx('readonly');
    return new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async find(query) {
    const all = await this.getAll();
    return all.find(item =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    );
  }

  async update(id, newData) {
    const item = await this.get(id);
    if (!item) return false;
    const updated = { ...item, ...newData };
    await this.add(updated);
    return true;
  }

  async delete(id) {
    const store = await this._tx('readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async remove(query) {
    const all = await this.getAll();
    const toDelete = all.filter(item =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    );
    for (const item of toDelete) {
      await this.delete(item.id);
    }
    return toDelete.length;
  }

  async clear() {
    const store = await this._tx('readwrite');
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
}
