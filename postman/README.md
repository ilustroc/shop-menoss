# Shop Menoss en Postman

1. Importa `Shop-Menoss.postman_collection.json` en Postman. La colección ya usa `baseUrl = http://localhost:18088` y no requiere autenticación.
2. Ejecuta primero **01 - Consultas** y después **02 - Validaciones**. Ese orden captura dinámicamente los IDs y el stock. Ambas carpetas son seguras para la base compartida.
3. **03 - Operaciones de escritura** se omite por defecto. Para demostrar el cambio temporal de stock, cambia `enableStockWrite` a `true`, ejecuta los pasos 15 y 16 consecutivamente y comprueba que el segundo restaure el valor. Evita hacerlo si hay compras concurrentes.
4. Los pasos 17 y 18 crean registros permanentes. Sólo se ejecutan si cambias `enablePermanentWrites` a `true`; la API no ofrece endpoints para borrarlos.
5. Para la presentación, abre **04 - Demostración profesor**, ejecuta primero el paso 19 y cambia `enableProfessorDemo` a `true`. Después ejecuta los pasos 20 a 23 en orden. El paso 20 crea un producto permanente, guarda su ID y vuelve a desactivar inmediatamente la variable; los pasos siguientes demuestran su persistencia por listado, ID e inventario.
6. Para evidencias, captura en Postman el nombre de la solicitud, URL, estado HTTP, pestaña **Test Results** y respuesta. No incluyas `.env` ni credenciales en capturas o Git.

También puedes ejecutar localmente toda la parte segura desde la raíz del proyecto:

```powershell
postman collection run postman/Shop-Menoss.postman_collection.json
```

Con los valores predeterminados, todas las solicitudes de escritura, incluida la creación del producto de demostración, quedan omitidas.
