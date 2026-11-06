<div align="center">

# 📱 EventConnect Mobile

**Aplicación móvil multiplataforma para el descubrimiento, inscripción y gestión en tiempo real de eventos académicos, culturales y deportivos.**

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-v6-black?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![Firebase](https://img.shields.io/badge/Firebase_FCM-Push_Notifications-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Platforms](https://img.shields.io/badge/Platforms-Android_%7C_iOS-blueviolet?style=for-the-badge)](https://expo.dev/)

[📖 Documentación Completa del Sistema](./DOCUMENTACION.md) • [🧩 Arquitectura de Código (`src/`)](./src/README.md) • [⚙️ Variables de Entorno](./.env.example)

</div>

---

## 🌟 Descripción General

**EventConnect Mobile** es la solución móvil oficial del ecosistema **EventConnect**, diseñada específicamente para conectar a estudiantes, docentes y miembros de comunidades universitarias con todas las actividades extracurriculares, congresos, talleres y competencias disponibles en su entorno.

Construida con un enfoque **mobile-first**, la aplicación combina el rendimiento nativo de **React Native** con la robustez de **TypeScript** y el sistema de navegación declarativa de **Expo Router 6**, ofreciendo una interfaz inspirada en las guías de diseño de **iOS (Human Interface Guidelines)**, soporte para **Modo Oscuro / Claro** y sincronización de notificaciones push en tiempo real.

> 🚀 **Proyecto optimizado para Portafolio Profesional**: Este repositorio incluye arquitectura modular por capas, tipado estricto, buenas prácticas de seguridad, sanitización de credenciales y documentación técnica exhaustiva.

---

## ✨ Características Principales

| Característica | Descripción |
| :--- | :--- |
| 🔐 **Autenticación Completa** | Inicio de sesión, registro con indicador de seguridad de contraseña en tiempo real, persistencia de sesión con JWT en `AsyncStorage` y recuperación de cuenta mediante código OTP de 6 dígitos. |
| 🎯 **Explorador de Eventos** | Feed dinámico con categorización (Académico, Cultural, Deportivo), buscador en vivo y modal de filtros avanzados por estado y fecha. |
| 📊 **Control de Aforo en Vivo** | Cálculo automático del porcentaje de ocupación, visualización de cupos disponibles y alertas de aforo completo. |
| 📝 **Inscripciones y Cancelación** | Registro a eventos en un clic y pestaña dedicada **"Mis Eventos"** para gestionar inscripciones activas, con flujo de cancelación asistida y liberación de cupo. |
| 🔔 **Notificaciones Push (FCM)** | Integración con Expo Notifications y Firebase Cloud Messaging para alertas de apertura de cupos, recordatorios y cambios de horario, con registro y desvinculación automática de token por usuario. |
| 🌗 **Tema Adaptativo** | Soporte completo para Modo Claro y Modo Oscuro, con persistencia y detección automática del tema del sistema operativo. |
| 🛡️ **Tolerancia a Fallos y Modo Offline** | Pantalla de estado de desconexión (`NoConnection.tsx`) con reintento automático y `ErrorBoundary` global para prevenir caídas de la app. |
| 👤 **Perfil y Personalización** | Edición de datos personales, cambio seguro de contraseña y actualización de foto de perfil con selector de imágenes (`expo-image-picker`) y subida `multipart/form-data`. |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Núcleo Móvil** | React Native 0.81, React 19, Expo SDK 54 |
| **Lenguaje** | TypeScript 5.9 (Tipado estricto y sin errores `any` inseguros) |
| **Navegación** | Expo Router v6 (File-based routing con Typed Routes habilitado) |
| **Estado Global** | React Context API (`AuthContext`, `ThemeContext`, `ToastContext`) + Custom Hooks |
| **Networking & HTTP** | Axios con interceptores automáticos de autorización JWT, timeouts y normalización de errores |
| **Almacenamiento Local** | `@react-native-async-storage/async-storage` para tokens y perfiles en caché |
| **Notificaciones Push** | `expo-notifications`, `expo-device` y Firebase Cloud Messaging (Android) |
| **UI & Experiencia Nativa**| `@expo/vector-icons`, `expo-haptics`, `expo-blur`, `expo-image`, `expo-navigation-bar`, `expo-splash-screen` |
| **Estilos y Diseño** | Tokens de diseño inspirados en iOS HIG (`iosStyles.ts`), paletas dinámicas y Safe Area Insets |

---

## 📂 Estructura del Proyecto

```
eventconnect-movil/
├── app/                              # Rutas y navegación declarativa (Expo Router)
│   ├── (auth)/                       # Flujo público de autenticación
│   │   ├── login.tsx                 # Inicio de sesión
│   │   ├── register.tsx              # Registro con validador de fortaleza
│   │   ├── forgot-password.tsx       # Solicitud de código OTP
│   │   ├── verify-code.tsx           # Verificación de código de 6 dígitos
│   │   └── reset-password.tsx        # Cambio de contraseña con token temporal
│   ├── (tabs)/                       # Navegación principal por pestañas inferiores
│   │   ├── index.tsx                 # Feed principal y explorador de eventos
│   │   ├── my-events.tsx             # Panel "Mis Eventos" y gestión de inscripciones
│   │   └── profile.tsx               # Perfil de usuario, preferencias y logout
│   ├── (profile)/                    # Rutas secundarias de usuario
│   │   ├── edit-profile.tsx          # Edición de nombres y foto de avatar
│   │   └── change-password.tsx       # Cambio de clave con verificación previa
│   ├── event/
│   │   └── [id].tsx                  # Vista de detalle dinámico e inscripción
│   ├── _layout.tsx                   # Proveedores globales, NavigationBar y ErrorBoundary
│   └── index.tsx                     # Enrutador inteligente inicial
│
├── assets/                           # Iconos, splash screens y assets estáticos
│
├── src/                              # Lógica central del sistema
│   ├── components/                   # Componentes de UI reutilizables estilo iOS
│   ├── constants/                    # Configuración global, paletas y estilos HIG
│   ├── contexts/                     # Proveedores de estado (Auth, Theme, Toast)
│   ├── hooks/                        # Custom hooks (`useAuth`, `useTheme`, etc.)
│   ├── services/                     # Capa de API REST tipada (Axios)
│   ├── types/                        # Interfaces y contratos TypeScript
│   └── utils/                        # Validadores, formateadores y helpers de storage/push
│
├── .env.example                      # Plantilla de variables de entorno para desarrollo
├── google-services.json.example      # Plantilla sanitizada de configuración de Firebase
├── app.json                          # Manifiesto de configuración de Expo
├── DOCUMENTACION.md                  # Documentación técnica y funcional en profundidad
└── package.json                      # Scripts y dependencias del proyecto
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- **Node.js** (versión 18 o superior recomendada)
- **npm** o **pnpm**
- **Expo Go** en tu dispositivo físico (iOS o Android) o **Android Studio / Xcode** para emuladores.
- Backend de **EventConnect API** corriendo localmente o en un servidor accesible.

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/eventconnect-movil.git
cd eventconnect-movil
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno y Firebase

1. **Variables de entorno:**
   Crea tu archivo `.env` a partir de la plantilla:
   ```bash
   cp .env.example .env
   ```

2. **Configuración de Firebase (para Notificaciones Push en Android):**
   Si deseas probar notificaciones nativas en Android, copia la plantilla y coloca tus datos de proyecto:
   ```bash
   cp google-services.json.example google-services.json
   ```
   *(Nota: `google-services.json` está protegido en `.gitignore` para no exponer credenciales).*

3. **Configurar la URL del Backend:**
   En `src/constants/config.ts`, ajusta la URL del servidor según tu entorno:
   - **En emulador Android:** Puedes ejecutar el comando `adb reverse tcp:3001 tcp:3001` para usar `http://localhost:3001/api`.
   - **En dispositivo físico:** Usa la dirección IP local de tu computador (ej. `http://192.168.1.15:3001/api`).

### Paso 4: Iniciar la aplicación

```bash
# Iniciar el servidor de desarrollo de Expo
npm start

# O para ejecutar directamente en Android
npm run android

# O para ejecutar directamente en iOS (requiere macOS)
npm run ios
```

Escanea el código QR que aparecerá en tu terminal desde la aplicación **Expo Go** en tu teléfono o presiona `a` para abrirlo en el emulador de Android.

---

## 🔒 Seguridad y Buenas Prácticas (Portfolio Ready)

Este repositorio sigue directrices estrictas de seguridad de código abierto:
- **Cero Secretos en el Control de Versiones:** Los archivos con credenciales (`google-services.json`, archivos `.env`, llaves privadas `.pem`, `.jks`) están explícitamente ignorados en [`.gitignore`](.gitignore).
- **Manejo Seguro de Sesión:** El token JWT del usuario se transmite en cada petición HTTP exclusivamente a través del encabezado estándar `Authorization: Bearer <token>` gestionado por Axios, evitando exponer tokens en parámetros URL.
- **Revocación de Dispositivos:** Al hacer logout, el token de notificaciones push se elimina del servidor para garantizar que las notificaciones no lleguen a un usuario diferente.
- **Validaciones Defensivas:** Todos los inputs (correo electrónico, fortaleza de contraseña, longitud de textos, códigos numéricos) se validan en el cliente antes de emitir peticiones a la API.

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
| :--- | :--- | :--- |
| Iniciar Expo | `npm start` | Lanza el Metro Bundler de Expo |
| Ejecutar Android | `npm run android` | Compila y lanza la app en emulador/dispositivo Android |
| Ejecutar iOS | `npm run ios` | Compila y lanza la app en simulador iOS |
| Ejecutar Web | `npm run web` | Previsualiza la aplicación en el navegador web |
| Linter | `npm run lint` | Ejecuta ESLint sobre el código fuente |

---

## 📚 Documentación Adicional

Para un desglose completo de la arquitectura, casos de uso, contratos de endpoints de la API y diagramas de secuencia:
- 📖 **[DOCUMENTACION.md](./DOCUMENTACION.md)**: Explicación exhaustiva del qué es, qué hace y cómo funciona el sistema a nivel de ingeniería de software.
- 🧩 **[src/README.md](./src/README.md)**: Detalle técnico de la capa de componentes, servicios, hooks y constantes.

---

## 👤 Autor

**Desarrollado para Portafolio Profesional**  
- **Proyecto:** EventConnect Mobile  
- **Especialidad:** Desarrollo Móvil Multiplataforma (React Native / Expo / TypeScript)  

---

<div align="center">
<sub>Hecho con dedicación, arquitectura limpia y pasión por el desarrollo móvil de calidad. ⭐ Si te resultó útil, no olvides dejar una estrella.</sub>
</div>
