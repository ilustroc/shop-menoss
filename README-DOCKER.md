# Shop Menoss - Docker para pruebas locales

Este paquete agrega Docker a un repositorio que contiene `backend/` (Spring Boot 4, Maven, Java 21) y `frontend/` (React, Vite, TypeScript). No incluye ni sobrescribe los datos PostgreSQL de cPanel.

## Requisitos
- Windows 10/11 con Docker Desktop funcionando y soporte WSL 2 habilitado (o Docker Engine + Compose en Linux).
- Git y PowerShell si se trabaja en Windows.
- Acceso a Internet para descargar las imagenes y dependencias durante el primer build.

## Instalacion
1. Copiar los archivos del ZIP en la **raiz** de Shop Menoss, junto a `backend/` y `frontend/`, manteniendo las carpetas.
2. Crear archivo `.env` a partir de `.env.example`.
3. Editar `.env` y colocar una contraseña en `POSTGRES_PASSWORD` (nunca subir `.env` a Git).
4. Ejecutar desde la raiz del proyecto:

```powershell
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

## Acceder
- Frontend: http://localhost:8088
- API/health (pasa por Nginx): http://localhost:8088/api/health
- PostgreSQL desde DBeaver (local en la computadora que ejecuta Docker): host `127.0.0.1`, puerto `15433`, base `shop_menoss`, usuario `shop_menoss`, contraseña del `.env`.

**NO confundir:** PostgreSQL local de Docker = `shop_menoss`; PostgreSQL del cPanel = `ilustroc_shop_menoss`. Son bases distintas.

## Consultar tablas (se crean al iniciar el backend con JPA ddl-auto=update)
```powershell
docker compose exec db psql -U shop_menoss -d shop_menoss -c '\dt'
```

## Logs y operacion
```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
docker compose down
```

`docker compose down` conserva el volumen. **NO usar `docker compose down -v`** si deseas conservar los datos: elimina los volumenes de la base local.

## Compartir con compañeros
- Subir por PR solo `compose.yaml`, `.env.example`, `.gitignore`, Dockerfile(s), `.dockerignore`, nginx.conf, el cambio en `api.ts` y este README.
- Cada integrante hace `cp .env.example .env` y define **su propia** clave local; no compartir una contraseña en el repositorio.
- Cada equipo tendra inicialmente su **propia base PostgreSQL local**, no una base compartida. Para compartir el PostgreSQL de cPanel hay que configurar otro modo de conexion, autenticacion remota o tunel SSH sin publicar contraseñas.

## Alcance y limitaciones
- Configuracion pensada para **pruebas locales**: puertos web y SQL vinculados a localhost; no expone aplicaciones hacia Internet.
- El frontend del repositorio aun tiene vistas con datos mock/localStorage. Docker no reemplaza esas vistas por llamadas reales automaticamente.
- Spring Boot actual utiliza `ddl-auto=update` y puede crear/actualizar tablas para desarrollo; usar migraciones y controles de acceso antes de produccion.
- Este hosting cPanel no tiene `docker` ni `sudo` disponibles en SSH, por lo que el paquete NO se podra levantar alli sin soporte administrativo/VPS.
- No incluye HTTPS ni endurecimiento de produccion.
