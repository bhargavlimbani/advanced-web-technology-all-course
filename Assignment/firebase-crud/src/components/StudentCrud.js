import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const StudentCrud = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [age, setAge] = useState("");

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  const studentCollection = collection(db, "students");

  // READ
  const getStudents = async () => {
    const data = await getDocs(studentCollection);
    setStudents(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getStudents();
  }, []);

  // CREATE
  const addStudent = async () => {
    if (!name || !email || !course || !enrollment || !age) {
      return alert("Enter all fields");
    }

    await addDoc(studentCollection, {
      name,
      email,
      course,
      enrollment,
      age
    });

    resetForm();
    getStudents();
  };

  // DELETE
  const deleteStudent = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    getStudents();
  };

  // UPDATE
  const updateStudent = async () => {
    const studentDoc = doc(db, "students", editId);

    await updateDoc(studentDoc, {
      name,
      email,
      course,
      enrollment,
      age
    });

    resetForm();
    getStudents();
  };

  // EDIT
  const editStudent = (student) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setEnrollment(student.enrollment);
    setAge(student.age);
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setCourse("");
    setEnrollment("");
    setAge("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Student Management</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          style={styles.input}
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="ICT">ICT</option>
          <option value="IT">IT</option>
          <option value="CE">CE</option>
        </select>

        <input
          style={styles.input}
          placeholder="Enrollment No"
          value={enrollment}
          onChange={(e) => setEnrollment(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {editId ? (
          <button style={styles.updateBtn} onClick={updateStudent}>
            Update
          </button>
        ) : (
          <button style={styles.addBtn} onClick={addStudent}>
            Add Student
          </button>
        )}
      </div>

      <h3>Student List</h3>

      {students.map((student) => (
        <div key={student.id} style={styles.card}>
          <div>
            <b>{student.name}</b><br />
            {student.email}<br />
            {student.course} | {student.enrollment} | Age: {student.age}
          </div>

          <div>
            <button
              style={styles.editBtn}
              onClick={() => editStudent(student)}
            >
              Edit
            </button>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteStudent(student.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// 🎨 CSS STYLES
const styles = {
  container: {
    width: "400px",
    margin: "30px auto",
    textAlign: "center",
    fontFamily: "Arial"
  },
  title: {
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  addBtn: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  updateBtn: {
    padding: "10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px"
  },
  editBtn: {
    marginRight: "5px",
    backgroundColor: "#ffc107",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    border: "none",
    padding: "5px 10px",
    color: "white",
    cursor: "pointer"
  }
};

export default StudentCrud;