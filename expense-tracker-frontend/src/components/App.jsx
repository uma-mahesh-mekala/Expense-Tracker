import React, { useEffect, useState } from "react";
import Heading from "./Heading";

function App() {
  let [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  let [expense, setExpense] = useState(0);
  let [message, setMessage] = useState("");
  let [messageType, setMessageType] = useState("");
  let [expenses, setExpenses] = useState({
    dailyExpenses: 0,
    monthlyExpenses: 0,
    avgDailyExpenses: 0,
  });

  const getExpenses = async () => {
    const url = `http://localhost:8080/expenses?date=${date}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setMessageType("error");
        setMessage("Unable to Fetch the data");
      }

      const fetchedData = await response.json();
      setExpenses(fetchedData);
    } catch (err) {
      setMessageType("error");
      setMessage("Unable to Fetch the data");
    }
  };

  const addExpenses = async (event) => {
    event.preventDefault();

    const postData = {
      date,
      expense,
    };

    const url = `http://localhost:8080/expenses/expense`;
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        setMessage("error");
        setMessage("Unable to add expenses, Please try after some time.");
      }

      const fetchedData = await response.json();
      setMessageType("success");
      setMessage(fetchedData.message);
    } catch (err) {
      setMessage("error");
      setMessage("Unable to add expenses, Please try after some time.");
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleExpenseChange = (event) => {
    setExpense(event.target.value);
  };

  useEffect(() => {
    getExpenses();
  });
  return (
    <div>
      <Heading />
      <p className={`message ${messageType}`}>{message}</p>
      <div className="expense-container">
        <form onSubmit={addExpenses}>
          <input
            type="date"
            name="date"
            placeholder="select date"
            value={date}
            onChange={handleDateChange}
          />
          <input
            type="number"
            name="expense"
            placeholder="Enter the amount"
            value={expense}
            onChange={handleExpenseChange}
          />
          <button type="submit">Add Amount</button>
        </form>
        <div className="expenses">
          <p>
            Today's Expenses: <span>{expenses.dailyExpenses}</span>
          </p>
          <p>
            Monthly Expenses: <span>{expenses.monthlyExpenses}</span>
          </p>
          <p>
            Avg Monthly Expenses: <span>{expenses.avgDailyExpenses}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
