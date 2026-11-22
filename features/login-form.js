/* Módulo de autenticación simple (feature/login-form) */
"use strict";

const USERS_KEY = "gestion-estudiantes-users";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function login(username, password) {
  const user = getUsers().find(u => u.username === username);
  if (!user || user.password !== password) {
    return { ok: false, message: "Credenciales inválidas" };
  }
  sessionStorage.setItem("currentUser", JSON.stringify({ username: user.username, role: user.role }));
  return { ok: true, user: { username: user.username, role: user.role } };
}

function logout() {
  sessionStorage.removeItem("currentUser");
}

function currentUser() {
  try {
    return JSON.parse(sessionStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

window.Auth = { login, logout, currentUser, getUsers, saveUsers };
