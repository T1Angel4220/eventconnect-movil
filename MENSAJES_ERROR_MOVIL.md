# 📱 Mensajes de Error en la App Móvil - Event Connect

## 📋 Resumen

Este documento detalla **TODOS** los mensajes de error que pueden aparecer en la aplicación móvil, las acciones que los generan y cómo se muestran al usuario.

---

## 🎯 Tipos de Mensajes

La app móvil utiliza:
1. **`IOSAlert`** - Alertas estándar de iOS para errores y confirmaciones
2. **`IOSSuccessAlert`** - Alertas de éxito/error con animaciones
3. **`ErrorMessage`** - Componente de error reutilizable con botón de reintento

---

## 📱 Pantalla: Detalles de Evento (`event/[id].tsx`)

### 1. Error al Cargar el Evento

**Acción que lo genera:**
- Al abrir un evento que no existe
- Error en la respuesta del servidor

**Mensaje:**
```
Título: "Error"
Mensaje: "No se pudo cargar el evento"
Botón: "Volver"
```

**Código (líneas 83-94):**
```typescript
setAlertConfig({
  visible: true,
  title: "Error",
  message: result.message || "No se pudo cargar el evento",
  buttons: [
    {
      text: "Volver",
      style: "cancel",
      onPress: () => router.back(),
    },
  ],
});
```

---

### 2. Error de Conexión

**Acción que lo genera:**
- Al cargar un evento sin conexión a internet
- Backend no disponible

**Mensaje:**
```
Título: "Error de Conexión"
Mensaje: "No se pudo conectar con el servidor. Verifica tu conexión."
Botón: "Volver"
```

**Código (líneas 98-109):**
```typescript
setAlertConfig({
  visible: true,
  title: "Error de Conexión",
  message: "No se pudo conectar con el servidor. Verifica tu conexión.",
  buttons: [
    {
      text: "Volver",
      style: "cancel",
      onPress: () => router.back(),
    },
  ],
});
```

---

### 3. Confirmación de Inscripción

**Acción que lo genera:**
- Al presionar el botón "Inscribirse al Evento"

**Mensaje:**
```
Título: "Confirmar Inscripción"
Mensaje: "¿Estás seguro de que deseas inscribirte a "{nombre_evento}"?"
Botones: "Cancelar" | "Inscribirme"
```

**Código (líneas 142-158):**
```typescript
setAlertConfig({
  visible: true,
  title: "Confirmar Inscripción",
  message: `¿Estás seguro de que deseas inscribirte a "${event.title}"?`,
  buttons: [
    {
      text: "Cancelar",
      style: "cancel",
    },
    {
      text: "Inscribirme",
      style: "default",
      onPress: () => confirmRegistration(),
    },
  ],
});
```

---

### 4. Inscripción Exitosa

**Acción que lo genera:**
- Después de inscribirse exitosamente a un evento

**Mensaje:**
```
Título: "¡Inscripción Exitosa!"
Mensaje: "Te has inscrito correctamente al evento. Podrás ver tus eventos en la pestaña 'Mis Eventos'."
Botones: "Ver Mis Eventos" | "Cerrar"
```

**Código (líneas 184-206):**
```typescript
setAlertConfig({
  visible: true,
  title: "¡Inscripción Exitosa!",
  message: "Te has inscrito correctamente al evento. Podrás ver tus eventos en la pestaña 'Mis Eventos'.",
  buttons: [
    {
      text: "Mis Eventos",
      style: "default",
      onPress: () => {
        setAlertConfig({ ...alertConfig, visible: false });
        router.push("/(tabs)/my-events");
      },
    },
    {
      text: "Cerrar",
      style: "cancel",
      onPress: () => {
        setAlertConfig({ ...alertConfig, visible: false });
        router.back();
      },
    },
  ],
});
```

---

### 5. Error al Inscribirse

**Acción que lo genera:**
- Cuando el backend rechaza la inscripción (ya inscrito, evento lleno, etc.)

**Mensaje:**
```
Título: "Error al Inscribirse"
Mensaje: [Mensaje del backend] o "No se pudo completar la inscripción"
Botón: "OK"
```

