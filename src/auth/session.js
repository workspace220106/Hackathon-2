// Minimal client-side session (demo auth). Replace `login()` with a real API call.
const KEY = 'session';

export function isLoggedIn() {
  try { return !!JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return false; }
}
export function currentUser() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export async function login({ email, password }) {
  if (!email || !password) throw new Error('Please enter your email and password.');
  if (password.length < 4) throw new Error('Password must be at least 4 characters.');
  const user = { email, name: email.split('@')[0], loggedInAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}
export function logout() {
  localStorage.removeItem(KEY);
}
