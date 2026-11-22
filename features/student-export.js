/* Exportación de estudiantes a CSV (feature/student-export) */
"use strict";

function toCSV(students) {
  const header = ["id", "name", "email", "phone", "career", "grade", "status"];
  const escape = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = students.map(s => header.map(h => escape(s[h])).join(","));
  return [header.join(","), ...rows].join("\n");
}

function downloadCSV(students, filename = "estudiantes.csv") {
  const blob = new Blob(["\uFEFF" + toCSV(students)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

window.StudentExport = { toCSV, downloadCSV };
