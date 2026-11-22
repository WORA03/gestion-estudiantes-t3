/* Gestión de Estudiantes - CRUD con almacenamiento local */
"use strict";

const STORAGE_KEY = "gestion-estudiantes-v1";
const elements = {
  table: document.getElementById("studentsTableBody"),
  empty: document.getElementById("emptyState"),
  dialog: document.getElementById("studentDialog"),
  form: document.getElementById("studentForm"),
  title: document.getElementById("dialogTitle"),
  error: document.getElementById("formError"),
  search: document.getElementById("searchInput"),
  filter: document.getElementById("statusFilter"),
  toast: document.getElementById("toast")
};

let students = loadStudents();
let toastTimer;

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("No fue posible leer los estudiantes:", error);
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function renderStudents() {
  const term = elements.search.value.trim().toLowerCase();
  const status = elements.filter.value;
  const filtered = students.filter(student => {
    const matchesTerm = [student.name, student.studentCode, student.email, student.career]
      .some(value => String(value || "").toLowerCase().includes(term));
    return matchesTerm && (status === "all" || student.status === status);
  });

  elements.table.innerHTML = filtered.map(student => `
    <tr>
      <td><div class="student-name">${escapeHTML(student.name)}</div><div class="student-email">${escapeHTML(student.phone || "Sin teléfono")}</div></td>
      <td>${escapeHTML(student.studentCode)}</td>
      <td>${escapeHTML(student.career)}</td>
      <td>${escapeHTML(student.email)}</td>
      <td><span class="status-pill ${student.status === "Inactivo" ? "inactive" : ""}">${escapeHTML(student.status)}</span></td>
      <td><div class="action-buttons">
        <button class="action-btn" data-action="edit" data-id="${escapeHTML(student.id)}" type="button">Editar</button>
        <button class="action-btn delete" data-action="delete" data-id="${escapeHTML(student.id)}" type="button">Eliminar</button>
      </div></td>
    </tr>`).join("");

  elements.empty.classList.toggle("visible", filtered.length === 0);
  document.querySelector(".table-wrap table").style.display = filtered.length ? "table" : "none";
  document.getElementById("resultsCount").textContent = `Mostrando ${filtered.length} de ${students.length} estudiantes`;
  document.getElementById("totalCount").textContent = students.length;
  document.getElementById("activeCount").textContent = students.filter(s => s.status === "Activo").length;
  document.getElementById("careerCount").textContent = new Set(students.map(s => s.career.trim().toLowerCase()).filter(Boolean)).size;
}

function openForm(student = null) {
  elements.form.reset();
  elements.error.textContent = "";
  document.getElementById("studentId").value = student?.id || "";
  elements.title.textContent = student ? "Editar estudiante" : "Nuevo estudiante";
  document.getElementById("saveBtn").textContent = student ? "Guardar cambios" : "Guardar estudiante";
  if (student) {
    for (const field of ["name", "studentCode", "email", "phone", "career", "enrollmentDate", "status"]) {
      document.getElementById(field).value = student[field] || (field === "status" ? "Activo" : "");
    }
  }
  elements.dialog.showModal();
  document.getElementById("name").focus();
}

function closeForm() {
  elements.dialog.close();
  elements.form.reset();
  elements.error.textContent = "";
}

function handleSave(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(elements.form).entries());
  const id = document.getElementById("studentId").value;
  data.name = data.name.trim();
  data.studentCode = data.studentCode.trim();
  data.email = data.email.trim().toLowerCase();
  data.career = data.career.trim();

  if (!data.name || !data.studentCode || !data.email || !data.career) {
    elements.error.textContent = "Completa todos los campos obligatorios.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    elements.error.textContent = "Introduce un correo electrónico válido.";
    return;
  }
  const duplicate = students.some(s => s.studentCode.toLowerCase() === data.studentCode.toLowerCase() && s.id !== id);
  if (duplicate) {
    elements.error.textContent = "Ya existe un estudiante con esa matrícula.";
    return;
  }

  if (id) {
    students = students.map(s => s.id === id ? { ...s, ...data, id } : s);
    showToast("Estudiante actualizado correctamente.");
  } else {
    students.push({ ...data, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) });
    showToast("Estudiante registrado correctamente.");
  }
  saveStudents();
  renderStudents();
  closeForm();
}

function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  if (!confirm(`¿Seguro que deseas eliminar a ${student.name}? Esta acción no se puede deshacer.`)) return;
  students = students.filter(s => s.id !== id);
  saveStudents();
  renderStudents();
  showToast("Estudiante eliminado correctamente.");
}

elements.table.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const student = students.find(s => s.id === button.dataset.id);
  if (button.dataset.action === "edit" && student) openForm(student);
  if (button.dataset.action === "delete") deleteStudent(button.dataset.id);
});

document.getElementById("newStudentBtn").addEventListener("click", () => openForm());
document.getElementById("emptyAddBtn").addEventListener("click", () => openForm());
document.getElementById("closeDialogBtn").addEventListener("click", closeForm);
document.getElementById("cancelBtn").addEventListener("click", closeForm);
elements.form.addEventListener("submit", handleSave);
elements.search.addEventListener("input", renderStudents);
elements.filter.addEventListener("change", renderStudents);
elements.dialog.addEventListener("click", event => {
  if (event.target === elements.dialog) closeForm();
});

renderStudents();
