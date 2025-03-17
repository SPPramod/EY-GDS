import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

export const getExpenses = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(API_URL, config);
  return data;
};

export const createExpense = async (expense, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.post(API_URL, expense, config);
  return data;
};

export const updateExpense = async (id, updatedExpense, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.put(`${API_URL}/${id}`, updatedExpense, config);
  return data;
};

export const deleteExpense = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.delete(`${API_URL}/${id}`, config);
  return data;
};
