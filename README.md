# 🌐 Frontend Platform - Grupo Cordillera (InnovaTech Chile)

Esta aplicación web es la capa de presentación principal (Frontend) para la gestión del sistema operativo de InnovaTech Chile. Desarrollada en **React + Vite**, ha sido diseñada bajo una arquitectura moderna y desplegada de forma nativa en la nube mediante contenedores orquestados en **Amazon EKS**.

---

## 🚀 Ficha Técnica y Tecnologías

*   **Librería Principal:** React 18
*   **Empaquetador:** Vite (Rendimiento optimizado)
*   **Servidor Web en Producción:** Nginx (Alpine)
*   **Contenedorización:** Docker (Multi-stage build)
*   **Registro de Contenedores:** Amazon ECR
*   **Orquestación Cloud:** Amazon EKS (Kubernetes)
*   **CI/CD:** GitHub Actions
*   **Exposición de Red:** AWS Application Load Balancer (ALB)

---

## ☁️ Novedades Arquitectónicas (Evaluación 3)

Para esta fase, el frontend abandonó el despliegue monolítico en instancias EC2 con `docker-compose` para adoptar una arquitectura empresarial de microservicios:

*   **Orquestación en Kubernetes:** El frontend ahora se despliega como un *Deployment* escalable dentro de un clúster EKS.
*   **Pipeline CI/CD Directo a AWS:** GitHub Actions automatiza la construcción y el envío (push) de la imagen segura directamente a **Amazon ECR** (reemplazando a DockerHub).
*   **El Fin del CORS (Reverse Proxy):** Esta es la mejora más importante. El contenedor de producción ya no busca una API pública. Nginx fue configurado como un proxy inverso interno. Las peticiones a `/api/v1/despachos` y `/api/v1/ventas` son interceptadas por Nginx y enrutadas internamente por la red de Kubernetes hacia `despachos-service:8091` y `ventas-service:8092`, brindando máxima seguridad.

---

## 🐳 Arquitectura Docker (Multi-stage build)

Utilizamos un `Dockerfile` de múltiples etapas para garantizar seguridad y el mínimo peso posible en producción:

### Etapa 1: Build (Node)
*   `FROM node:18-alpine AS build`: Usa una imagen base ligera.
*   Instala las dependencias (`npm install`).
*   Compila React (`npm run build`), generando los archivos estáticos optimizados en la carpeta `dist/`.

### Etapa 2: Producción (Nginx Reverse Proxy)
*   `FROM nginx:stable-alpine`: Utiliza un servidor web ultraligero.
*   Copia únicamente los archivos estáticos compilados de la Etapa 1.
*   Inyecta el archivo de configuración custom de Nginx para manejar el *Routing* de React (SPA) y el *Proxy Pass* hacia los microservicios backend.

**📊 Ventajas de esta configuración:**
*   **Imagen 10x más pequeña:** Solo el código compilado viaja a producción (sin carpeta `node_modules`).
*   **Seguridad:** Node.js no se ejecuta en producción; Nginx sirve los estáticos y enruta el tráfico.

---

## 🛠️ Ejecución y Desarrollo Local

### 1. Entorno de Desarrollo (Modo Dev)
Para trabajar en el código fuente de manera local con *Hot Reload*:
```bash
npm install
npm run dev
2. Pruebas con Docker Local
Para generar la imagen simulando el pipeline de producción:

Bash
docker build -t innovatech-frontend:latest .
docker run -p 80:80 innovatech-frontend:latest
(Nota: Al correr en Docker local, el Reverse Proxy intentará buscar los servicios de Kubernetes. Si no tienes los backends corriendo en tu red Docker local, las llamadas a la API devolverán error 502, pero la interfaz visual cargará correctamente en http://localhost).

🔄 Flujo de Despliegue en AWS EKS
El ciclo de vida de la aplicación está 100% automatizado:

Commit / Push: El desarrollador envía cambios a la rama main.

GitHub Actions: El pipeline detecta el cambio, construye la imagen Multi-stage y aprueba las pruebas de calidad.

Amazon ECR: La imagen optimizada es enviada al registro privado de AWS.

Amazon EKS: El pipeline actualiza el manifiesto de despliegue (deployment.yaml). Kubernetes descarga la nueva imagen y realiza un Rolling Update (despliegue sin tiempo de inactividad).

Acceso Público: Los usuarios acceden a la versión actualizada a través de la URL pública del balanceador de carga (Load Balancer).
