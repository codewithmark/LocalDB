# LocalDB 🗃️
 
A lightweight JavaScript utility class for managing arrays of objects in `localStorage`. Provides simple methods to add, retrieve, update, and delete items using key-value pairs as queries.

## Features

- ✅ Add or append arrays to `localStorage` keys  
- 🔍 Find and update items using object queries  
- 🗑️ Remove items or clear storage  
- 🔐 Works only with arrays of objects

 

```html
<script src="localdb.js"></script>
```

---

## ✨ Getting Started

 const db = new LocalDB();

// Add items
db.add('users', [{ id: 1, name: 'Alice' }]);

// Get all items
console.log(db.get('users'));

// Find a user
const user = db.find('users', { id: 1 });

// Update a user
db.update('users', { id: 1 }, { name: 'Alicia' });

// Remove a user
db.remove('users', { id: 1 });

// Clear one key
db.clear('users');

// Clear all localStorage
db.clearAll();

  
