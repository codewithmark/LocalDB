class LocalDB {
  constructor() {}

  // Add or append array of items to key
  add(key, data) {
    if (!Array.isArray(data)) {
      throw new Error("add() expects an array");
    }

    const existing = this.get(key);
    const merged = existing.concat(data);
    localStorage.setItem(key, JSON.stringify(merged));
  }

  // Get array from key
  get(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // Find first matching item by query
  find(key, query) {
    const data = this.get(key);
    return data.find(item =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    );
  }

  // Update first matching item
  update(key, query, newData) {
    let data = this.get(key);
    let updated = false;

    data = data.map(item => {
      if (!updated && Object.entries(query).every(([k, v]) => item[k] === v)) {
        updated = true;
        return { ...item, ...newData };
      }
      return item;
    });

    if (updated) {
      this.addReplace(key, data);
    }

    return updated;
  }

  // Remove matching items
  remove(key, query) {
    const data = this.get(key);
    const filtered = data.filter(
      item => !Object.entries(query).every(([k, v]) => item[k] === v)
    );
    this.addReplace(key, filtered);
    return filtered;
  }

  // Clear specific key
  clear(key) {
    localStorage.removeItem(key);
  }

  // Clear all of localStorage
  clearAll() {
    localStorage.clear();
  }

  // Internal: replace entire array at key
  addReplace(key, data) {
    if (!Array.isArray(data)) {
      throw new Error("addReplace() expects an array");
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
}
