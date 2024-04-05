const DailyExpense = require("../models/daily.expenses.model");
const MonthlyExpense = require("../models/monthly.expenses.model");
class ExpenseService {
  constructor(fastify) {
    this.fastify = fastify;
  }

  addDailyExpenses = async (data) => {
    try {
      const { date, expense } = data;
      const month = date.slice(0, 7);
      const result = await DailyExpense.findOne({ date: date });
      let savedExpense;
      if (!result) {
        const newExpense = new DailyExpense({
          date: date,
          expense: expense,
        });

        savedExpense = await newExpense.save();
      } else {
        result.expense = result.expense + parseInt(expense);
        savedExpense = await result.save();
      }
      const selectedExpense = {
        date: savedExpense.date,
        expense: savedExpense.expense,
      };
      return selectedExpense;
    } catch (err) {
      return err;
    }
  };

  addMonthlyExpenses = async (data) => {
    try {
      const { date, expense } = data;
      const month = date.slice(0, 7);
      const result = await MonthlyExpense.findOne({ month: month });
      let savedExpense;
      if (!result) {
        const newExpense = new MonthlyExpense({
          month: month,
          expenses: expense,
        });

        savedExpense = await newExpense.save();
      } else {
        result.expenses = result.expenses + parseInt(expense);
        savedExpense = await result.save();
      }
      const selectedExpense = {
        month: savedExpense.month,
        expenses: savedExpense.expenses,
      };
      return selectedExpense;
    } catch (err) {
      return err;
    }
  };

  getDailyExpenses = async () => {
    const date = new Date().toISOString().slice(0, 10);
    const dailyExpense = await DailyExpense.findOne({ date });
    let response;
    if (!dailyExpense) {
      response = 0;
    } else {
      response = dailyExpense.expense;
    }
    return response;
  };

  getMonthlyExpenses = async () => {
    const month = new Date().toISOString().slice(0, 7);
    const monthlyExpense = await MonthlyExpense.findOne({ month });
    let response;
    if (!monthlyExpense) {
      response = 0;
    } else {
      response = monthlyExpense.expenses;
    }
    return response;
  };
}

module.exports = ExpenseService;
