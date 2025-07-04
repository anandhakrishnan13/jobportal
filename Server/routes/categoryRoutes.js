import express from "express";
const router = express.Router();

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
