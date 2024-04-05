const mongoose = require("mongoose");

const monthlyExpenseSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
});

const MonthlyExpense = mongoose.model("MonthlyExpense", monthlyExpenseSchema);

module.exports = MonthlyExpense;
