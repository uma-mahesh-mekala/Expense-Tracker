import React, { useEffect } from "react";
import Heading from "./Heading";

function App() {
  let [expense, setExpense] = React.useState(0);
  let [date, setDate] = React.useState(new Date().toJSON().slice(0, 10));
  let [expenses, setExpenses] = React.useState({
    dailyExpenses: 0,
    monthlyExpenses: 0,
  });
  let [errorMessage, setErrorMessage] = React.useState();

  const updateExpenses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/expenses", {
        method: "GET",
        cors: "cors",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `There is an error fetching the data. please try later.`
        );
      }
      const fetchedData = await response.json();
      setExpenses(fetchedData);
      setExpense(0);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.message);
    }
  };
  useEffect(() => {
    updateExpenses();
  }, []);
  function handleChange(event) {
    event.target.name === "expense"
      ? setExpense(event.target.value)
      : setDate(event.target.value);
  }

  async function addExpense(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/expenses", {
        method: "POST",
        cors: "cors",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          expense: expense,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add the expenses. Please try again later");
      }
      updateExpenses();
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div>
      <Heading />
      <p id="error-message">{errorMessage}</p>
      <div className="expense-container">
        <form>
          <input
            type="date"
            name="date"
            placeholder="select date"
            value={date}
            onChange={handleChange}
          />
          <input
            type="number"
            name="expense"
            placeholder="Enter the amount"
            value={expense}
            onChange={handleChange}
          />
          <button onClick={addExpense}>Add Amount</button>
        </form>
        <div className="expenses">
          <p>
            Today's Expenses: <span>{expenses.dailyExpenses}</span>
          </p>
          <p>
            Monthly Expenses: <span>{expenses.monthlyExpenses}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