**Posibles mensajes del backend:**
- "El usuario ya está inscrito en este evento"
- "El evento ha alcanzado su capacidad máxima"
- "Usuario no autenticado"

**Código (líneas 209-214):**
```typescript
setAlertConfig({
  visible: true,
  title: "Error al Inscribirse",
  message: result.message || "No se pudo completar la inscripción",
  buttons: [{ text: "OK", style: "cancel" }],
});
```

---

### 6. Error Inesperado en Inscripción

**Acción que lo genera:**
- Error de red durante el proceso de inscripción
- Excepción no controlada

**Mensaje:**
```
Título: "Error"
Mensaje: "Ocurrió un error inesperado. Por favor, intenta nuevamente."
Botón: "OK"
```

**Código (líneas 218-223):**
```typescript
setAlertConfig({
  visible: true,
  title: "Error",
  message: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
  buttons: [{ text: "OK", style: "cancel" }],
});
```

---

## 📝 Pantalla: Mis Eventos (`my-events.tsx`)

### 7. Error al Cargar Eventos

**Acción que lo genera:**
- Al cargar la lista de eventos inscritos
- Error del servidor

**Mensaje:**
```
Componente ErrorMessage:
Mensaje: "Error al cargar tus eventos"
Botón: "Reintentar"
```

**Código (líneas 62):**
```typescript
setError("Error al cargar tus eventos");
```

---

### 8. Error de Conexión al Cargar Eventos

**Acción que lo genera:**
- Sin conexión a internet al cargar eventos

**Mensaje:**
```
Componente ErrorMessage:
Mensaje: "Error al conectar con el servidor"
Botón: "Reintentar"
```

**Código (líneas 66):**
```typescript
setError("Error al conectar con el servidor");
```

---

### 9. Confirmación de Cancelación de Inscripción

**Acción que lo genera:**
- Al presionar "Cancelar Inscripción" en un evento

**Mensaje:**
```
Título: "Cancelar Inscripción"
Mensaje: "¿Estás seguro que deseas cancelar tu inscripción a:

"{nombre_evento}"

Esta acción liberará tu cupo y no podrás recuperarlo si el evento se llena."
Botones: "No, mantener" | "Sí, cancelar"
```

**Código (líneas 336-355):**
```typescript
<IOSAlert
  visible={showCancelAlert}
  title="Cancelar Inscripción"
  message={`¿Estás seguro que deseas cancelar tu inscripción a:\n\n"${selectedRegistration?.title}"\n\nEsta acción liberará tu cupo y no podrás recuperarlo si el evento se llena.`}
  buttons={[
    {
      text: "No, mantener",
      style: "cancel",
      onPress: () => {
        setShowCancelAlert(false);
        setSelectedRegistration(null);
      },
    },
    {
      text: isCanceling ? "Cancelando..." : "Sí, cancelar",
      style: "destructive",
      onPress: confirmCancellation,
      loading: isCanceling,
    },
  ]}
  isLoading={isCanceling}
/>
```

---

### 10. Cancelación Exitosa

**Acción que lo genera:**
- Después de cancelar exitosamente una inscripción

**Mensaje:**
```
Tipo: IOSSuccessAlert (Verde con ícono ✓)
Título: "¡Inscripción Cancelada!"
Mensaje: "Tu inscripción ha sido cancelada exitosamente. El cupo está ahora disponible para otros participantes."
Botón: "Entendido"
Duración: Auto-cierra en 3 segundos
```

**Código (líneas 358-367):**
```typescript
<IOSSuccessAlert
  visible={showSuccessAlert}
  type="success"
  title="¡Inscripción Cancelada!"
  message="Tu inscripción ha sido cancelada exitosamente. El cupo está ahora disponible para otros participantes."
  onClose={() => setShowSuccessAlert(false)}
  autoClose={true}
  autoCloseDuration={3000}
  buttonText="Entendido"
/>
```

---

### 11. Error al Cancelar Inscripción

**Acción que lo genera:**
- Error del backend al intentar cancelar

