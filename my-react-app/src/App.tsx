// Student Management System Frontend

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Student {
  student_id: string;
  name: string;
  marks: number[];
  average?: number;
}

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ student_id: "", name: "" });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newMarks, setNewMarks] = useState<string>("");

  // Fetch students from the backend
  useEffect(() => {
    axios
      .get("/api/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  const handleAddStudent = () => {
    if (!newStudent.student_id || !newStudent.name) {
      alert("Please fill in all fields.");
      return;
    }
    axios
      .post("/api/students", newStudent)
      .then((response) => {
        setStudents([...students, response.data]);
        setNewStudent({ student_id: "", name: "" });
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const handleUpdateMarks = () => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }
    const marks = newMarks.split(",").map((mark) => parseInt(mark.trim(), 10));
    axios
      .put(`/api/students/${selectedStudent.student_id}/marks`, { marks })
      .then((response) => {
        setStudents(
          students.map((student) =>
            student.student_id === selectedStudent.student_id
              ? response.data
              : student
          )
        );
        setSelectedStudent(null);
        setNewMarks("");
      })
      .catch((error) => console.error("Error updating marks:", error));
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewMarks(student.marks.join(","));
  };

  const calculateClassAverage = () => {
    const totalMarks = students
      .flatMap((student) => student.marks)
      .reduce((sum, mark) => sum + mark, 0);
    const totalStudents = students.length;
    return totalStudents ? (totalMarks / totalStudents).toFixed(2) : "0.00";
  };

  const topStudent = students.reduce<Student | null>((top, student) => {
    // Calculate the average marks for the current student
    const avg =
      student.marks.reduce((sum, mark) => sum + mark, 0) /
      (student.marks.length || 1);

    // Compare with the current top student
    if (!top || avg > top.average!) {
      return { ...student, average: avg }; // Update top student
    }

    return top; // Keep the current top student
  }, null);

  return (
    <div className="App">
      <h1>Student Marks Management System</h1>

      {/* Add New Student */}
      <section>
        <h2>Add New Student</h2>
        <input
          type="text"
          placeholder="Student ID"
          value={newStudent.student_id}
          onChange={(e) =>
            setNewStudent({ ...newStudent, student_id: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Student Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </section>

      {/* Update Marks */}
      <section>
        <h2>Update Marks</h2>
        <select
          onChange={(e) =>
            handleSelectStudent(
              students.find((s) => s.student_id === e.target.value)!
            )
          }
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.student_id} value={student.student_id}>
              {student.name}
            </option>
          ))}
        </select>
        {selectedStudent && (
          <div>
            <input
              type="text"
              placeholder="Enter marks separated by commas"
              value={newMarks}
              onChange={(e) => setNewMarks(e.target.value)}
            />
            <button onClick={handleUpdateMarks}>Update Marks</button>
          </div>
        )}
      </section>

      {/* Students List */}
      <section>
        <h2>Students</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Marks</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.name}</td>
                <td>{student.marks.join(", ")}</td>
                <td>
                  {(
                    student.marks.reduce((sum, mark) => sum + mark, 0) /
                    (student.marks.length || 1)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Class Average and Top Student */}
      <section>
        <h2>Class Summary</h2>
        <p>Class Average: {calculateClassAverage()}</p>
        {topStudent && (
          <p>
            Top Student: {topStudent.name} (Average:{" "}
            {topStudent.average?.toFixed(2)})
          </p>
        )}
      </section>
    </div>
  );
};

export default App;
