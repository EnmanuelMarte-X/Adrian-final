# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* tsconfig.json next.config.ts ./

# Copiar archivo de entorno
COPY .env.local .env.local
# Copiar todos los archivos de configuración
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* tsconfig.json next.config.ts ./

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

# Instalar solo dependencias de producción
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --prod; else pnpm install --prod --no-frozen-lockfile; fi

# Copiar la aplicación compilada desde el stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
