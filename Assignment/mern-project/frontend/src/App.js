import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    enrollment: "",
    email: ""
  });

  const [error, setError] = useState("");
  

  // Fetch data
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/items");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validation function
  const validate = () => {
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const enrollRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.name)) {
      return "Name should contain only letters";
    }

    if (!phoneRegex.test(form.phone)) {
      return "Phone must be exactly 10 digits";
    }

    if (!enrollRegex.test(form.enrollment)) {
      return "Enrollment must be numbers only";
    }

    if (!emailRegex.test(form.email)) {
      return "Invalid email format";
    }

    return "";
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    await axios.post("http://localhost:5000/api/items", form);
    setForm({ name: "", phone: "", enrollment: "", email: "" });
    setError("");
    fetchData();
  };

  return (
  <div className="container">
    <h2>Student Form</h2>

    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Phone (10 digit)"
        value={form.phone}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          if (value.length <= 10) {
            setForm({ ...form, phone: value });
          }
        }}
      />

      <input
        placeholder="Enrollment No"
        value={form.enrollment}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          setForm({ ...form, enrollment: value });
        }}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <button type="submit">Submit</button>
    </form>

    <div className="list">
      <h3>Data List</h3>

      {data.map((item) => (
        <div className="list-item" key={item._id}>
          {item.name} <br />
          📞 {item.phone} <br />
          🎓 {item.enrollment} <br />
          ✉ {item.email}
        </div>
      ))}
    </div>
  </div>
);
}

export default App;