<div align="center">
  <h1>🛍️ E-Commerce Full-Stack Project</h1>
  <p>
    <img src="https://img.shields.io/badge/Status-En%20Producci%C3%B3n-success?style=for-the-badge&logo=github" alt="Status">
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
    <img src="https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge" alt="License">
  </p>
  <p>Una plataforma de comercio electrónico robusta, escalable y estructurada bajo una arquitectura cliente-servidor.</p>
  <a href="https://proyecto-e-commerce-81d4.vercel.app/" target="_blank">Link de la pagina</a>
</div>

---

## 🛠️ Arquitectura y Stack Tecnológico

El proyecto está construido como un **Monorepo** separando lógicamente el Frontend del Backend, desplegados en infraestructuras independientes para maximizar rendimiento y seguridad.

| Categoría | Tecnología / Herramienta | Rol en el Proyecto | Despliegue / Hosting |
| :--- | :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JS | Interfaz de usuario, peticiones `fetch`, manipulación del DOM. | ☁️ **Vercel** |
| **Backend** | Node.js, Express.js | Lógica de negocio, API RESTful, Middlewares. | ☁️ **Render** |
| **Base de Datos**| MySQL | Almacenamiento relacional, transacciones, integridad referencial. | ☁️ **TiDB Cloud** (Serverless) |

### 📦 Dependencias del Servidor (Node.js)
| Paquete | Versión | Propósito Principal |
| :--- | :--- | :--- |
| `bcrypt` | `^6.0.0` | Hashing y salting de contraseñas para protección de datos confidenciales. |
| `jsonwebtoken` | `^9.0.3` | Generación y validación estricta de tokens de acceso (JWT). |
| `mysql2` | `^3.22.3` | Cliente de conexión MySQL basado en promesas con soporte obligatorio SSL. |
| `cors` | `^2.8.6` | Control de acceso HTTP (Cross-Origin Resource Sharing) para la API. |
| `dotenv` | `^17.4.2` | Gestión segura de variables de entorno y secretos de producción. |

---

## ✨ Características y Funcionalidades

El sistema maneja dos tipos de roles, protegidos y validados criptográficamente mediante JSON Web Tokens (JWT).

### 🛒 Funcionalidades del Cliente (Frontend)
- [x] **Autenticación:** Registro de nuevos clientes e inicio de sesión seguro.
- [x] **Catálogo Dinámico:** Visualización de productos en tiempo real consultando la base de datos.
- [x] **Carrito de Compras:** Sistema persistente para agregar y gestionar productos previo a la compra.
- [x] **Checkout y Pedidos:** Creación de órdenes con descuento automático y transaccional del inventario (Stock).
- [x] **Historial:** Consulta de pedidos anteriores realizados por el cliente logueado.

### ⚙️ Funcionalidades del Administrador (API REST)
- [x] **Acceso Privilegiado:** Autenticación y generación de token exclusivo de nivel administrador.
- [x] **Auditoría de Usuarios:** Endpoint para recuperar y visualizar todos los clientes registrados.
- [x] **Gestión de Inventario (CRUD):** - Recuperar todos los productos del sistema.
  - Agregar productos nuevos al catálogo.
  - Modificar productos existentes mediante método PUT.

---

## 🎨 Diseño e Interfaz

La experiencia de usuario (UX) y la interfaz (UI) se desarrollaron bajo principios de rendimiento y escalabilidad visual:

* **Arquitectura Modular CSS:** Hojas de estilo separadas por contexto (`global.css`, `catalog.css`, `cart.css`, `auth.css`, `checkout.css`, `orders.css`) para un mantenimiento óptimo.
* **Diseño Responsivo:** Adaptación fluida a dispositivos móviles, tablets y pantallas de escritorio.
* **Feedback Visual:** Respuestas dinámicas e inmediatas ante interacciones del usuario.
* **Zero Frameworks:** Interfaz construida de forma nativa sin librerías pesadas para asegurar tiempos de carga casi instantáneos en el navegador.

---

## 📂 Estructura del Proyecto

```bash
📦 proyecto_e-commerce
 ┣  backend/
 ┃ ┣  controllers/     # Lógica de negocio (auth, orders, products, clients)
 ┃ ┣  middlewares/     # Validadores de seguridad (verifyToken, verifyAdmin)
 ┃ ┣  models/          # Configuración y pool de conexión a la BD
 ┃ ┣  routes/          # Definición de endpoints de la API
 ┃ ┗  app.js           # Entry point del servidor Express
 ┣  frontend/
 ┃ ┣  assets/images/   # Recursos gráficos
 ┃ ┣  css/             # Estilos modulares
 ┃ ┣  js/services/     # Lógica centralizada de peticiones (api.js)
 ┃ ┗  *.html           # Vistas de la aplicación web
 ┣  .gitignore
 ┗  package.json
```

## 🌐 Endpoints de la API REST

| Método | Endpoint | Descripción | Requiere Token | Rol Mínimo |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/register` | Registra un nuevo cliente | ❌ | Público |
| `POST` | `/api/auth/login` | Inicia sesión (Cliente/Admin) | ❌ | Público |
| `GET` | `/api/products` | Obtiene el catálogo de productos | ✅ | Cliente / Admin |
| `POST` | `/api/orders` | Crea un nuevo pedido | ✅ | Cliente |
| `GET` | `/api/orders` | Obtiene el historial del usuario | ✅ | Cliente |
| `GET` | `/api/clients` | Obtiene la lista completa de clientes | ✅ | **Admin** |
| `POST` | `/api/products` | Crea un producto nuevo en BD | ✅ | **Admin** |
| `PUT` | `/api/products/:id` | Modifica un producto existente | ✅ | **Admin** |

## 👥 Autores

Proyecto desarrollado por:

* 👨‍💻 [**JuanEnC**](https://github.com/JuanEnC)
* 👨‍💻 [**hmor2**](https://github.com/hmor2)
