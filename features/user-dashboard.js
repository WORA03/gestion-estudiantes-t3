/* Panel de estadísticas para el dashboard (feature/user-dashboard) */
"use strict";

function computeStats(students) {
  const total = students.length;
  const active = students.filter(s => s.status === "activo").length;
  const inactive = students.filter(s => s.status === "inactivo").length;
  const avgGrade = total
    ? students.reduce((sum, s) => sum + (Number(s.grade) || 0), 0) / total
    : 0;
  return {
    total,
    active,
    inactive,
    avgGrade: Math.round(avgGrade * 10) / 10,
    byCareer: countBy(students, "career")
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Sin especificar";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function renderDashboard(container, students) {
  const stats = computeStats(students);
  container.innerHTML = `
    <div class="stat-card"><span>Total</span><strong>${stats.total}</strong></div>
    <div class="stat-card"><span>Activos</span><strong>${stats.active}</strong></div>
    <div class="stat-card"><span>Inactivos</span><strong>${stats.inactive}</strong></div>
    <div class="stat-card"><span>Promedio</span><strong>${stats.avgGrade}</strong></div>`;
  return stats;
}

window.Dashboard = { computeStats, renderDashboard };
