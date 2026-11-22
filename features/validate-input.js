/* Validación de entrada de usuario (feature/validate-user-input) */
"use strict";

const RULES = {
  name: { required: true, min: 3, max: 80, pattern: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'.-]+$/ },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: false, pattern: /^[0-9+\-\s()]{7,20}$/ },
  grade: { required: true, min: 0, max: 100 }
};

function validateField(field, value) {
  const rule = RULES[field];
  if (!rule) return { ok: true };

  const text = String(value ?? "").trim();
  if (rule.required && !text) return { ok: false, message: `${field} es obligatorio` };
  if (!text) return { ok: true };

  if (rule.pattern && !rule.pattern.test(text)) {
    return { ok: false, message: `${field} tiene un formato inválido` };
  }
  if (rule.min !== undefined && text.length < rule.min) {
    return { ok: false, message: `${field} debe tener al menos ${rule.min} caracteres` };
  }
  if (rule.max !== undefined && text.length > rule.max) {
    return { ok: false, message: `${field} no puede superar ${rule.max} caracteres` };
  }
  if (rule.min !== undefined && typeof value === "number") {
    if (value < rule.min || value > rule.max) {
      return { ok: false, message: `${field} debe estar entre ${rule.min} y ${rule.max}` };
    }
  }
  return { ok: true };
}

function validateStudent(data) {
  const errors = {};
  for (const field of Object.keys(RULES)) {
    const result = validateField(field, data[field]);
    if (!result.ok) errors[field] = result.message;
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

window.Validator = { validateField, validateStudent };
