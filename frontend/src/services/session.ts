export interface Session { id: number; nombre: string; correo: string; rol: string; token: string }
export function session(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem('menoss_session') || 'null');
    if (!s?.token || JSON.parse(atob(s.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 <= Date.now()) return null;
    return s;
  } catch { return null; }
}
export function saveSession(s: Session) { localStorage.setItem('menoss_session', JSON.stringify(s)); }
export function logout() { localStorage.removeItem('menoss_session'); window.location.assign('/login'); }
