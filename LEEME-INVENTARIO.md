# Shop Menoss — Módulo mínimo de inventario

## Contenido

- `InventarioController.java`: tres endpoints REST.
- `InventarioService.java`: consultas, alerta de stock bajo (0 a 5), actualización y descuento de unidades con bloqueo de fila.
- `InventarioResponse.java` y `ActualizarStockRequest.java`: modelos HTTP simples.
- `PedidoService.java`: reemplazo mínimo del descuento manual por `inventarioService.descontarStock` (usa la transacción del pedido).
- `InventarioServiceTest.java`: seis pruebas con H2.

## Endpoints

- GET `/api/inventario`
- GET `/api/inventario/bajo-stock`
- PUT `/api/productos/{id}/stock` body `{"stock":20}`

No se crea otra entidad ni tabla. Se utiliza `Producto` y `ProductoRepository` existentes.

## Regla de integración con pedidos

El descuento ocurre **al crear el pedido**, igual que ocurría en el código base. El equipo debe acordar si posteriormente prefiere descontar al cambiar a CONFIRMADO y restaurar al cancelar. No implementar dos descuentos para la misma compra.

## Pruebas

```powershell
cd backend
.\mvnw.cmd test
```

Tras integrar Docker a `main`, otra opción es usar `docker compose up -d --build` desde el proyecto.

## Seguridad

Este módulo NO configura permisos. El proyecto `main` todavía tiene `SecurityConfig.java` con `.anyRequest().permitAll()`. El endpoint PUT debe protegerse para ADMINISTRADOR con el responsable de autenticación **antes de un despliegue público**. Para la práctica local del curso, probarlo únicamente en localhost.

## Compatibilidad

Paquete preparado tomando como base `main` (merge commit `71cbd77`). La rama `feature/products-categories` está pendiente. Si otra persona cambia PedidoService.java, revisar el diff antes de integrar.

## Prueba manual (con un producto ID existente)

```powershell
Invoke-RestMethod http://localhost:18088/api/inventario
Invoke-RestMethod http://localhost:18088/api/inventario/bajo-stock
Invoke-RestMethod -Method Put -Uri http://localhost:18088/api/productos/1/stock -ContentType 'application/json' -Body '{"stock":20}'
```
