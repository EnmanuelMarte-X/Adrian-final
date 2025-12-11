# Jhenson Supply - Docker Guide

## 📦 Requisitos Previos

- Docker instalado ([Descargar Docker Desktop](https://www.docker.com/products/docker-desktop))
- Docker Compose (viene con Docker Desktop)

## ⚙️ Configuración Inicial (Primera vez)

### 1. Crear archivo de variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# (Opcional) Editar las variables si es necesario
# nano .env.local
```

> **Nota:** Si no creas el archivo `.env.local`, Docker usará automáticamente los valores del `.env.example`

## 🚀 Iniciar el Proyecto

### 1. Construir las imágenes y levantar los servicios

```bash
docker-compose up --build
```

Este comando:
- Crea la imagen de la aplicación Next.js
- Descarga la imagen de MongoDB
- Inicia la aplicación en `http://localhost:3000`
- Inicia MongoDB en `mongodb://admin:admin123@localhost:27017`
- Inicia MongoDB Express en `http://localhost:8081`

### 2. Crear usuario admin por defecto

Después de levantar los contenedores, ejecuta este comando para crear un usuario admin:

```bash
docker-compose exec app pnpm exec tsx src/scripts/seed-admin.ts
```

Esto creará el usuario:
- **Email:** admin@admin.com
- **Contraseña:** admin1234

### 3. Iniciar sin reconstruir (después de la primera vez)

```bash
docker-compose up
```

### 4. Detener los servicios

```bash
docker-compose down
```

### 5. Detener y eliminar datos

```bash
docker-compose down -v
```

## 🗄️ Servicios Disponibles

### Aplicación (Jhenson Supply)
- **URL**: http://localhost:3000
- **Container**: jhenson-supply-app
- **Puerto**: 3000

### MongoDB
- **URI**: `mongodb://admin:admin123@mongodb:27017/jhenson?authSource=admin`
- **Container**: jhenson-supply-mongodb
- **Puerto**: 27017
- **Usuario**: admin
- **Contraseña**: admin123
- **Base de datos**: jhenson

### MongoDB Express (UI para MongoDB)
- **URL**: http://localhost:8081
- **Container**: jhenson-supply-mongo-express
- **Usuario**: admin
- **Contraseña**: admin123

## 📝 Variables de Entorno

Las variables se configuran automáticamente en el `docker-compose.yml`:

```
NODE_ENV=production
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/jhenson?authSource=admin
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui-cambialo-en-produccion-123456789
NEXTAUTH_URL=http://localhost:3000
```

⚠️ **Importante**: En producción, cambia el `NEXTAUTH_SECRET` por un valor único y seguro.

## 🔧 Comandos Útiles

### Ver logs
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Ejecutar comandos en un container
```bash
# En la aplicación
docker-compose exec app pnpm build

# En MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Reconstruir solo la aplicación
```bash
docker-compose up --build app
```

## 📊 Estructura de Volúmenes

- `mongodb_data`: Almacena los datos de la base de datos MongoDB
- `mongodb_config`: Almacena la configuración de MongoDB

Los datos persisten entre reinicios de los containers.

## 🐛 Troubleshooting

### La aplicación no puede conectar con MongoDB
- Verifica que MongoDB esté corriendo: `docker-compose ps`
- Verifica los logs: `docker-compose logs mongodb`
- Espera a que MongoDB inicie completamente (revisa el healthcheck)

### Puerto ya en uso
Cambia los puertos en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Aplicación en puerto 3001
  - "27018:27017"  # MongoDB en puerto 27018
```

### Limpiar todo y comenzar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB in Docker](https://hub.docker.com/_/mongo)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
