# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./

# Instalar dependencias solo para producción (sin devDependencies)
RUN npm install --only=production

# Copiar el resto del código fuente
COPY . .


# Compilar el proyecto NestJS
RUN npm run build

# Etapa 2: Ejecución
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules

# Copiar archivos compilados y configuraciones
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Puerto expuesto por NestJS
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]
