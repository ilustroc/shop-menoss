# Colección Postman — Shop Menoss

Esta carpeta contiene la colección completa de endpoints y el entorno local para demostrar y validar la API REST de **Shop Menoss** (Spring Boot 4 + PostgreSQL 17 + JWT).

## Archivos incluidos

1. `Shop-Menoss-API-Completa.postman_collection.json` — Colección Postman v2.1 completa e importable con las 9 carpetas requeridas, pruebas automáticas y captura automática de JWT e identificadores.
2. `Shop-Menoss-Local.postman_environment.json` — Entorno local configurable (`baseUrl = http://localhost:18088/api`) sin secretos reales ni contraseñas almacenadas.
3. `Shop-Menoss.postman_collection.json` — Colección auxiliar con banderas de protección para ejecuciones por lotes en CLI.

## 1. Cómo importar en Postman

1. Abre **Postman**.
2. Haz clic en **Import** (esquina superior izquierda).
3. Selecciona los archivos:
   - `postman/Shop-Menoss-API-Completa.postman_collection.json`
   - `postman/Shop-Menoss-Local.postman_environment.json`
4. En el selector de entornos (esquina superior derecha), elige **Shop Menoss - Local**.

## 2. Configuración de variables y credenciales

En el entorno **Shop Menoss - Local**, configura únicamente tus valores locales (en la columna *Current Value*, que Postman no exporta ni sincroniza):

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `baseUrl` | `http://localhost:18088/api` | URL base del API a través del proxy Nginx en Docker (o `http://localhost:8080/api` si ejecutas Spring Boot directo). |
| `jwtToken` | *(vacío)* | Se llena automáticamente al ejecutar **POST Login y captura de JWT** o **POST Login Administrador**. |
| `productoId` | `1` | ID del producto activo (se actualiza automáticamente al listar o crear productos). |
| `categoriaId` | `1` | ID de la categoría (se actualiza automáticamente al listar o crear categorías). |
| `pedidoId` | `1` | ID del pedido (se actualiza automáticamente al crear o listar pedidos). |
| `correoPrueba` | `cliente.demo@shopmenoss.pe` | Correo del cliente para demostrar registro, login y compra. |
| `passwordPrueba` | *(configurar localmente)* | Contraseña de prueba que cumpla la política: mín. 8 caracteres, mayúscula, minúscula, número y símbolo (ej. una clave de prueba local). |
| `correoAdmin` | *(configurar localmente)* | Correo de una cuenta existente con rol `ADMINISTRADOR`. |
| `passwordAdmin` | *(configurar localmente)* | Contraseña de la cuenta `ADMINISTRADOR`. |

> **Nota de seguridad:** Ningún archivo JSON del repositorio contiene contraseñas reales, tokens JWT, claves de PostgreSQL ni credenciales administrativas.

## 3. Estructura de la colección (`Shop-Menoss-API-Completa.postman_collection.json`)

La colección está organizada en 9 carpetas alineadas con los controladores reales de Spring Boot:

1. **1. Health** (`HealthController`): `GET /api/health` (solo lectura).
2. **2. Autenticación (registro y login)** (`AuthController`):
   - `POST /api/auth/registro` (escritura controlada / creación de cliente).
   - `POST /api/auth/login` (captura automática de `jwtToken` para cliente o administrador).
   - Casos de validación `400 Bad Request` y credenciales inválidas `401 Unauthorized` (solo lectura).
3. **3. Productos** (`ProductoController` - público):
   - `GET /api/productos?incluirInactivos=false` (captura `productoId` y `categoriaId` reales).
   - `GET /api/productos?categoriaId={{categoriaId}}&q=`
   - `GET /api/productos/{{productoId}}` y caso `404 Not Found` (solo lectura).
4. **4. Categorías** (`CategoriaController`):
   - `GET /api/categorias` (público, solo lectura).
   - `POST /api/categorias`, `PUT /api/categorias/{{categoriaId}}`, `DELETE /api/categorias/{{categoriaId}}` (protegidos con `ADMINISTRADOR`).
5. **5. Inventario** (`InventarioController`):
   - `GET /api/inventario` y `GET /api/inventario/bajo-stock` (protegidos con `ADMINISTRADOR`).
   - Prueba de seguridad sin token (`401 Unauthorized`).
