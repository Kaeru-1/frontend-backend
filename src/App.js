import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function StudentRegistry() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("1");
  const [students, setStudents] = useState([]);

  // Save data to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (name === "" || course === "") return alert("Please fill all fields");

    try {
      await addDoc(collection(db, "students"), {
        name,
        course,
        yearLevel: Number(yearLevel),
        createdAt: new Date(),
      });
      setName("");
      setCourse("");
      setYearLevel("1");
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  // Retrieve data from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentArr = [];
      querySnapshot.forEach((doc) => {
        studentArr.push({ ...doc.data(), id: doc.id });
      });
      setStudents(studentArr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5dc] p-8 font-sans text-[#4a4a4a]">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#6b5b4a]">Student Registry</h1>
          <p className="text-[#8b7e66]">Platform Technology Lab</p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSave} className="bg-[#faf9f6] p-8 rounded-xl shadow-sm border border-[#e5e4d7] mb-12">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-white border border-[#d6d3c1] rounded focus:ring-2 focus:ring-[#c2b280] outline-none"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2 bg-white border border-[#d6d3c1] rounded focus:ring-2 focus:ring-[#c2b280] outline-none"
                placeholder="e.g. BSIT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year Level</label>
              <select
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                className="w-full p-2 bg-white border border-[#d6d3c1] rounded focus:ring-2 focus:ring-[#c2b280] outline-none"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-[#c2b280] hover:bg-[#b0a172] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Save Record
            </button>
          </div>
        </form>

        {/* Display Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold border-bottom border-[#d6d3c1] pb-2">Saved Records</h2>
          {students.length === 0 ? (
            <p className="text-center italic text-[#a39a82]">No records found.</p>
          ) : (
            students.map((student) => (
              <div key={student.id} className="bg-white p-4 rounded-lg border-l-4 border-[#c2b280] shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#6b5b4a]">{student.name}</h3>
                  <p className="text-sm">{student.course} — Year {student.yearLevel}</p>
                </div>
                <span className="text-xs text-[#b5ad93]">Verified</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}