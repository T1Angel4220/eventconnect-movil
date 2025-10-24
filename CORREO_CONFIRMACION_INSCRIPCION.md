# 📧 Sistema de Correos de Inscripción y Cancelación

## 📋 Resumen

Se ha implementado un sistema completo de correos electrónicos para gestionar inscripciones y cancelaciones de eventos. Los usuarios reciben automáticamente correos profesionales con diseño atractivo en dos momentos clave:
1. ✅ **Al inscribirse** a un evento
2. ✖️ **Al cancelar** su inscripción

---

## ✨ Características Implementadas

### 1. **Correo de Confirmación de Inscripción ✅**

#### Plantilla HTML Profesional
- ✅ Diseño responsivo y moderno con gradientes de color
- ✅ Colores dinámicos según el tipo de evento:
  - **Académico**: Púrpura (`#667eea`)
  - **Cultural**: Rosa (`#f5576c`)
  - **Deportivo**: Azul (`#4facfe`)
- ✅ Iconos emoji para mejor visualización
- ✅ Tarjetas individuales para cada detalle del evento
- ✅ Badge de confirmación verde
- ✅ Sección de información importante destacada

#### Información Incluida
- 📅 **Fecha del evento** (formato largo en español)
- ⏰ **Hora del evento** (formato 24 horas)
- ⏱️ **Duración** (en horas y minutos)
- 📍 **Ubicación** del evento
- 👤 **Nombre del organizador**
- 🎨 **Tipo de evento** (con iconos y colores correspondientes)
- ✅ **Confirmación visual** con badge verde

#### Funcionalidad
- ✅ Envío automático después de inscripción exitosa
- ✅ Envío no bloqueante (asíncrono)
- ✅ No afecta la inscripción si el correo falla
- ✅ Logs detallados para seguimiento
- ✅ Formateo automático de fechas y duración

---

### 2. **Correo de Cancelación de Inscripción ✖️**

#### Plantilla HTML Profesional
- ✅ Diseño elegante con gradiente gris (neutral)
- ✅ Header con icono de cancelación (✖️)
- ✅ Tarjetas con información del evento cancelado
- ✅ Badge de confirmación de cancelación
- ✅ Mensaje informativo sobre la liberación de plaza
- ✅ Información sobre posibilidad de re-inscripción

#### Información Incluida
- 📅 **Fecha del evento** (formato largo en español)
- ⏰ **Hora del evento** (formato 24 horas)
- 📍 **Ubicación** del evento
- 👤 **Nombre del organizador**
- 🎨 **Tipo de evento** (con icono correspondiente)
- ✅ **Confirmación de cancelación**
- ℹ️ **Información sobre re-inscripción**

#### Funcionalidad
- ✅ Envío automático después de cancelación exitosa
- ✅ Envío no bloqueante (asíncrono)
- ✅ No afecta la cancelación si el correo falla
- ✅ Logs detallados para seguimiento
- ✅ Formateo automático de fechas

#### Diferencias Visuales del Correo de Cancelación:
- 🎨 **Color gris neutro** en lugar de colores vibrantes
- ✖️ **Icono de cancelación** en el header
- ℹ️ **Mensaje de información** en lugar de mensaje de bienvenida
- 🔄 **Información sobre re-inscripción** disponible

---

## 📁 Archivos Modificados

### 1. **`eventconnect/backend/authentication/services/email.service.ts`**

#### Cambios Realizados:
- ✅ Agregada función `getRegistrationConfirmationHtml()` con plantilla HTML para confirmación
- ✅ Agregada función `sendRegistrationConfirmation()` para envío del correo de confirmación
- ✅ Agregada función `getRegistrationCancellationHtml()` con plantilla HTML para cancelación
- ✅ Agregada función `sendRegistrationCancellation()` para envío del correo de cancelación
- ✅ Soporte para 3 tipos de eventos con colores e iconos diferentes
- ✅ Diseño diferenciado para confirmación (colores vibrantes) y cancelación (gris neutral)

