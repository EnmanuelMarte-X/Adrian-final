# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar todos los archivos de configuración
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* tsconfig.json next.config.ts ./

# Copiar archivo de entorno (.env.local si existe, sino .env.example)
COPY .env.exampl[e] .env.loca[l] ./
RUN if [ -f .env.local ]; then echo "Using .env.local"; elif [ -f .env.example ]; then cp .env.example .env.local && echo "Created .env.local from .env.example"; fi

# Instalar dependencias
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install --no-frozen-lockfile; fi

# Copiar el código fuente completo
COPY src ./src
COPY public ./public
COPY components.json biome.json postcss.config.mjs ./
COPY config ./config

# Copiar el código fuente completo
COPY src ./src
COPY public ./public
COPY components.json biome.json postcss.config.mjs ./
COPY config ./config

# Compilar la aplicación
RUN pnpm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json
COPY package.json ./

# Copiar el lock file si existe
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Instalar dependencias completas (necesarias para tsx y seed)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install --no-frozen-lockfile; fi

# Copiar la aplicación compilada desde el stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

# Copiar scripts necesarios para el seed
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copiar script de entrada
COPY app-entrypoint.sh ./app-entrypoint.sh
RUN chmod +x ./app-entrypoint.sh

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://host.docker.internal:27017/adrian_db
ENV NEXTAUTH_SECRET=secreto-por-defecto-cambiar-en-produccion
ENV NEXTAUTH_URL=http://localhost:3000

# Exponer puerto
EXPOSE 3000

# Usar script de entrada que crea usuario admin y luego inicia la app
CMD ["./app-entrypoint.sh"]
