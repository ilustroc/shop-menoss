export interface Session { id: number; nombre: string; correo: string; rol: 'CLIENTE' | 'ADMINISTRADOR'; token: string }
const SESSION_KEY = 'menoss_session';

function tokenExpiraEn(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const exp = JSON.parse(atob(base64)).exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch { return null; }
}

export function clearSession() { localStorage.removeItem(SESSION_KEY); }
export function session(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    const expira = s?.token ? tokenExpiraEn(s.token) : null;
    if (!s?.id || !s?.nombre || !s?.correo || !['CLIENTE', 'ADMINISTRADOR'].includes(s?.rol) || !expira || expira <= Date.now()) {
      clearSession();
      return null;
    }
    return s;
  } catch { clearSession(); return null; }
}
export function saveSession(s: Session) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
export function esAdministrador(s: Session | null = session()) { return s?.rol === 'ADMINISTRADOR'; }
export function logout() { clearSession(); window.location.assign('/login'); }
