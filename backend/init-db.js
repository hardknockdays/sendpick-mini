import Database from 'better-sqlite3'

// Buat / buka database
const db = new Database('sendpick.db')

// Buat tabel job_orders
db.prepare(`
CREATE TABLE IF NOT EXISTS job_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL
)
`).run()

// Buat tabel manifests
db.prepare(`
CREATE TABLE IF NOT EXISTS manifests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_order_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (job_order_id) REFERENCES job_orders(id)
)
`).run()

// Insert data dummy Job Orders
db.prepare(`
INSERT INTO job_orders (customer_name, origin, destination, status) VALUES
('PT ABC', 'Jakarta', 'Bandung', 'Pending'),
('PT XYZ', 'Surabaya', 'Bali', 'Delivered')
`).run()

// Insert data dummy Manifest
db.prepare(`
INSERT INTO manifests (job_order_id, item_name, quantity) VALUES
(1, 'Item A', 10),
(1, 'Item B', 5),
(2, 'Item X', 3)
`).run()

console.log('Database sendpick.db berhasil dibuat dan data dummy sudah terisi.')