```typescript
export async function sendRegistrationConfirmation(
  email: string,
  firstName: string,
  eventData: {
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    duration: string;
    organizerName: string;
  }
): Promise<EmailResult>
```

**Plantilla de Confirmación Incluye:**
- Header con gradiente dinámico según tipo de evento
- Saludo personalizado con nombre del usuario
- Tarjeta del evento con detalles organizados
- Badge de confirmación exitosa (verde)
- Sección de información importante
- Footer corporativo

**Plantilla de Cancelación Incluye:**
- Header con gradiente gris neutral
- Mensaje de cancelación procesada
- Tarjeta del evento con detalles
- Badge de cancelación exitosa (gris)
- Información sobre re-inscripción
- Footer corporativo

```typescript
export async function sendRegistrationCancellation(
  email: string,
  firstName: string,
  eventData: {
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    organizerName: string;
  }
): Promise<EmailResult>
```

---

### 2. **`eventconnect/backend/authentication/controllers/registration.controller.ts`**

#### Cambios Realizados:
- ✅ Importadas funciones necesarias:
  - `sendRegistrationConfirmation` (email.service)
  - `sendRegistrationCancellation` (email.service)
  - `userRepository` (para datos del usuario)
  - `eventRepository` (para datos del evento)

- ✅ Modificado `createRegistration()` para enviar correo de confirmación después de inscripción exitosa

```typescript
// Enviar correo de confirmación (de forma no bloqueante)
this.sendConfirmationEmail(userId, event_id).catch(error => {
  console.error('Error enviando correo de confirmación:', error);
  // No fallar la inscripción si el correo falla
});
```

- ✅ Modificado `cancelRegistration()` para enviar correo de cancelación después de cancelar

```typescript
// Enviar correo de cancelación (de forma no bloqueante)
this.sendCancellationEmail(userId, registration.event_id).catch(error => {
  console.error('Error enviando correo de cancelación:', error);
  // No fallar la cancelación si el correo falla
});
```

- ✅ Agregado método privado `sendConfirmationEmail()`:
  - Obtiene datos del usuario desde la base de datos
  - Obtiene datos del evento con organizador
  - Formatea fecha a formato largo en español
  - Formatea hora a formato 24 horas
  - Calcula y formatea duración en horas/minutos
  - Envía el correo con toda la información

- ✅ Agregado método privado `sendCancellationEmail()`:
  - Obtiene datos del usuario desde la base de datos
  - Obtiene datos del evento con organizador
  - Formatea fecha y hora
  - Envía el correo de cancelación con la información del evento

---

## 🎨 Diseño del Correo

### Estructura Visual:

```
┌─────────────────────────────────────────┐
│  [HEADER CON GRADIENTE SEGÚN TIPO]     │
│         [ICONO DEL TIPO]                │
│     ¡Inscripción Confirmada!            │
│        Event Connect                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  ¡Hola [Nombre]! 👋                     │
│                                         │
│  Tu inscripción al siguiente evento...  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  [ICONO] [TÍTULO DEL EVENTO]      │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ 📅 Fecha: ...               │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ ⏰ Hora: ...                │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ ⏱️ Duración: ...            │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ 📍 Ubicación: ...           │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ 👤 Organizador: ...         │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │        ✅                          │ │
│  │  Inscripción Exitosa               │ │
│  │  ¡Te esperamos en el evento!       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  ⚠️ Información importante:        │ │
│  │  • Llega 10 minutos antes         │ │
│  │  • Puedes cancelar desde la app   │ │
│  │  • Revisa "Mis Eventos"           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ¡Gracias por participar!              │
│  ¡Nos vemos pronto!                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  © 2024 Event Connect                   │
│  Sistema de Gestión Universitaria       │
│  Este es un email automático            │
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Ejecución

### Flujo de Inscripción ✅

```
1. Usuario presiona "Inscribirse al Evento" en la app móvil
           ↓
