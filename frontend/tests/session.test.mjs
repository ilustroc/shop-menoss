import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { clearSession, esAdministrador, logout, saveSession, session } from '../src/services/session.ts';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
};
let destino = '';
globalThis.window = { location: { assign: url => { destino = url; } } };

function token(exp) {
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `encabezado.${payload}.firma`;
}

function sesion(rol = 'CLIENTE', exp = Math.floor(Date.now() / 1000) + 60) {
  return { id: 1, nombre: 'Ana', correo: 'ana@test.com', rol, token: token(exp) };
}

beforeEach(() => { values.clear(); destino = ''; });

test('persiste una sesión JWT válida y reconoce el rol', () => {
  saveSession(sesion('ADMINISTRADOR'));
  assert.equal(session()?.nombre, 'Ana');
  assert.equal(esAdministrador(), true);
});

test('elimina automáticamente una sesión expirada o inválida', () => {
  saveSession(sesion('CLIENTE', Math.floor(Date.now() / 1000) - 1));
  assert.equal(session(), null);
  assert.equal(localStorage.getItem('menoss_session'), null);
  localStorage.setItem('menoss_session', '{token roto');
  assert.equal(session(), null);
  assert.equal(localStorage.getItem('menoss_session'), null);
});

test('cerrar sesión conserva el carrito local y redirige al login', () => {
  saveSession(sesion());
  localStorage.setItem('shop_menoss_cart', '[{"id":1}]');
  logout();
  assert.equal(localStorage.getItem('menoss_session'), null);
  assert.equal(localStorage.getItem('shop_menoss_cart'), '[{"id":1}]');
  assert.equal(destino, '/login');
  clearSession();
});
