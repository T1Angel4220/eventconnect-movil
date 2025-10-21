# EventConnect Mobile - Configuración de Servicios API

## ✅ Configuración Completada

Se ha configurado exitosamente toda la infraestructura de servicios API para la aplicación móvil.

---

## 📁 Estructura Creada

```
src/
├── constants/
│   └── config.ts              # Configuración global (URLs, timeouts, keys)
│
├── types/
│   ├── auth.types.ts          # Tipos de autenticación
│   ├── event.types.ts         # Tipos de eventos
│   ├── registration.types.ts  # Tipos de inscripciones
│   └── index.ts               # Exportación unificada
│
├── utils/
│   ├── storage.ts             # Helpers de AsyncStorage
│   ├── validators.ts          # Funciones de validación
│   ├── formatters.ts          # Funciones de formato
│   └── index.ts               # Exportación unificada
│
└── services/
    ├── api.ts                 # Configuración base de axios
    ├── authService.ts         # Servicio de autenticación
    ├── eventService.ts        # Servicio de eventos
    ├── registrationService.ts # Servicio de inscripciones
    └── index.ts               # Exportación unificada
```

---

## 🔧 Archivos Creados

### 1. **Tipos TypeScript** (4 archivos)

- ✅ `auth.types.ts` - User, Login, Register, ForgotPassword, etc.
- ✅ `event.types.ts` - Event, EventWithOrganizer, EventDetails
- ✅ `registration.types.ts` - Registration, RegistrationWithDetails
- ✅ `index.ts` - Exportación unificada

### 2. **Constantes** (1 archivo)

- ✅ `config.ts` - API_BASE_URL, STORAGE_KEYS, VALIDATION_RULES, etc.

### 3. **Utilidades** (4 archivos)

- ✅ `storage.ts` - AsyncStorage helpers (saveToken, getUser, etc.)
- ✅ `validators.ts` - Validaciones (email, password, nombre, código)
- ✅ `formatters.ts` - Formateo (fechas, duración, nombres)
- ✅ `index.ts` - Exportación unificada

### 4. **Servicios** (5 archivos)

- ✅ `api.ts` - Configuración de axios con interceptores
- ✅ `authService.ts` - Login, Register, ForgotPassword, etc.
- ✅ `eventService.ts` - CRUD de eventos
- ✅ `registrationService.ts` - Gestión de inscripciones
- ✅ `index.ts` - Exportación unificada

---

## 📦 Dependencias Instaladas

```bash
✅ @react-native-async-storage/async-storage  # Persistencia local
✅ axios                                       # Cliente HTTP
```

---

## 🚀 Funcionalidades Implementadas

### **Servicio de Autenticación (`authService`)**

```typescript
import { authService } from '@/src/services';

// Login
const result = await authService.login({ email, password });

// Registro
const result = await authService.register({ first_name, last_name, email, password });

// Recuperación de contraseña
const result = await authService.forgotPassword({ email });

// Verificar código
const result = await authService.verifyCode({ email, code });

// Resetear contraseña
const result = await authService.resetPassword({ email, code, new_password });

// Logout
await authService.logout();

// Verificar autenticación
const isAuth = await authService.checkAuth();
```

### **Servicio de Eventos (`eventService`)**

```typescript
import { eventService } from '@/src/services';

// Todos los eventos
const result = await eventService.getAllEvents();

// Evento por ID
const result = await eventService.getEventById(eventId);

// Eventos próximos
const result = await eventService.getUpcomingEvents(limit);

// Eventos activos
const result = await eventService.getActiveEvents();

// Buscar eventos
const result = await eventService.searchEvents({ type: 'academic', search: 'tech' });
```

### **Servicio de Inscripciones (`registrationService`)**

```typescript
import { registrationService } from '@/src/services';

// Inscribirse
const result = await registrationService.createRegistration({ event_id });

// Mis inscripciones
const result = await registrationService.getMyRegistrations();

// Cancelar inscripción
const result = await registrationService.cancelRegistration(registrationId);

// Capacidad del evento
const result = await registrationService.getEventCapacity(eventId);
```

---

## 🔑 Funciones de Storage

```typescript
import { saveToken, getToken, saveUser, getUser, clearAuthData } from '@/src/utils';

// Guardar token
await saveToken('token_aqui');

// Obtener token
const token = await getToken();

// Guardar usuario
await saveUser(userData);

// Obtener usuario
const user = await getUser();

// Limpiar todo
await clearAuthData();
```

