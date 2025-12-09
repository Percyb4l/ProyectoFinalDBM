# VriSA - Sistema de Vigilancia y Reporte de Información Ambiental

## 📋 Descripción del Proyecto

**VriSA** es una plataforma integral de monitoreo y reporte ambiental desarrollada como proyecto final para la materia de Bases de Datos de la Universidad del Valle. El sistema permite a instituciones gubernamentales, académicas y privadas gestionar estaciones de monitoreo ambiental, recolectar datos en tiempo real, generar alertas automáticas y visualizar tendencias históricas de calidad del aire.

### 🎯 Objetivos

- **Monitoreo Ambiental en Tiempo Real**: Recolección continua de datos desde múltiples estaciones de monitoreo distribuidas geográficamente.
- **Gestión Multi-Institución**: Soporte para que múltiples organizaciones gestionen sus propias redes de estaciones.
- **Sistema de Alertas Inteligente**: Generación automática de alertas cuando las mediciones exceden umbrales predefinidos.
- **Visualización de Datos**: Gráficas interactivas de tendencias históricas con capacidad de comparación.
- **Acceso Público**: Dashboard público para que ciudadanos consulten información ambiental sin autenticación.

---

## 🚀 Características Principales

### Para Ciudadanos
- ✅ Dashboard público con indicadores de calidad del aire
- ✅ Visualización de datos históricos mediante gráficas interactivas
- ✅ Filtrado por estación, variable y período de tiempo
- ✅ Mapa interactivo de estaciones de monitoreo

### Para Operadores de Estación
- ✅ Registro y gestión de estaciones
- ✅ Asociación de sensores y variables ambientales
- ✅ Carga de certificados de calibración y mantenimiento
- ✅ Visualización de mediciones en tiempo real

### Para Administradores
- ✅ Gestión completa de usuarios, instituciones y estaciones
- ✅ Sistema de roles y permisos (RBAC)
- ✅ Gestión de alertas y umbrales
- ✅ Reportes y análisis de datos
- ✅ Aprobación de solicitudes de integración

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.2.0** - Framework de UI
- **React Router DOM 7.9.6** - Enrutamiento
- **Recharts 2.15.4** - Visualización de gráficas
- **Axios 1.13.2** - Cliente HTTP
- **Vite 7.2.4** - Build tool y dev server
- **CSS3** - Estilos responsive mobile-first

### Backend
- **Node.js** - Runtime
- **Express.js 5.1.0** - Framework web
- **PostgreSQL 16** - Base de datos relacional
- **JWT** - Autenticación sin estado
- **bcryptjs** - Encriptación de contraseñas
- **multer** - Manejo de archivos (certificados)

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación
- **pgAdmin 4** - Administración de BD

---

## 📁 Estructura del Proyecto

```
ProyectoFinalDBM-main/
├── client/                 # Aplicación Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── ChartManager.jsx      # Gestor de múltiples gráficas
│   │   │   ├── MeasurementChart.jsx  # Gráfica de tendencias históricas
│   │   │   ├── DataTable.jsx         # Tabla de datos ordenable
│   │   │   └── Modal.jsx             # Ventanas modales
│   │   ├── pages/          # Páginas/Vistas
│   │   │   ├── Dashboard.jsx         # Dashboard público
│   │   │   ├── Login.jsx             # Página de acceso
│   │   │   └── admin/                # Panel administrativo
│   │   ├── services/       # Servicios API
│   │   ├── context/        # Context API (Auth)
│   │   └── hooks/         # Custom hooks (useBranding)
│   └── package.json
│
├── server/                 # Aplicación Backend Express
│   ├── controllers/        # Lógica de negocio
│   │   ├── measurementController.js  # Incluye detección automática de alertas
│   │   ├── certificateController.js  # Gestión de certificados
│   │   └── ...
│   ├── routes/            # Rutas API
│   ├── middleware/        # Auth, error handling
│   ├── config/            # Configuración (DB, multer)
│   ├── database/          # Scripts SQL
│   │   ├── schema.sql     # Esquema completo
│   │   └── seed_database.js  # Población de datos de prueba
│   └── package.json
│
├── docker-compose.yml      # Configuración Docker
├── ARCHITECTURE.md         # Documentación técnica
├── USER_MANUAL_ENGLISH.md  # Manual de usuario (Inglés)
├── USER_MANUAL_SPANISH.md  # Manual de usuario (Español)
└── README.md              # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd ProyectoFinalDBM-main
   ```

2. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=vrisa_db
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES=7d
   
   # Server
   PORT=3001
   ```

3. **Iniciar servicios con Docker**
   ```bash
   docker-compose up -d
   ```

4. **Instalar dependencias**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

5. **Inicializar base de datos**
   ```bash
   # Ejecutar schema.sql en PostgreSQL
   # O usar pgAdmin para importar el archivo
   ```

6. **Poblar base de datos (opcional)**
   ```bash
   cd server
   node database/seed_database.js
   ```

7. **Iniciar servidores**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

8. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - pgAdmin: http://localhost:5050

---

## 📚 Documentación

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentación técnica completa de la arquitectura del sistema
- **[USER_MANUAL_ENGLISH.md](./USER_MANUAL_ENGLISH.md)** - Manual de usuario en inglés
- **[USER_MANUAL_SPANISH.md](./USER_MANUAL_SPANISH.md)** - Manual de usuario en español
- **[QA_REPORT.md](./QA_REPORT.md)** - Reporte de pruebas de calidad
- **[COMPLIANCE_MATRIX.md](./COMPLIANCE_MATRIX.md)** - Matriz de cumplimiento de requisitos

---

## 🔑 Credenciales por Defecto

Después de ejecutar `seed_database.js`, puedes usar estas credenciales:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin General | admin@vrisa.com | 123456 |
| Admin Institución | admin.ambiente@vrisa.com | 123456 |
| Operador | operador1@vrisa.com | 123456 |
| Ciudadano | ciudadano@vrisa.com | 123456 |

---

## 🎨 Características Destacadas

### 📊 Gráficas de Tendencias Históricas
- Visualización interactiva con Recharts
- Múltiples gráficas simultáneas
- Filtrado por estación y variable
- Líneas de referencia para umbrales críticos
- Tooltips informativos

### 🔔 Sistema de Alertas Automático
- Detección automática cuando se exceden umbrales
- Prevención de alertas duplicadas
- Niveles de severidad: low, medium, high, critical

### 🎨 Apariencia Institucional
- Colores personalizados por institución
- Logo institucional
- Branding dinámico basado en el usuario logueado

### 📄 Gestión de Certificados
- Carga de certificados de calibración y mantenimiento
- Soporte para PDF e imágenes
- Asociación con estaciones y sensores

---

## 🧪 Testing

El proyecto incluye:
- Scripts de seeding para datos de prueba
- Reporte de QA con casos de prueba
- Matriz de cumplimiento de requisitos

---

## 👥 Autores

Proyecto desarrollado para la materia de Bases de Datos - Universidad del Valle

---

## 📝 Licencia

Este proyecto es parte de un trabajo académico de la Universidad del Valle.

---

## 🤝 Contribuciones

Este es un proyecto académico. Para sugerencias o mejoras, por favor contactar a los desarrolladores.

---

## 📞 Soporte

Para consultas técnicas o problemas, revisar la documentación en:
- `ARCHITECTURE.md` - Para detalles técnicos
- `USER_MANUAL_SPANISH.md` - Para guías de usuario

---

**Última actualización**: 2024
