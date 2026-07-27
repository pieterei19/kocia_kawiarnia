import { API_BASE } from "./config.js";

const TOKEN_KEY = "kocia_kawiarnia_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  const res = await fetch(API_BASE + "/api" + path, { ...options, headers });
  if (!res.ok) {
    let detail = "Wystąpił błąd.";
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch (e) {}
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function register(username, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
  return data;
}

export async function login(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
  return data;
}

export async function fetchState() {
  return request("/state", { method: "GET" });
}

export async function saveState(state) {
  return request("/state", { method: "PUT", body: JSON.stringify(state) });
}
