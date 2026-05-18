🐳 Arquitectura Docker
Dockerfile (Multi-stage build)
Etapa 1: Build

Dockerfile
FROM node:18-alpine AS build
Usa Node 18 en Alpine (ligero)
Instala dependencias: npm install
Compila React: npm run build → genera carpeta dist/
Etapa 2: Producción

Dockerfile
FROM nginx:stable-alpine
Copia archivos compilados a Nginx
Configura Nginx para servir React Router
Expone puerto 80
¿Por qué este setup?
Menor tamaño: Solo el código compilado va en la imagen final (sin node_modules)
Más seguro: Nginx en lugar de Node en producción
Variables de entorno: VITE_API_BASE_URL se pasa en tiempo de construcción
🚀 Flujo de Despliegue en AWS EC2
Code
1. GitHub Repo
    ↓
2. Pipeline CI/CD (probablemente GitHub Actions)
    ↓
3. Docker build → docker-compose.yml
    ↓
4. Push a Docker Registry (DockerHub)
    ↓
5. EC2 instance
    ├─ docker-compose pull
    └─ docker-compose up -d
    ↓
6. Frontend servido en puerto 80
📦 Docker Compose en EC2
YAML
services:
  frontend:
    image: "${DOCKER_USERNAME}/innovatech-frontend:latest"
    ports:
      - "80:80"      # Accesible públicamente
    restart: always  # Se reinicia si cae
🔧 Pasos para Ejecutar en EC2
1. En tu máquina local (generar imagen Docker)
bash
# Construir la imagen
docker build --build-arg VITE_API_BASE_URL=https://tu-backend-api.com -t tu-usuario/innovatech-frontend:latest .

# Subir a DockerHub
docker push tu-usuario/innovatech-frontend:latest
2. En la instancia EC2 (con Docker instalado)
bash
# Obtener docker-compose.yml del repositorio
git clone https://github.com/gacuevas2005/DevOps-Proyecto-Frontend.git
cd DevOps-Proyecto-Frontend

# Configurar credenciales de DockerHub (si es privado)
docker login

# Descargar e iniciar el contenedor
docker-compose up -d

# Verificar que está corriendo
docker ps
3. Acceder al frontend
Code
http://<IP-EC2>:80
📊 Ventajas de esta Configuración
Aspecto	Beneficio
Multi-stage	Imagen 10x más pequeña
Alpine	Menor consumo de recursos
Nginx	Alto rendimiento en producción
Docker Compose	Fácil de actualizar/escalar
Restart policy	Alta disponibilidad
⚠️ Consideraciones para EC2
Security Group: Abre puerto 80 (y 443 si usas HTTPS)
Dominio: Apunta tu dominio a la IP elástica de EC2
Variables de entorno: El VITE_API_BASE_URL debe apuntar a tu backend
AWS ECR: Considera usar ECR en lugar de DockerHub para mejor integración con AWS
