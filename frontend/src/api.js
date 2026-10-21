const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export function getToken() {
  return localStorage.getItem('spendly_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('spendly_token', token);
  } else {
    localStorage.removeItem('spendly_token');
  }
}

export function getStoredUser() {
  const u = localStorage.getItem('spendly_user');
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('spendly_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('spendly_user');
  }
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || 'Registration failed');
  setToken(json.access_token);
  setStoredUser(json.user);
  return json;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || 'Login failed');
  setToken(json.access_token);
  setStoredUser(json.user);
  return json;
}

export async function fetchMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Session expired');
  const json = await res.json();
  return json;
}

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: getAuthHeaders()
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('Failed to load dashboard');
  const json = await res.json();
  return json.data;
}

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: getAuthHeaders()
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('Failed to load profile');
  const json = await res.json();
  return json.data;
}

export async function updateProfile(payload) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const json = await res.json();
  return json.data;
}

export async function creditSalary() {
  const res = await fetch(`${BASE_URL}/profile/credit-salary`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || 'Failed to credit salary');
  return json;
}

export async function fetchExpenses() {
  const res = await fetch(`${BASE_URL}/expenses`, {
    headers: getAuthHeaders()
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('Failed to load expenses');
  const json = await res.json();
  return json.data;
}

export async function addExpense(payload) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add expense');
  const json = await res.json();
  return json.data;
}

export async function updateExpense(id, payload) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update expense');
  const json = await res.json();
  return json.data;
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  const json = await res.json();
  return json;
}

export async function evaluateDecision(payload) {
  const res = await fetch(`${BASE_URL}/decisions/evaluate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to evaluate decision');
  const json = await res.json();
  return json.data;
}

export async function fetchDecisionHistory() {
  const res = await fetch(`${BASE_URL}/decisions/history`, {
    headers: getAuthHeaders()
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('Failed to load decision history');
  const json = await res.json();
  return json.data;
}