**Mensaje:**
```
[Se establece en estado 'error' y se muestra en la UI]
Mensaje: [Mensaje del backend] o "No se pudo cancelar"
```

**Posibles mensajes del backend:**
- "ID de inscripción inválido"
- "Usuario no autenticado"
- "Inscripción no encontrada"
- "No tienes permiso para cancelar esta inscripción"
- "Esta inscripción ya fue cancelada"

**Código (líneas 105):**
```typescript
setError(result.message || "No se pudo cancelar");
```

---

### 12. Error Inesperado al Cancelar

**Acción que lo genera:**
- Error de red o excepción durante cancelación

**Mensaje:**
```
[Se establece en estado 'error']
Mensaje: "No se pudo cancelar la inscripción"
```

**Código (líneas 109):**
```typescript
setError("No se pudo cancelar la inscripción");
```

---

### 13. Lista Vacía

**Acción que lo genera:**
- Usuario no tiene eventos inscritos

**Mensaje:**
```
Título: "No tienes eventos"
Subtítulo: "Explora los eventos disponibles y regístrate en los que te interesen"
[Icono de calendario grande]
```

**Código (líneas 293-301):**
```typescript
const ListEmpty = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="calendar-outline" size={80} color={getIOSColor(IOS_COLORS.label.quaternary, isDark)} />
    <Text style={styles.emptyTitle}>No tienes eventos</Text>
    <Text style={styles.emptySubtitle}>
      Explora los eventos disponibles y regístrate en los que te interesen
    </Text>
  </View>
);
```

---

## 🌐 Pantalla: Dashboard de Eventos (`(tabs)/index.tsx`)

### 14. Error al Cargar Eventos del Dashboard

**Acción que lo genera:**
- Al cargar la lista principal de eventos
- Error del backend

**Mensaje:**
```
Componente ErrorMessage:
Mensaje: "Error al cargar eventos" o [mensaje del backend]
Botón: "Reintentar"
```

**Código (línea 85):**
```typescript
setError(result.message || "Error al cargar eventos");
```

---

### 15. Error de Conexión en Dashboard

**Acción que lo genera:**
- Sin internet al cargar eventos

**Mensaje:**
```
Componente ErrorMessage:
Mensaje: "Error al conectar con el servidor"
Botón: "Reintentar"
```

**Código (línea 89):**
```typescript
setError("Error al conectar con el servidor");
```

---

## 🔧 Servicio API (`src/services/api.ts`)

### Mensajes de Error Genéricos del Helper `getErrorMessage`

#### 16. Error 401 - No Autorizado

**Acción que lo genera:**
- Token expirado o inválido
- Intentar acceder sin estar autenticado

**Mensaje:**
```
"No autorizado. Por favor inicia sesión nuevamente."
```

**Código (líneas 122-124):**
```typescript
if (error.response?.status === 401) {
  return 'No autorizado. Por favor inicia sesión nuevamente.';
}
```

---

#### 17. Error 403 - Sin Permisos

**Acción que lo genera:**
- Intentar acceder a recursos sin permisos

**Mensaje:**
```
"No tienes permisos para realizar esta acción."
```

**Código (líneas 126-128):**
```typescript
if (error.response?.status === 403) {
  return 'No tienes permisos para realizar esta acción.';
}
```

---

#### 18. Error 404 - Recurso No Encontrado

**Acción que lo genera:**
- Endpoint no existe
- Recurso eliminado

**Mensaje:**
```
"Recurso no encontrado."
```

**Código (líneas 130-132):**
```typescript
if (error.response?.status === 404) {
  return 'Recurso no encontrado.';
}
```

---

#### 19. Error 500 - Error del Servidor

**Acción que lo genera:**
- Error interno del servidor

**Mensaje:**
```
"Error del servidor. Por favor intenta más tarde."
```

**Código (líneas 134-136):**
```typescript
if (error.response?.status === 500) {
  return 'Error del servidor. Por favor intenta más tarde.';
}
```

---

#### 20. Error de Red - Sin Respuesta

**Acción que lo genera:**
- Backend no disponible
- Sin conexión a internet

