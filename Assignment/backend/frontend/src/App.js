import React, { useEffect, useState } from "react";
import { getItems, addItem } from "./api";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch data
  const fetchData = async () => {
    const res = await getItems();
    setItems(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(form);
    fetchData();
    setForm({ name: "", email: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Data Manager</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />
        <button type="submit">Add</button>
      </form>

      <h3>Data List</h3>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;