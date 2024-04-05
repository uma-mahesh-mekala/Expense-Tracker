const mongoose = require("mongoose");

const dailyExpenseSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  expense: {
    type: Number,
    required: true,
    default: 0,
  },
});

const DailyExpense = mongoose.model("DailyExpense", dailyExpenseSchema);

module.exports = DailyExpense;
