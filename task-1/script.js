let students = [
  { id: 1, name: "Aarav Sharma", rollNo: 101, course: "BCA", math: 85, science: 78, english: 92 },
  { id: 2, name: "Priya Singh", rollNo: 102, course: "B.Sc", math: 75, science: 69, english: 80 },
  { id: 3, name: "Rohan Kumar", rollNo: 103, course: "B.Com", math: 45, science: 52, english: 48 },
  { id: 4, name: "Sneha Patel", rollNo: 104, course: "BCA", math: 92, science: 88, english: 85 },
  { id: 5, name: "Vikram Mehta", rollNo: 105, course: "B.Sc", math: 61, science: 57, english: 65 },
  { id: 6, name: "Ananya Gupta", rollNo: 106, course: "B.Com", math: 38, science: 42, english: 30 },
  { id: 7, name: "Karan Verma", rollNo: 107, course: "BCA", math: 79, science: 81, english: 76 },
  { id: 8, name: "Meera Iyer", rollNo: 108, course: "B.Sc", math: 68, science: 72, english: 70 }
];

document.addEventListener("DOMContentLoaded", function () {
  let savedData = localStorage.getItem("srms_students");
  if (savedData) {
    students = JSON.parse(savedData);
  } else {
    saveToLocalStorage();
  }
  renderTable(students);
});

function saveToLocalStorage() {
  localStorage.setItem("srms_students", JSON.stringify(students));
}

function calculateStudentMetrics(math, science, english) {
  let total = math + science + english;
  let percentage = (total / 3).toFixed(1);
  let isPass = math >= 35 && science >= 35 && english >= 35;
  let status = isPass ? "Pass" : "Fail";
  
  let grade = "F";
  if (!isPass) {
    grade = "F";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  } else if (percentage >= 35) {
    grade = "E";
  }

  return { total, percentage, grade, status };
}

function renderTable(dataList) {
  let tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  dataList.forEach((student) => {
    let m = calculateStudentMetrics(student.math, student.science, student.english);
    let originalIndex = students.findIndex(s => s.id === student.id);

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.rollNo}</td>
      <td><strong>${student.name}</strong></td>
      <td>${student.course}</td>
      <td>${student.math}</td>
      <td>${student.science}</td>
      <td>${student.english}</td>
      <td><strong>${m.total}</strong></td>
      <td>${m.percentage}%</td>
      <td><span class="grade-box grade-${m.grade}">${m.grade}</span></td>
      <td><span class="badge ${m.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${m.status}</span></td>
      <td>
        <button class="action-btn" onclick="editStudent(${originalIndex})">✏️</button>
        <button class="action-btn" onclick="deleteStudent(${originalIndex})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSummaryCards();
  updateChart();
}

function updateSummaryCards() {
  let totalCount = students.length;
  let passedCount = 0;
  let failedCount = 0;
  let totalPercentageSum = 0;

  students.forEach(s => {
    let m = calculateStudentMetrics(s.math, s.science, s.english);
    if (m.status === "Pass") {
      passedCount++;
    } else {
      failedCount++;
    }
    totalPercentageSum += parseFloat(m.percentage);
  });

  let avgPercent = totalCount > 0 ? (totalPercentageSum / totalCount).toFixed(1) : 0;

  document.getElementById("totalStudentsCount").innerText = totalCount;
  document.getElementById("passedCount").innerText = passedCount;
  document.getElementById("failedCount").innerText = failedCount;
  document.getElementById("avgPercentage").innerText = avgPercent + "%";
}

function updateChart() {
  if (students.length === 0) return;

  let totalMath = 0, totalSci = 0, totalEng = 0;
  students.forEach(s => {
    totalMath += s.math;
    totalSci += s.science;
    totalEng += s.english;
  });

  let avgMath = totalMath / students.length;
  let avgSci = totalSci / students.length;
  let avgEng = totalEng / students.length;
  let overallAvg = (avgMath + avgSci + avgEng) / 3;

  document.getElementById("barMath").style.height = avgMath + "%";
  document.getElementById("barSci").style.height = avgSci + "%";
  document.getElementById("barEng").style.height = avgEng + "%";
  document.getElementById("barAvg").style.height = overallAvg + "%";
}

function handleFormSubmit(event) {
  event.preventDefault();

  let index = document.getElementById("editIndex").value;
  let name = document.getElementById("studentName").value.trim();
  let rollNo = parseInt(document.getElementById("rollNo").value);
  let course = document.getElementById("courseName").value;
  let math = parseInt(document.getElementById("mathMarks").value);
  let science = parseInt(document.getElementById("scienceMarks").value);
  let english = parseInt(document.getElementById("englishMarks").value);

  if (index === "-1") {
    let newStudent = {
      id: Date.now(),
      name: name,
      rollNo: rollNo,
      course: course,
      math: math,
      science: science,
      english: english
    };
    students.push(newStudent);
  } else {
    students[index].name = name;
    students[index].rollNo = rollNo;
    students[index].course = course;
    students[index].math = math;
    students[index].science = science;
    students[index].english = english;
  }

  saveToLocalStorage();
  filterData();
  resetForm();
}

function editStudent(index) {
  let student = students[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("studentName").value = student.name;
  document.getElementById("rollNo").value = student.rollNo;
  document.getElementById("courseName").value = student.course;
  document.getElementById("mathMarks").value = student.math;
  document.getElementById("scienceMarks").value = student.science;
  document.getElementById("englishMarks").value = student.english;

  document.getElementById("formTitle").innerText = "Edit Student Result";
  document.getElementById("saveBtn").innerText = "Update Result";
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    students.splice(index, 1);
    saveToLocalStorage();
    filterData();
  }
}

function resetForm() {
  document.getElementById("studentForm").reset();
  document.getElementById("editIndex").value = "-1";
  document.getElementById("formTitle").innerText = "Add / Edit Result";
  document.getElementById("saveBtn").innerText = "Save Result";
}

function filterData() {
  let searchValue = document.getElementById("globalSearch").value.toLowerCase();
  let selectedCourse = document.getElementById("courseFilter").value;
  let sortValue = document.getElementById("sortFilter").value;

  let filtered = students.filter(student => {
    let matchesSearch = student.name.toLowerCase().includes(searchValue) || student.rollNo.toString().includes(searchValue);
    let matchesCourse = selectedCourse === "All" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (sortValue === "high") {
    filtered.sort((a, b) => {
      let percentA = (a.math + a.science + a.english) / 3;
      let percentB = (b.math + b.science + b.english) / 3;
      return percentB - percentA;
    });
  } else if (sortValue === "low") {
    filtered.sort((a, b) => {
      let percentA = (a.math + a.science + a.english) / 3;
      let percentB = (b.math + b.science + b.english) / 3;
      return percentA - percentB;
    });
  }

  renderTable(filtered);
}