---

## ✅ Validaciones Disponibles

```typescript
import { validateEmail, validatePassword, validateName, validateCode } from '@/src/utils';

// Validar email
const { isValid, error } = validateEmail('test@example.com');

// Validar contraseña
const { isValid, error } = validatePassword('MyPass123');

// Validar nombre
const { isValid, error } = validateName('Juan', 'nombre');

// Validar código
const { isValid, error } = validateCode('123456');

// Fuerza de contraseña (0-4)
import { getPasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from '@/src/utils';

const strength = getPasswordStrength('MyPass123'); // 3
const text = getPasswordStrengthText(strength); // "Buena"
const color = getPasswordStrengthColor(strength); // "#3b82f6"
```

---

## 📅 Formateadores Disponibles

```typescript
import {
  formatDate,
  formatDateTime,
  formatTime,
  getTimeUntilEvent,
  formatDuration,
  getEventTypeName,
  formatFullName,
  getInitials,
  truncateText,
} from '@/src/utils';

// Formatear fecha
formatDate('2025-01-15T10:00:00Z'); // "15 de enero de 2025"

// Fecha con hora
formatDateTime('2025-01-15T10:00:00Z'); // "15 ene 2025 a las 10:00"

// Solo hora
formatTime('2025-01-15T10:00:00Z'); // "10:00"

// Tiempo hasta evento
getTimeUntilEvent('2025-01-15T10:00:00Z'); // "En 3 días"

// Duración
formatDuration(120); // "2 horas"

// Tipo de evento
getEventTypeName('academic'); // "Académico"

// Nombre completo
formatFullName('Juan', 'Pérez'); // "Juan Pérez"

// Iniciales
getInitials('Juan', 'Pérez'); // "JP"

// Truncar texto
truncateText('Texto muy largo...', 10); // "Texto muy..."
```

---

## ⚠️ Configuración Importante

### **Cambiar la URL del Backend**

Edita `src/constants/config.ts` y cambia la IP por la de tu computadora:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://TU_IP_LOCAL:3001/api'  // ⚠️ CAMBIA ESTO
  : 'https://tu-api-produccion.com/api';
```

**Para encontrar tu IP:**
- **Windows:** Abre CMD y ejecuta `ipconfig` → Busca "Dirección IPv4"
- **Mac/Linux:** Abre Terminal y ejecuta `ifconfig` → Busca "inet"

---

## 🎯 Características de la Configuración

### **Interceptores de Axios**

- ✅ **Agrega automáticamente el token JWT** a todas las peticiones
- ✅ **Log de peticiones y respuestas** en modo desarrollo
- ✅ **Manejo automático de errores** con mensajes amigables
- ✅ **Timeout de 10 segundos** por petición

### **Persistencia con AsyncStorage**

- ✅ **Guarda token y usuario** automáticamente al hacer login
- ✅ **Recupera datos al abrir la app** para mantener sesión
- ✅ **Limpia datos al hacer logout**

### **Validaciones Robustas**

- ✅ **Email:** Formato válido
- ✅ **Contraseña:** Min 8 caracteres, mayúscula, minúscula, número
- ✅ **Nombre:** Solo letras y espacios
- ✅ **Código:** 6 dígitos numéricos

---

## 📚 Próximos Pasos

1. ✅ ~~Configurar servicios API~~ (COMPLETADO)
2. ✅ ~~Crear tipos TypeScript~~ (COMPLETADO)
3. ⏳ Implementar AuthContext
4. ⏳ Crear componentes reutilizables
5. ⏳ Implementar pantallas de autenticación
6. ⏳ Implementar dashboard

---

## 💡 Ejemplo de Uso Completo

```typescript
import { authService } from '@/src/services';
import { validateEmail, validatePassword } from '@/src/utils';

// En tu componente de Login
const handleLogin = async () => {
  // Validar
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    Alert.alert('Error', emailValidation.error);
    return;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    Alert.alert('Error', passwordValidation.error);
    return;
  }

  // Hacer login
  const result = await authService.login({ email, password });
  
  if (result.success) {
    // ✅ Token y usuario ya están guardados automáticamente
    navigation.navigate('Dashboard');
  } else {
    Alert.alert('Error', result.message);
  }
};
```

---

## 🎉 ¡Todo listo para continuar!

La base de servicios API está completa y lista para ser usada en los componentes y pantallas.

