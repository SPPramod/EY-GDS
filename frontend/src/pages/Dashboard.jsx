import { useEffect, useState } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../api/expenseApi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) return navigate("/");

    const fetchExpenses = async () => {
      const data = await getExpenses(userInfo.token);
      setExpenses(data);
    };

    fetchExpenses();
  }, [navigate]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount || !date) return alert("All fields are required!");
    
    const newExpense = { category, amount, date };
    const addedExpense = await createExpense(newExpense, userInfo.token);
    setExpenses([...expenses, addedExpense]);
    
    setCategory("");
    setAmount("");
    setDate("");
  };

  const handleUpdateExpense = async (id) => {
    if (!editingExpense) return;
    const updatedExpense = await updateExpense(id, editingExpense, userInfo.token);
    setExpenses(expenses.map((exp) => (exp._id === id ? updatedExpense : exp)));
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id, userInfo.token);
    setExpenses(expenses.filter((exp) => exp._id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense}>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Add Expense</button>
      </form>

      {/* Expense List */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {editingExpense && editingExpense._id === expense._id ? (
              <>
                <input type="text" value={editingExpense.category} onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })} />
                <input type="number" value={editingExpense.amount} onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })} />
                <input type="date" value={editingExpense.date} onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })} />
                <button onClick={() => handleUpdateExpense(expense._id)}>Save</button>
              </>
            ) : (
              <>
                {expense.category} - ${expense.amount} - {expense.date}
                <button onClick={() => setEditingExpense(expense)}>Edit</button>
                <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
