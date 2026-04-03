import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: ""
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH
  const searchStudents = async () => {
    if (search.trim() === "") {
      fetchStudents();
    } else {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/students/search?name=${search}`
      );
      setStudents(res.data);
      setLoading(false);
    }
  };

  // 📥 FETCH
  const fetchStudents = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:8080/students");
    setStudents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✏️ FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✏️ EDIT
  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course
    });
    setEditId(student.id);
  };

  // 💾 SAVE (ADD + UPDATE)
  const saveStudent = async () => {
    if (editId) {
      await axios.put(`http://localhost:8080/students/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:8080/students", form);
    }

    setForm({ name: "", email: "", course: "" });
    fetchStudents();
  };

  // ❌ DELETE
  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await axios.delete(`http://localhost:8080/students/${id}`);
      fetchStudents();
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Student Management Dashboard
      </h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={searchStudents}>Search</button>

      <button
        onClick={() => {
          setSearch("");
          fetchStudents();
        }}
      >
        Reset
      </button>

      {/* 📝 FORM */}
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="course"
        placeholder="Course"
        value={form.course}
        onChange={handleChange}
      />

      <button onClick={saveStudent}>
        {editId ? "Update" : "Add"}
      </button>

      <hr />

      {/* 🔄 LOADING + EMPTY + LIST */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-500">No students found</p>
      ) : (
        students.map((s) => (
          <div className="student" key={s.id}>
            <b>{s.name}</b> | {s.email} | {s.course}

            <button onClick={() => editStudent(s)}>Edit</button>
            <button onClick={() => deleteStudent(s.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;