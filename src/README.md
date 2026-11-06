# 🧩 EventConnect Mobile - Arquitectura Interna del Núcleo (`src/`)

Este directorio contiene toda la lógica de negocio, servicios de red, gestión de estado, diseño y componentes reutilizables de la aplicación móvil **EventConnect**.

---

## 📁 Estructura del Directorio

```
src/
├── components/          # Componentes de UI modulares y reutilizables (estilo iOS)
│   ├── Button.tsx                  # Botón personalizable con estados de carga y variantes
│   ├── CodeInput.tsx               # Entrada segmentada para código de verificación (6 dígitos)
│   ├── ErrorBoundary.tsx           # Captura global de excepciones no controladas de React
│   ├── ErrorMessage.tsx            # Mensajes de error contextuales y amigables
│   ├── EventFiltersModal.tsx       # Modal de filtrado avanzado (categoría, estado, fecha)
│   ├── Input.tsx                   # Campo de texto con validación y alternador de visibilidad
│   ├── IOSAlert.tsx                # Diálogo modal con estética nativa de iOS
│   ├── IOSSuccessAlert.tsx         # Modal de confirmación y éxito estilizado
│   ├── Loading.tsx                 # Spinner / indicador de carga centrado
│   ├── NavigationBarController.tsx # Sincronizador de color de barra de navegación en Android
│   ├── NoConnection.tsx            # Pantalla de aviso sin conexión a internet y reintento
│   ├── PasswordStrength.tsx        # Indicador visual reactivo de seguridad de contraseña
│   ├── Toast.tsx                   # Notificación flotante emergente tipo snackbar
│   └── index.ts                    # Exportación unificada de componentes
│
├── constants/           # Constantes del sistema, colores y temas
│   ├── colors.ts                   # Paleta cromática para modo claro y oscuro
│   ├── config.ts                   # URLs base, timeouts, claves de storage y reglas
│   ├── iosStyles.ts                # Sistema de tipografía, sombras, bordes y espaciados iOS
│   └── index.ts                    # Exportación unificada de constantes
│
├── contexts/            # Proveedores de estado global (React Context API)
│   ├── AuthContext.tsx             # Estado de sesión (usuario, login, logout, bootstrap)
│   ├── ThemeContext.tsx            # Modo claro / oscuro persistente y reactivo
│   ├── ToastContext.tsx            # Dispatcher para mostrar toasts en cualquier pantalla
│   └── index.ts                    # Exportación unificada de contextos
│
├── hooks/               # Custom hooks reutilizables
│   ├── useAuth.ts                  # Hook de acceso rápido al contexto de autenticación
│   ├── useTheme.ts                 # Hook para lectura y alternancia de tema visual
│   ├── useNavigationBar.ts         # Hook de control sobre la barra de navegación del sistema
│   ├── useColorScheme.ts           # Detección del esquema de color nativo del dispositivo
│   └── index.ts                    # Exportación unificada de hooks
│
├── img/                 # Recursos gráficos y branding
│   ├── logo_dark-f.png             # Logotipo oficial para fondo oscuro
│   └── logo_light-f.png            # Logotipo oficial para fondo claro
│
├── services/            # Capa de consumo de API REST
│   ├── api.ts                      # Instancia Axios con interceptores JWT y error handling
│   ├── authService.ts              # Login, registro, recuperación y reseteo de contraseña
│   ├── eventService.ts             # Exploración, búsqueda, detalle y eventos próximos
│   ├── registrationService.ts      # Inscripción a eventos, mis registros y cancelación
│   ├── tokenService.ts             # Registro y revocación de tokens FCM para notificaciones
│   ├── userService.ts              # Gestión de perfil, cambio de clave y subida de avatar
│   └── index.ts                    # Exportación unificada de servicios
│
├── types/               # Definiciones y contratos TypeScript
│   ├── auth.types.ts               # Interfaces de usuario, credenciales y autenticación
│   ├── event.types.ts              # Interfaces de eventos, categorías, estado y filtros
│   ├── registration.types.ts       # Modelos de inscripciones y capacidades
│   └── index.ts                    # Exportación unificada de tipos
│
└── utils/               # Funciones utilitarias puras y helpers
    ├── formatters.ts               # Formateo de fechas, horas, nombres y porcentajes
    ├── storage.ts                  # Capa de abstracción sobre @react-native-async-storage
    ├── token.ts                    # Registro y permisos de Push Notifications (Expo/FCM)
    ├── validators.ts               # Validadores de emails, contraseñas, nombres y códigos
    └── index.ts                    # Exportación unificada de utilidades
```

