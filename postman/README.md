# Shop Menoss en Postman

1. Importa `Shop-Menoss.postman_collection.json` en Postman. La colección usa `baseUrl = http://localhost:18088` y Bearer `{{token}}`.
2. Configura `correo` y `password` sólo en un entorno local de Postman y ejecuta **01b Login** con una cuenta ADMINISTRADOR existente; captura el JWT automáticamente. Alternativamente configura `token` localmente. No exportes credenciales ni tokens. `/api/pedidos` lista únicamente los pedidos de la cuenta autenticada; el historial completo está en `/api/admin/pedidos`.
3. Ejecuta **01 - Consultas** y después **02 - Validaciones** para capturar IDs y stock. La prueba 12 se omite salvo `enableStockValidation=true`: úsala sólo en una ventana controlada sin reposiciones/compras concurrentes, porque un stock cambiado podría permitir crear un pedido. No continúes si health no devuelve 200.
4. **03 - Operaciones de escritura** se omite por defecto. Para demostrar el cambio temporal de stock, cambia `enableStockWrite` a `true`, ejecuta los pasos 15 y 16 consecutivamente y comprueba que el segundo restaure el valor. Evita hacerlo si hay compras concurrentes.
5. Los pasos 17 y 18 crean registros permanentes. Sólo se ejecutan si cambias `enablePermanentWrites` a `true`; la API no ofrece endpoints para borrarlos.
6. Para la presentación, abre **04 - Demostración profesor**, ejecuta primero el paso 19 y cambia `enableProfessorDemo` a `true`. Después ejecuta los pasos 20 a 23 en orden. El paso 20 crea un producto permanente, guarda su ID y vuelve a desactivar inmediatamente la variable; los pasos siguientes demuestran su persistencia por listado, ID e inventario.
7. Para evidencias, captura en Postman el nombre de la solicitud, URL, estado HTTP, pestaña **Test Results** y respuesta. No incluyas `.env` ni credenciales en capturas o Git.

También puedes ejecutar localmente toda la parte segura desde la raíz del proyecto:

```powershell
postman collection run postman/Shop-Menoss.postman_collection.json
```

Con los valores predeterminados, las operaciones que persisten datos y la validación de stock insuficiente quedan omitidas. Las validaciones de formularios envían únicamente cuerpos inválidos. Después de habilitar escrituras, devuelve las variables a `false`.

Los importes de pedidos nuevos incluyen IGV en los precios y S/10 de envío. El backend calcula el total. Las operaciones de producto, categoría e inventario requieren ADMINISTRADOR.

Ver `../DEMO-FUNCIONAL.md` para resultados ejecutados, migración compatible y bloqueo actual de conectividad. La colección se pudo cargar con Postman CLI; la comprobación contra Docker falló porque health respondió 502 (no es un PASS).
