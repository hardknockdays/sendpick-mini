import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get("/api/job-orders", (req, res) => {
  const rows = db.prepare("SELECT * FROM job_orders").all();
  res.json(rows);
});

app.get('/api/job-orders/:id', (req, res) => {
  const id = req.params.id
  const jobOrder = db.prepare('SELECT * FROM job_orders WHERE id = ?').get(id)
  if (!jobOrder) return res.status(404).json({ error: 'Job Order not found' })
  res.json(jobOrder)
})

app.get("/api/job-orders/:id/manifests", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM manifests WHERE job_order_id = ?")
    .all(req.params.id);
  res.json(rows);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
