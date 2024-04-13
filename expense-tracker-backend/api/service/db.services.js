class ExpenseService {
  constructor(fastify) {
    this.fastify = fastify;
  }

  addExpenses = async (req) => {
    const { pool } = this.fastify;
    const { date, expense } = req.body;
    const client = await pool.connect();
    let response;
    try {
      // Attempt to update the expense for the given date, if it exists
      const updateResult = await client.query(
        "UPDATE expenses SET expenses = expenses + $2 WHERE date = $1 RETURNING *",
        [date, expense]
      );

      // If no row was updated, insert a new expense
      if (updateResult.rowCount === 0) {
        await client.query(
          "INSERT INTO expenses (date, expenses) VALUES ($1, $2)",
          [date, expense]
        );
      }

      response = {
        statusCode: 200,
        body: {
          message: "Expenses added successfully",
        },
      };
    } catch (err) {
      console.log(err);
      response = {
        statusCode: 500,
        body: {
          message: "Internal server error",
        },
      };
    } finally {
      client.release();
    }
    return response;
  };

  getExpenses = async (req) => {
    const { pool } = this.fastify;
    const { date } = req.query; // Assuming the date is in the request body and in 'YYYY-MM-DD' format
    const client = await pool.connect();

    let response;

    try {
      // Start your transaction
      await client.query("BEGIN");

      const yearMonth = date.slice(0, 7);
      const dailyExpenseQuery = "SELECT expenses FROM expenses WHERE date = $1";
      const dailyExpenseResult = await client.query(dailyExpenseQuery, [date]);
      const dailyExpense =
        dailyExpenseResult.rows.length > 0
          ? dailyExpenseResult.rows[0].expenses
          : 0;

      const avgDailyExpenseQuery =
        "SELECT TO_CHAR(date, 'Mon,YYYY') as monthYear, ROUND(AVG(expenses),2) as avg_daily_expenses FROM expenses WHERE EXTRACT(month from date) = EXTRACT(month from DATE($1)) AND EXTRACT(year from date) = EXTRACT(year from DATE($1)) GROUP BY monthYear";

      const avgDailyExpenseResult = await client.query(avgDailyExpenseQuery, [
        date,
      ]);

      const avgDailyExpense =
        avgDailyExpenseResult.rows.length > 0
          ? avgDailyExpenseResult.rows[0].avg_daily_expenses
          : 0;

      const monthlyExpenseQuery =
        "SELECT TO_CHAR(date, 'Mon,YYYY') as monthYear, SUM(expenses) as total_expenses FROM expenses WHERE EXTRACT(month from date) = EXTRACT(month from DATE($1)) AND EXTRACT(year from date) = EXTRACT(year from DATE($1)) GROUP BY monthYear";
      const monthlyExpenseResult = await client.query(monthlyExpenseQuery, [
        date,
      ]);

      const monthlyExpense =
        monthlyExpenseResult.rows.length > 0
          ? monthlyExpenseResult.rows[0].total_expenses
          : 0;

      // Commit your transaction
      await client.query("COMMIT");

      response = {
        statusCode: 200,
        body: {
          dailyExpenses: parseFloat(dailyExpense),
          avgDailyExpenses: parseFloat(avgDailyExpense),
          monthlyExpenses: parseFloat(monthlyExpense),
        },
      };
    } catch (err) {
      // Rollback in case of error
      await client.query("ROLLBACK");
      response = {
        statusCode: 500,
        body: {
          message: "Internal server error",
        },
      };
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
    return response;
  };
}

module.exports = ExpenseService;
