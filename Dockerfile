# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite necesita las variables de entorno en tiempo de construcción
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:stable-alpine
# Copiamos los archivos construidos a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Inyectamos configuración de Nginx con Reverse Proxy para múltiples microservicios
RUN echo 'server { \
    listen 80; \
    \
    # 1. Rutas del Frontend (React) \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # 2. Rutas hacia el microservicio de Despachos \
    location /api/v1/despachos { \
        proxy_pass http://despachos-service:8091; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    \
    # 3. Rutas hacia el microservicio de Ventas \
    location /api/v1/ventas { \
        proxy_pass http://ventas-service:8092; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]