**Mensaje:**
```
"No se pudo conectar con el servidor. Verifica tu conexión."
```

**Código (líneas 138-140):**
```typescript
if (!error.response) {
  return 'No se pudo conectar con el servidor. Verifica tu conexión.';
}
```

---

#### 21. Error Genérico

**Acción que lo genera:**
- Cualquier otro error no contemplado

**Mensaje:**
```
"Ocurrió un error inesperado."
```

**Código (línea 149):**
```typescript
return 'Ocurrió un error inesperado.';
```

---

## 📊 Resumen por Pantalla

| Pantalla | Total Mensajes | Críticos | Informativos | Éxito |
|----------|----------------|----------|--------------|-------|
| **Detalles de Evento** | 6 | 3 | 2 | 1 |
| **Mis Eventos** | 7 | 4 | 2 | 1 |
| **Dashboard** | 2 | 2 | 0 | 0 |
| **API Helper** | 6 | 6 | 0 | 0 |
| **TOTAL** | **21** | **15** | **4** | **2** |

---

## 🎨 Tipos de Presentación

### 1. IOSAlert (Modal Estándar)
- Confirmaciones
- Errores críticos
- Acciones destructivas
- **Ejemplo:** Confirmar inscripción, confirmar cancelación

### 2. IOSSuccessAlert (Animado)
- Acciones exitosas
- Feedback visual positivo
- Auto-cierre opcional
- **Ejemplo:** Inscripción cancelada

### 3. ErrorMessage (Componente Inline)
- Errores al cargar pantallas
- Con botón de reintento
- **Ejemplo:** Error al cargar eventos

### 4. Loading (Pantalla Completa)
- Estados de carga
- **Ejemplo:** "Cargando detalles...", "Cargando tus eventos..."

---

## 🔍 Mensajes Específicos del Backend

### Inscripciones (registrationService)

| Error | Mensaje del Backend |
|-------|---------------------|
| Ya inscrito | "El usuario ya está inscrito en este evento" |
| Evento lleno | "El evento ha alcanzado su capacidad máxima" |
| No autenticado | "Usuario no autenticado" |
| ID inválido | "El ID del evento es requerido" |
| Sin permisos | "No tienes permiso para cancelar esta inscripción" |
| Ya cancelada | "Esta inscripción ya fue cancelada" |
| No encontrada | "Inscripción no encontrada" |

---

## 💡 Mejores Prácticas Implementadas

1. ✅ **Mensajes claros y descriptivos**
   - Los usuarios entienden qué sucedió

2. ✅ **Botones de acción relevantes**
   - "Volver", "Reintentar", "Ver Mis Eventos"

3. ✅ **Feedback visual**
   - Colores: Rojo para errores, Verde para éxito
   - Iconos apropiados

4. ✅ **Estados de carga**
   - Loading states durante operaciones
   - "Inscribiendo...", "Cancelando..."

5. ✅ **Prevención de errores**
   - Confirmaciones antes de acciones destructivas
   - Validaciones en frontend

6. ✅ **Consistencia con iOS**
   - Diseño y comportamiento nativo
   - Transiciones suaves

---

## 📧 Mensajes de Correo (Backend)

Cuando se realizan acciones exitosas, el usuario también recibe correos:

### Al Inscribirse:
```
Asunto: ✅ Confirmación de Inscripción - [Nombre del Evento]
Contenido: Correo HTML profesional con detalles del evento
```

### Al Cancelar:
```
Asunto: ✖️ Cancelación de Inscripción - [Nombre del Evento]
Contenido: Correo HTML informativo sobre la cancelación
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Toast Notifications** - Mensajes menos intrusivos para acciones secundarias
2. **Validaciones en Tiempo Real** - Prevenir errores antes de enviar al backend
3. **Mensajes Contextuales** - Diferentes mensajes según el estado del usuario
4. **Modo Offline** - Mensajes específicos para modo sin conexión
5. **Logging Mejorado** - Enviar errores a servicio de analytics

---

**Fecha de documentación**: 24 de octubre de 2025  
**Estado**: ✅ Completo y actualizado

