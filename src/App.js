import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Ensure your firebase.js is configured
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("1");
  const [students, setStudents] = useState([]);

  // 1. Save data to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !course) return alert("Please fill in all fields.");

    try {
      await addDoc(collection(db, "students"), {
        name: name,
        course: course,
        yearLevel: yearLevel,
        createdAt: new Date(),
      });
      // Clear inputs after saving
      setName("");
      setCourse("");
      setYearLevel("1");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // 2. Retrieve data in real-time
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(studentData);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Student Registry</h1>
        <p className="subtitle">Platform Technology Lab | Deploying React + Firebase</p>
      </header>

      {/* Input Section - Form */}
      <form className="input-section" onSubmit={handleSave}>
        <div className="field-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="e.g. Juan Dela Cruz"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Course</label>
          <input
            type="text"
            placeholder="e.g. BSIT"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Year Level</label>
          <select 
            value={yearLevel} 
            onChange={(e) => setYearLevel(e.target.value)}
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <button type="submit">Save Record</button>
      </form>

      {/* Display Section - Records */}
      <div className="records-container">
        <h2 style={{ textAlign: "left", color: "#6b5b4a", fontSize: "1.2rem" }}>
          Saved Records ({students.length})
        </h2>
        
        {students.length === 0 ? (
          <p style={{ color: "#a39a82", fontStyle: "italic" }}>No records found yet.</p>
        ) : (
          students.map((student) => (
            <div className="record-card" key={student.id}>
              <div className="record-info">
                <h3>{student.name}</h3>
                <p>{student.course} — Year {student.yearLevel}</p>
              </div>
              <div className="record-tag">Student</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;