6. **6. Carrito y compras (solo endpoints reales)** (`ProductoController` + `PedidoController`):
   - `GET /api/productos/{{productoId}}` (verificación previa de stock y precio unitario real).
   - `POST /api/pedidos` (creación de pedido con pago simulado, envío fijo de `S/ 10.00`, precios con IGV incluido y captura automática de `pedidoId`).
   - Validaciones de stock insuficiente (`409 Conflict`) y datos inválidos (`400 Bad Request`).
7. **7. Pedidos del cliente** (`PedidoController`):
   - `GET /api/pedidos` y `GET /api/pedidos/{{pedidoId}}` (solo devuelve pedidos del usuario autenticado en el JWT).
   - Prueba sin token (`401 Unauthorized`).
8. **8. Administración de pedidos** (`AdminPedidoController`):
   - `GET /api/admin/pedidos`, `GET /api/admin/pedidos?estado=PENDIENTE`, `GET /api/admin/pedidos/{{pedidoId}}`.
   - `PUT /api/admin/pedidos/{{pedidoId}}/estado` (transición controlada a `CONFIRMADO`).
   - Validación de estado inválido (`400 Bad Request`) y prueba de permisos (`403 Forbidden` con token de `CLIENTE`).
9. **9. Administración de productos e inventario** (`ProductoController` + `InventarioController`):
   - `GET /api/productos?incluirInactivos=true`
   - `POST /api/productos`, `PUT /api/productos/{{productoId}}`, `PUT /api/productos/{{productoId}}/stock`, `DELETE /api/productos/{{productoId}}` (desactivación lógica).

## 4. Orden recomendado para la demostración en vivo

Para demostrar el flujo completo de principio a fin en Postman sin afectar registros existentes:

1. **Verificar salud del servidor:** Ejecutar `1. Health -> GET Health Check` (esperado: `200 OK`).
2. **Registrar e iniciar sesión como cliente:**
   - Configurar `correoPrueba` y `passwordPrueba` en el entorno local.
   - Ejecutar `2. Autenticación -> POST Registro de cliente` (`201 Created`).
   - Ejecutar `2. Autenticación -> POST Login y captura de JWT` (`200 OK`, guarda `jwtToken`).
3. **Consultar catálogo real:**
   - Ejecutar `3. Productos -> GET Listar productos activos` (`200 OK`, selecciona un producto real con stock y guarda `productoId`).
   - Ejecutar `3. Productos -> GET Obtener producto por ID` (`200 OK`).
4. **Verificar permisos de cliente (403):**
   - Con el token de cliente activo, ejecutar `8. Administración de pedidos -> GET Acceso a /admin/pedidos con rol CLIENTE - 403` (`403 Forbidden`).
5. **Crear y consultar un pedido del cliente:**
   - Ejecutar `6. Carrito y compras -> POST Crear pedido con pago simulado` (`201 Created`, guarda el nuevo `pedidoId` y descuenta 1 unidad de stock).
   - Ejecutar `7. Pedidos del cliente -> GET Listar mis pedidos` y `GET Consultar detalle de mi pedido por ID` (`200 OK`, estado `PENDIENTE`).
6. **Gestionar pedido e inventario como administrador:**
   - Configurar `correoAdmin` y `passwordAdmin` y ejecutar `2. Autenticación -> POST Login Administrador` (`200 OK`, actualiza `jwtToken` con rol `ADMINISTRADOR`).
   - Ejecutar `8. Administración de pedidos -> GET Consultar detalle de pedido (Admin)` (`200 OK`).
   - Ejecutar `8. Administración de pedidos -> PUT Actualizar estado de pedido a CONFIRMADO` (`200 OK`).
   - Ejecutar `5. Inventario -> GET Listar inventario completo` y `GET Listar alertas de stock bajo` (`200 OK`).
   - Opcionalmente, crear un producto de prueba con `9. Administración de productos e inventario -> POST Crear producto`, actualizar su stock con `PUT Actualizar stock de producto` y desactivarlo con `DELETE Desactivar producto`.

> **Recomendación sobre la base de datos remota:** Ejecuta las solicitudes de escritura (`POST`, `PUT`, `DELETE`) paso a paso de forma controlada durante la demostración. No ejecutes carpetas de escritura en bucle automático contra el servidor PostgreSQL de DigitalOcean.