2. POST /api/registrations con event_id
           ↓
3. Validaciones (capacidad, inscripción previa, etc.)
           ↓
4. Se crea la inscripción en la base de datos
           ↓
5. ✅ Se envía respuesta exitosa al usuario inmediatamente
           ↓
6. [Proceso paralelo, no bloqueante]
           ↓
7. Se obtienen datos del usuario (nombre, email)
           ↓
8. Se obtienen datos del evento (título, fecha, ubicación, etc.)
           ↓
9. Se formatean fechas, hora y duración
           ↓
10. Se envía correo de confirmación
           ↓
11. Log de éxito/error del correo
    (no afecta la inscripción)
```

### Flujo de Cancelación ✖️

```
1. Usuario presiona "Cancelar Inscripción" en "Mis Eventos"
           ↓
2. Confirma la cancelación en el diálogo de confirmación
           ↓
3. PUT /api/registrations/:id/cancel
           ↓
4. Validaciones (pertenece al usuario, no está ya cancelada)
           ↓
5. Se actualiza el status a 'canceled' en la base de datos
           ↓
6. ✅ Se envía respuesta exitosa al usuario inmediatamente
           ↓
7. [Proceso paralelo, no bloqueante]
           ↓
8. Se obtienen datos del usuario (nombre, email)
           ↓
9. Se obtienen datos del evento (título, fecha, ubicación, etc.)
           ↓
10. Se formatean fechas y hora
           ↓
11. Se envía correo de cancelación
           ↓
12. Log de éxito/error del correo
    (no afecta la cancelación)
```

---

## 📝 Formato de Fechas y Duración

### Fecha:
```typescript
// Entrada: 2024-10-25T14:30:00.000Z
// Salida: "Viernes, 25 de octubre de 2024"

const formattedDate = eventDate.toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
```

### Hora:
```typescript
// Entrada: 2024-10-25T14:30:00.000Z
// Salida: "14:30"

