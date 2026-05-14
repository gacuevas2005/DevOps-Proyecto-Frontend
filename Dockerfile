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
# Copiamos una configuración de Nginx básica para React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]