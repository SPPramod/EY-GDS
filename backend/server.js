const express = require("express");
const router = express.Router();
const Expense = require("../models/ExpenseModel");
const { protect } = require("../middleware/authMiddleware");

// Create an expense
router.post("/", protect, async (req, res) => {
  const { category, amount, date } = req.body;
  const expense = new Expense({ user: req.user._id, category, amount, date });
  await expense.save();
  res.status(201).json(expense);
});

// Get all expenses
router.get("/", protect, async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  res.json(expenses);
});

// Update an expense
router.put("/:id", protect, async (req, res) => {
  const { category, amount, date } = req.body;
  const expense = await Expense.findById(req.params.id);
  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }
  expense.category = category || expense.category;
  expense.amount = amount || expense.amount;
  expense.date = date || expense.date;
  await expense.save();
  res.json(expense);
});

// Delete an expense
router.delete("/:id", protect, async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }
  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
});

module.exports = router;

