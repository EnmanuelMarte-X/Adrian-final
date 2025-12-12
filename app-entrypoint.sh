#!/bin/sh

# Esperar a que MongoDB esté disponible
echo "Esperando a MongoDB..."
sleep 5

# Ejecutar seed del usuario admin (ignora errores si ya existe)
echo "Creando usuario admin por defecto..."
pnpm exec tsx src/scripts/seed-admin.ts || true

# Iniciar la aplicación
echo "Iniciando aplicación..."
exec pnpm start
