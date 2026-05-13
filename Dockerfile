# STAGE 1: Build (Construcción)
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# STAGE 2: Runtime (Servidor ligero)
FROM nginx:alpine

# SEGURIDAD: Configuración para ejecutar Nginx como usuario no root
# (Nginx por defecto requiere root para el puerto 80, lo cambiamos al 8080)
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

USER nginx

# RENDIMIENTO: Copiamos solo los archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]