---

## 🛠️ Módulos Clave

### 1. Capa de Servicios (`src/services/`)
- **`api.ts`**: Cliente HTTP basado en Axios.
  - Inyecta automáticamente el encabezado `Authorization: Bearer <token>` mediante un interceptor de peticiones.
  - Manejo unificado de respuestas y mapeo de errores HTTP (`401`, `403`, `404`, `500`, timeout) con mensajes amigables al usuario.
- **`authService.ts`**: Endpoints de autenticación (`/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-code`, `/auth/reset-password`).
- **`eventService.ts`**: Endpoints de consulta de eventos (`/events`, `/events/:id`, `/events/upcoming`, `/events/active`).
- **`registrationService.ts`**: Endpoints de inscripciones a eventos (`/registrations`, `/registrations/my-registrations`, `/registrations/:id/cancel`).
- **`tokenService.ts`**: Sincronización del token push FCM con el backend (`/token`).
- **`userService.ts`**: Actualización de perfil del usuario, cambio de contraseña y subida de avatar mediante `multipart/form-data`.

### 2. Gestión de Estado (`src/contexts/` & `src/hooks/`)
- **`AuthContext` / `useAuth`**: Controla el ciclo de vida de la sesión del usuario. Carga el token guardado en `AsyncStorage` al iniciar (`bootstrapAsync`), orquesta el inicio/cierre de sesión y coordina la sincronización o eliminación del token de notificaciones push.
- **`ThemeContext` / `useTheme`**: Administra el tema activo (`light` / `dark`), adaptando paletas de colores y estilos nativos. Permite al usuario alternar el modo manualmente o seguir el tema del sistema.
- **`ToastContext` / `useToast`**: Permite lanzar notificaciones emergentes no bloqueantes desde cualquier nivel del árbol de componentes (`showToast('Operación exitosa', 'success')`).

### 3. Sistema de Diseño (`src/constants/iosStyles.ts` & `src/constants/colors.ts`)
- Basado en directrices Human Interface Guidelines (HIG) de Apple adaptadas a React Native.
- Soporte total para Dark Mode y Light Mode con contrastes accesibles.
- Elevaciones, sombras y curvaturas de esquinas consistentes en toda la aplicación.

### 4. Utilidades y Validaciones (`src/utils/`)
- **`storage.ts`**: Encapsula `AsyncStorage` con métodos fuertemente tipados (`saveToken`, `getToken`, `saveUser`, `getUser`, `clearAuthData`).
- **`validators.ts`**: Validaciones regex de formato de email, fuerza de contraseñas (longitud, mayúsculas, minúsculas, números), longitud de nombres y formato de código OTP de 6 dígitos.
- **`formatters.ts`**: Convierte fechas ISO en textos legibles en español, calcula tiempo restante para eventos y formatea porcentajes de ocupación de aforo.
- **`token.ts`**: Solicita permisos nativos de notificaciones en Android/iOS, configura canales con alta prioridad y recupera el Expo Push Token.

---

## 🔒 Buenas Prácticas de Desarrollo en `src/`

1. **Importaciones Centralizadas**: Emplear los archivos barrel (`index.ts`) para importar componentes, utilidades, servicios o contextos:
   ```typescript
   import { Button, Input, IOSAlert } from '@/src/components';
   import { useAuth, useTheme, useToast } from '@/src/hooks';
   import { eventService, registrationService } from '@/src/services';
   import { formatDate, validateEmail } from '@/src/utils';
   ```
2. **Cero Secretos Hardcodeados**: Ninguna API key ni credencial sensible debe escribirse en el código fuente. Las configuraciones de red dinámicas se definen a través de `src/constants/config.ts` o variables de entorno.
3. **Manejo Resiliente de Errores**: Todo consumo de red debe estar protegido con bloques `try/catch` y notificar estados al usuario mediante `Toast` o `IOSAlert`.
