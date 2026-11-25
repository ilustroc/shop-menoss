# Shop Menoss: integración funcional

Rama: `codex/tienda-funcional`, creada desde `origin/main`, conservando el checkout y los archivos locales de Docker/SSL.

## Cambios

- Registro y login reales, sesión JWT, usuario visible, cierre de sesión y navegación por rol. Basic administrativo existente sigue disponible.
- Productos y categorías por HTTP; mapeo `imagenUrl`, `categoriaId` y `categoriaNombre`. Productos desactivados se conservan y pueden reactivarse en edición.
- Catálogo público, búsqueda, filtros y carrito con límite de stock. Checkout vuelve a consultar precios/stock y bloquea envíos por múltiples clics.
- Precios finales con IGV incluido, sin recargar 18%; un envío de S/10. Backend calcula los importes definitivos. No se solicitan números de tarjeta ni CVV; todos los pagos son simulados.
- Nuevos pedidos asociados al usuario autenticado. Otro cliente recibe 404 al intentar consultar un pedido ajeno. Administración conserva acceso al historial completo.
- Dashboard, detalles, estados e inventario con datos del backend. Cancelaciones bloquean la fila del pedido para evitar restituciones simultáneas del stock.
- Se retiraron los productos ficticios y el respaldo de pedidos en localStorage. Sólo carrito y sesión usan almacenamiento local.

## Rutas utilizadas (ya existentes)

| Acceso | Métodos y rutas |
| --- | --- |
| Público | `GET /api/health`, `POST /api/auth/registro`, `POST /api/auth/login` |
| Público | `GET /api/productos`, `GET /api/productos/{id}`, `GET /api/categorias` |
| Autenticado, pedidos propios | `GET/POST /api/pedidos`, `GET /api/pedidos/{id}` |
| ADMINISTRADOR | `POST /api/productos`, `PUT/DELETE /api/productos/{id}`, `PUT /api/productos/{id}/stock` |
| ADMINISTRADOR | `POST /api/categorias`, `PUT/DELETE /api/categorias/{id}` |
| ADMINISTRADOR | `GET /api/inventario`, `GET /api/inventario/bajo-stock` |
| ADMINISTRADOR | `GET /api/admin/pedidos`, `GET /api/admin/pedidos/{id}`, `PUT /api/admin/pedidos/{id}/estado` |

No se agregaron rutas ni cuentas administrativas. Las transiciones existentes son PENDIENTE → CONFIRMADO → PREPARANDO → ENTREGADO; se puede cancelar antes de entregar.

## Base de datos

Migración aditiva: `backend/migrations/20261120_pedido_usuario.sql`. Agrega `pedidos.usuario_id` nullable, referencia a `usuarios.id_usuario` e índice. No actualiza, elimina ni reasigna pedidos históricos; éstos conservan usuario NULL y sólo los consulta administración.

**No aplicada al VPS durante esta tarea por falta de conexión a 5432.** Aplicar el SQL con la conexión SSL existente antes del arranque actualizado. Se conserva `ddl-auto=update` del proyecto: también puede agregar columna/índice al arrancar cuando la conexión vuelva; no reemplaza la revisión de la migración. No se cambiaron credenciales, certificados, dirección remota, `.env` ni los archivos Compose existentes.

## Verificación

- `backend`: `mvnw.cmd clean verify` con Java 21 y H2: 40 pruebas, 0 fallos, 0 errores. Incluye JWT, BCrypt/login, 401/403, propietario, precios/envío, stock, productos/categorías persistidos, desactivación, estados e históricos.
- `frontend`: `npm ci`, `npm run lint`, `npm test`, `npm run build`. Tres pruebas automáticas de importes/carrito, sin fallos.
- Imágenes backend/frontend compiladas y contenedores locales existentes actualizados con el mismo Compose. Ningún entorno Docker adicional.
- Postman CLI cargó la colección v2.1 y ejecutó health: 3 aserciones fallaron por HTTP 502. No se ejecutaron escrituras contra el VPS.
- Diagnóstico de conectividad: servidor accesible por SSH (22), pero timeout TCP a 5432 desde Windows y sin respuesta con `pg_isready` desde Docker. Backend registra `SocketTimeoutException: Connect timed out` y reinicia; Nginx devuelve 502 como consecuencia.
- Navegador: portada y navegación cargan; el catálogo muestra el fallo real de conexión y ofrece Reintentar. No se enviaron formularios ni pedidos.
- Pendiente: recuperar acceso a PostgreSQL, aplicar/verificar migración y ejecutar demostración real cliente/administrador con cuentas autorizadas. No se declara verificada la compra real en DigitalOcean ni el recorrido completo en navegador.

## Ejecutar

Una vez restablecido PostgreSQL y revisada la migración, desde PowerShell:

```powershell
cd C:\GitHub\shop-menoss-docker
docker compose -f compose.yaml -f compose.remote.yaml config --quiet
docker compose -f compose.yaml -f compose.remote.yaml up -d --build --no-deps backend frontend
docker compose -f compose.yaml -f compose.remote.yaml ps
curl.exe -i http://localhost:18088/api/health
```

Usar el `.env` y certificados existentes, incluido `JWT_SECRET`. No ejecutar `down -v`. El contenedor PostgreSQL local preexistente no se usa como reemplazo de DigitalOcean.

Pruebas reproducibles (JAVA_HOME debe apuntar al JDK 21 instalado; Node 22.18+):

```powershell
cd C:\GitHub\shop-menoss-docker\backend
.\mvnw.cmd clean verify
cd ..\frontend
npm ci
npm run lint
npm test
npm run build
```

## Demostración controlada

1. Confirmar `/api/health` HTTP 200. Abrir `http://localhost:18088`.
2. Registrar un cliente para la exposición y entrar. Esta acción crea un registro permanente.
3. Buscar un producto activo real con stock, agregarlo al carrito y ajustar cantidad.
4. Confirmar el pedido simulado una sola vez. Se guarda permanentemente y descuenta stock. Anotar el ID y recargar su detalle.
5. Cerrar sesión y entrar con una cuenta ADMINISTRADOR existente. Revisar dashboard y buscar el ID del pedido.
6. Abrir detalle y cambiar a CONFIRMADO; recargar para comprobar persistencia.
7. Usar un producto autorizado para cambiar stock desde Inventario y recargar. No restaurar un valor anterior si hubo compras concurrentes.
8. Volver a entrar como cliente y comprobar el estado actualizado y su historial exclusivo.
9. Para Postman: seguir `postman/README.md`; la carpeta 04 crea un producto sólo cuando se habilita expresamente `enableProfessorDemo`.

## Archivos principales

- Backend: `SecurityConfig`, `JwtAuthFilter`, `GlobalExceptionHandler`, `AuthService`, `CrearPedidoRequest`, `Pedido`, `PedidoRepository`, `PedidoService`, `AdminPedidoService`; migración y pruebas H2.
- Frontend: `Header`, `ProductoForm`, páginas Login/Register/Productos/Carrito/Checkout/Pedidos/PedidoDetalle y administración; `AdminRoute`; servicios `api`, `session`, `totales`, productos/categorías/carrito/pedidos; tipos y proxy de Vite.
- Colección y README de Postman; `frontend/tests/compra.test.mjs`, script `npm test` y este informe.

Los commits locales separan backend, frontend y documentación/Postman. No se realizó push, merge ni despliegue al servidor.
