# LocalDB 🗃️

**LocalDB** is a lightweight, schema-aware, in-memory JavaScript database with SQL-like query support, persistence via `localStorage`, and simple CRUD operations — perfect for frontend apps, prototypes, or educational projects.

---

## 🚀 Features

* In-memory table management
* Schema definition with type enforcement and defaults
* Auto ID and timestamp generation
* LocalStorage persistence (browser)
* SQL-like queries (`SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `JOIN`, etc.)
* Smart `WHERE` parsing with support for `AND`, `OR`, `IN`, `LIKE`, `IS NULL`, parentheses
* Aggregates: `SUM`, `AVG`, `DISTINCT`
* Utility methods: `count`, `exists`, `groupBy`, `cloneTable`, `latest`, `removeField`

---

## 📦 Installation

```
npm install localdb-js
```

Or include directly in the browser:

```html
<script src="localdb.js"></script>
```

---

## ✨ Getting Started

### ✅ Initialize LocalDB

```js
const db = new LocalDB();
```

---

## 📄 Define Schema and Insert Data

```js
db.defineTable("users", {
  id: { type: "string", required: true },
  name: { type: "string", required: true },
  email: { type: "string" },
  age: { type: "number", default: 18 },
  isActive: { type: "boolean", default: true }
});
```

### ✅ Add Some Users

🧠 Function:

```js
db.insert("users", [
  { id: "u1", name: "Alice", email: "alice@example.com", age: 25 },
  { id: "u2", name: "Bob", age: 17 },
  { id: "u3", name: "Charlie", age: 30, isActive: false },
]);
```

📦 Output:
Auto-filled fields like `createdAt`, default age and isActive if missing.

---

## 🔍 READ Examples

### 1. All Users

🧠 Function:

```js
const users = db.select("users");
```

📦 Output:

```js
[
  { id: "u1", name: "Alice", age: 25, ... },
  ...
]
```

---

### 2. Using SQL

🧠 Function:

```js
db.query("SELECT * FROM users WHERE age >= 18 AND isActive = true ORDER BY age DESC LIMIT 2");
```

📦 Output:

```js
[
  { id: "u1", name: "Alice", age: 25, isActive: true, ... }
]
```

---

## ✏️ UPDATE Examples

### 1. Update by ID

🧠 Function:

```js
db.update("users", { id: "u2", name: "Bobby", age: 18 });
```

📦 Output:
User `u2` is now Bobby and an adult!

---

### 2. SQL Update

🧠 Function:

```js
db.query("UPDATE users SET ? WHERE ?", [
  { isActive: false },
  { age: 30 }
]);
```

📦 Output:
All users aged 30 are marked inactive.

---

## ❌ DELETE Examples

### 1. Delete by condition

🧠 Function:

```js
db.delete("users", { isActive: false });
```

📦 Output:
Inactive users are removed.

---

### 2. SQL DELETE

🧠 Function:

```js
db.query("DELETE FROM users WHERE age < 18");
```

📦 Output:
All minors are gone.

---

## 📊 Aggregates

### 1. SUM

🧠 Function:

```js
db.query("SELECT SUM(age) FROM users WHERE isActive = true");
```

📦 Output:

```js
43
```

---

### 2. AVG

🧠 Function:

```js
db.query("SELECT AVG(age) FROM users");
```

📦 Output:

```js
21.5
```

---

## 🧠 Advanced WHERE

```js
db.query("SELECT * FROM users WHERE (age > 18 OR name = 'Bob') AND isActive = true");
```

✅ Supports:

* `AND`, `OR`, `()`
* `IN`, `NOT IN`
* `LIKE`, `NOT LIKE`
* `IS NULL`, `IS NOT NULL`

---

## 🔁 JOIN Example

```js
db.defineTable("orders", {
  id: { type: "string", required: true },
  userId: { type: "string" },
  total: { type: "number" },
  status: { type: "string" }
});

db.insert("orders", [
  { id: "o1", userId: "u1", total: 99.99, status: "shipped" },
  { id: "o2", userId: "u1", total: 199.99, status: "processing" },
  { id: "o3", userId: "u3", total: 49.99, status: "cancelled" }
]);

const result = db.query(
  "SELECT * FROM users JOIN orders ON users.id = orders.userId WHERE (total > 100 OR status = 'cancelled') AND isActive = true"
);
console.log(result);
```

📦 Output:
Only joined orders where total > 100 OR status is 'cancelled' AND user is active.

```js
[
  { id: 'u1', name: 'Alice', ..., orderId: 'o2', total: 199.99, status: 'processing' }
]
```

---

## 📋 Real-World Example: Task Manager

```js
// Define users and tasks

db.defineTable("tasks", {
  id: { type: "string", required: true },
  title: { type: "string" },
  userId: { type: "string" },
  priority: { type: "string", default: "medium" },
  completed: { type: "boolean", default: false },
  dueDate: { type: "string" } // ISO date
});

db.insert("tasks", [
  { id: "t1", title: "Design homepage", userId: "u1", priority: "high", completed: false, dueDate: "2024-12-01" },
  { id: "t2", title: "Fix login bug", userId: "u2", completed: true, dueDate: "2024-10-10" },
  { id: "t3", title: "Write docs", userId: "u1", dueDate: "2024-11-05" },
]);

// Fetch all pending tasks assigned to active users, ordered by priority
const results = db.query(
  "SELECT * FROM users JOIN tasks ON users.id = tasks.userId WHERE tasks.completed = false AND users.isActive = true ORDER BY tasks.priority ASC"
);

console.log(results);
```

📦 Output:
A list of incomplete tasks with user details, sorted by priority.

---