const formattedTime = eventDate.toLocaleTimeString('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
```

### Duración:
```typescript
// Entrada: 150 (minutos)
// Salida: "2 horas 30 minutos"

const hours = Math.floor(event.duration / 60);
const minutes = event.duration % 60;
```

---

## 🎯 Tipos de Eventos y Colores

| Tipo       | Color Principal | Gradiente                                    | Icono |
|------------|----------------|----------------------------------------------|-------|
| Académico  | `#667eea`      | `#667eea → #764ba2`                          | 📚    |
| Cultural   | `#f5576c`      | `#f093fb → #f5576c`                          | 🎨    |
| Deportivo  | `#4facfe`      | `#4facfe → #00f2fe`                          | ⚽    |

---

## 🔒 Seguridad y Manejo de Errores

### ✅ Implementaciones de Seguridad:
1. **Envío no bloqueante**: Si falla el correo, no afecta la inscripción
2. **Validación de datos**: Se verifica que el usuario y evento existen antes de enviar
3. **Logs detallados**: Todos los pasos están registrados en consola
4. **Try-catch**: Errores capturados y registrados sin detener el proceso

### ⚠️ Manejo de Errores:
```typescript
this.sendConfirmationEmail(userId, event_id).catch(error => {
  console.error('Error enviando correo de confirmación:', error);
  // No fallar la inscripción si el correo falla
});
```

---

## 📊 Logs del Sistema

### Durante el Envío de Confirmación:
```
📧 Preparando envío de correo de confirmación para userId: 5, eventId: 12
📧 Email de confirmación de inscripción enviado: [messageId]
✅ Correo de confirmación enviado exitosamente a usuario@ejemplo.com
```

### Durante el Envío de Cancelación:
```
📧 Preparando envío de correo de cancelación para userId: 5, eventId: 12
📧 Email de cancelación de inscripción enviado: [messageId]
✅ Correo de cancelación enviado exitosamente a usuario@ejemplo.com
```

### En Caso de Error:
```
❌ Usuario no encontrado para enviar correo
❌ Usuario no encontrado para enviar correo de cancelación
❌ Evento no encontrado para enviar correo
❌ Evento no encontrado para enviar correo de cancelación
❌ Error al enviar correo: [mensaje de error]
❌ Error al enviar correo de cancelación: [mensaje de error]
❌ Error en sendConfirmationEmail: [detalles del error]
❌ Error en sendCancellationEmail: [detalles del error]
```

---

## 🧪 Pruebas

### Para Probar el Correo de Confirmación:

1. **Inscribirse a un evento desde la app móvil**
2. **Verificar que la inscripción fue exitosa**
3. **Revisar el correo electrónico** del usuario registrado
4. **Verificar los logs del backend**:
   ```bash
   # En la terminal del backend debería aparecer:
   📧 Preparando envío de correo de confirmación...
   📧 Email de confirmación de inscripción enviado: [messageId]
   ✅ Correo de confirmación enviado exitosamente a...
   ```

### Para Probar el Correo de Cancelación:

1. **Ir a "Mis Eventos" en la app móvil**
2. **Presionar "Cancelar Inscripción" en un evento inscrito**
3. **Confirmar la cancelación en el diálogo**
4. **Revisar el correo electrónico** del usuario
5. **Verificar los logs del backend**:
   ```bash
   # En la terminal del backend debería aparecer:
   📧 Preparando envío de correo de cancelación...
   📧 Email de cancelación de inscripción enviado: [messageId]
   ✅ Correo de cancelación enviado exitosamente a...
   ```

### ⚠️ Nota Importante:
Para que los correos se envíen correctamente, asegúrate de tener configuradas las variables de entorno:
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

---

## 📧 Ejemplo de Asuntos de Correos

### Correos de Confirmación:
```
✅ Confirmación de Inscripción - Taller de Programación Avanzada
✅ Confirmación de Inscripción - Festival Cultural Universitario
✅ Confirmación de Inscripción - Torneo de Fútbol Inter-Facultades
```

### Correos de Cancelación:
```
✖️ Cancelación de Inscripción - Taller de Programación Avanzada
✖️ Cancelación de Inscripción - Festival Cultural Universitario
✖️ Cancelación de Inscripción - Torneo de Fútbol Inter-Facultades
```

---

## 🎉 Resultado

Los usuarios ahora reciben correos profesionales y atractivos en dos momentos clave:
1. **Al inscribirse** a un evento (correo de confirmación con colores vibrantes)
2. **Al cancelar** su inscripción (correo informativo con diseño neutral)

Esto mejora significativamente la experiencia de usuario y proporciona una confirmación visual clara de todas las acciones.

### Beneficios:
- ✅ **Confirmación inmediata** por correo electrónico (inscripción y cancelación)
- ✅ **Todos los detalles** del evento en un solo lugar
- ✅ **Diseño profesional diferenciado** para cada tipo de acción
- ✅ **Experiencia de usuario mejorada** con comunicación clara
- ✅ **Reducción de consultas** "¿Me inscribí correctamente?" o "¿Se canceló mi inscripción?"
- ✅ **Información sobre re-inscripción** en correos de cancelación
- ✅ **Registro permanente** de acciones en el correo del usuario

### Tipos de Correos Implementados:
1. ✅ **Correo de Confirmación** - Colores vibrantes según tipo de evento
2. ✖️ **Correo de Cancelación** - Diseño gris neutral e informativo

---

## 🚀 Próximos Pasos Posibles

1. **Correo de recordatorio** 24 horas antes del evento
2. **Correo de confirmación de asistencia** después del evento
3. **Notificaciones de cambios** en el evento (fecha, ubicación, etc.)
4. **Resumen semanal/mensual** de eventos inscritos
5. **Correo de bienvenida mejorado** con guía de uso de la app

---

**Fecha de implementación**: 24 de octubre de 2025  
**Estado**: ✅ Completado y listo para usar

