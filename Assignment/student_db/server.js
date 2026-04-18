const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // your password
    database: "studentdb"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});


// ✅ 1. Add New Student
app.post("/students", (req, res) => {
    const { name, email, course, age } = req.body;

    const sql = "INSERT INTO students (name, email, course, age) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, email, course, age], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Student added successfully",
            id: result.insertId
        });
    });
});


// ✅ 2. Get All Students
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
});


// ✅ 3. Update Student by ID
app.put("/students/:id", (req, res) => {
    const id = req.params.id;
    const { name, email, course, age } = req.body;

    const sql = `
        UPDATE students 
        SET name=?, email=?, course=?, age=? 
        WHERE id=?
    `;

    db.query(sql, [name, email, course, age, id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Student updated successfully"
        });
    });
});


// ✅ 4. Delete Student by ID
app.delete("/students/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Student deleted successfully"
        });
    });
});


// Server Start
app.listen(5000, () => {
    console.log("Server running on port 5000");
});