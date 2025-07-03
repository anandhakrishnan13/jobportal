import express from "express";
const router = express.Router();

// Dummy categories (can be from DB in real apps)
const categories = [
  "IT",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Design",
  "Sales",
  "Engineering",
];

router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
