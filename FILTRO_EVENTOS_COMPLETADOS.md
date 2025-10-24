# 🚫 FILTRO DE EVENTOS COMPLETADOS EN EL DASHBOARD

## 📋 **PROBLEMA IDENTIFICADO**

El dashboard mostraba **eventos completados** (finalizados) en la lista de eventos disponibles para inscribirse, lo cual no tiene sentido porque los usuarios no pueden inscribirse a eventos que ya pasaron.

---

## ✅ **SOLUCIÓN APLICADA**

Se agregaron filtros en **2 repositorios del backend** para excluir automáticamente los eventos con `status = 'completed'` del dashboard.

---

## 🔧 **CAMBIOS REALIZADOS**

### **1. Repositorio de Autenticación**

**Archivo:** `eventconnect/backend/authentication/repositories/event.repository.ts`

**Método Modificado:** `getEventsWithOrganizer()`

**Línea 214:**
```typescript
WHERE e.status != 'completed'  // ✅ NUEVO FILTRO
```

**Query Completa:**
```sql
SELECT 
  e.*,
  CONCAT(u.first_name, ' ', u.last_name) as organizer_name,
  u.email as organizer_email,
  COALESCE(r.registered_count, 0) as registered_count
FROM events e
JOIN users u ON e.organizer_id = u.user_id
LEFT JOIN (
  SELECT event_id, COUNT(*) as registered_count
  FROM registrations 
  WHERE status = 'registered'
  GROUP BY event_id
) r ON e.event_id = r.event_id
WHERE e.status != 'completed'  -- ⚠️ FILTRO AGREGADO
ORDER BY e.created_at DESC
```

---

### **2. Repositorio de Eventos (con Filtros)**

**Archivo:** `eventconnect/backend/events/repositories/event.repository.ts`

**Método Modificado:** `findAllWithFilters()`

**Líneas 56-61:**
```typescript
// FILTRO PREDETERMINADO: Excluir eventos completados SIEMPRE (a menos que se solicite explícitamente)
// Esto asegura que el dashboard NUNCA muestre eventos finalizados para inscribirse
if (!filters.status || filters.status !== 'completed') {
  query += ` AND e.status != 'completed'`;
  console.log('🚫 Excluyendo eventos completados del dashboard');
}
```

**Lógica:**
- ✅ **Por defecto:** Excluye eventos completados
- ✅ **Excepciones:** Si el usuario explícitamente pasa `status: 'completed'` en los filtros, se mostrarán (útil para administradores)

---

## 📊 **COMPARACIÓN ANTES/DESPUÉS**

### **Antes:**
```json
{
  "success": true,
  "data": [
    {
      "event_id": 34,
      "title": "evento ciclismo UTA",
      "status": "completed",  // ❌ Aparecía en el dashboard
      "event_date": "2025-10-13T15:48:00.000Z"
    },
    {
      "event_id": 42,
      "title": "Curso de cocina",
      "status": "upcoming",  // ✅ OK
      "event_date": "2025-10-25T03:46:00.000Z"
    }
  ]
}
```

### **Ahora:**
```json
{
  "success": true,
  "data": [
    {
      "event_id": 42,
      "title": "Curso de cocina",
      "status": "upcoming",  // ✅ Solo eventos activos/próximos
      "event_date": "2025-10-25T03:46:00.000Z"
    }
  ]
}
```

---

## 🔍 **ENDPOINTS AFECTADOS**

### **1. GET `/api/events/with-organizer`**
- **Usado por:** Dashboard móvil (`app/(tabs)/index.tsx`)
- **Método Backend:** `eventRepository.getEventsWithOrganizer()`
- **Filtro:** ✅ `WHERE e.status != 'completed'`

### **2. GET `/api/events`** (con filtros)
- **Usado por:** Dashboard móvil con filtros avanzados
- **Método Backend:** `eventRepository.findAllWithFilters()`
- **Filtro:** ✅ Predeterminado (excluye completados salvo que se solicite)

---

## 🎯 **ESTADOS DE EVENTOS**

El sistema reconoce 3 estados de eventos:

| Estado | Descripción | ¿Aparece en Dashboard? |
|--------|-------------|------------------------|
| `upcoming` | Evento próximo (aún no inició) | ✅ **SÍ** |
| `in_progress` | Evento en curso (iniciado pero no finalizado) | ✅ **SÍ** |
| `completed` | Evento finalizado | ❌ **NO** (filtrado) |

---

## 🚀 **CÓMO SE ACTUALIZAN LOS ESTADOS**

Los estados de los eventos se actualizan automáticamente mediante el endpoint:

**PUT `/api/events/status/update`**

Este endpoint:
1. Revisa todos los eventos
2. Compara `event_date + duration` con la fecha/hora actual
3. Actualiza el estado según corresponda:
   - **Si** `ahora < event_date` → `upcoming`
   - **Si** `event_date <= ahora <= event_date + duration` → `in_progress`
   - **Si** `ahora > event_date + duration` → `completed`

**Ejemplo de lógica:**
```typescript
const eventDateTime = new Date(event.event_date);
const endDateTime = new Date(eventDateTime.getTime() + event.duration * 60000);

let newStatus = 'upcoming';
if (now >= eventDateTime && now <= endDateTime) {
  newStatus = 'in_progress';
} else if (now > endDateTime) {
  newStatus = 'completed';
}
```

---

## 🧪 **CÓMO PROBAR**

### **1. Reiniciar el Backend** ⚠️ **IMPORTANTE**

```bash
# Terminal del backend:
Ctrl + C
cd eventconnect/backend
npm start
```

### **2. Actualizar Estados de Eventos**

Puedes usar Postman o curl para actualizar los estados:

```bash
PUT http://localhost:3001/api/events/status/update
Authorization: Bearer <tu_token>
```

O desde el frontend de admin/dashboard.

### **3. Verificar en la App Móvil**

1. Abre la app móvil
2. Ve al tab "Eventos" (Dashboard)
3. **Verifica que:**
   - ✅ Solo aparecen eventos con estado `upcoming` o `in_progress`
   - ❌ **NO** aparecen eventos con estado `completed`

### **4. Logs del Backend**

Al listar eventos, deberías ver en la consola:

```
🚫 Excluyendo eventos completados del dashboard
✅ Retornando X eventos
```

---

## 📝 **NOTAS IMPORTANTES**

### **1. Eventos en "Mis Eventos"**

Los eventos completados **SÍ aparecen** en la pantalla "Mis Eventos" porque el usuario necesita ver su historial de eventos a los que asistió. Esta pantalla usa otro endpoint diferente.

### **2. Panel de Administración**

Los administradores pueden ver **todos los eventos** (incluidos completados) desde el panel de administración, ya que necesitan gestionar el historial completo.

### **3. Filtros Personalizados**

Si en el futuro se necesita mostrar eventos completados en el dashboard (por ejemplo, para ver un historial), se puede pasar el filtro:

```typescript
// Frontend
const result = await eventService.getEventsWithFilters({
  status: 'completed'  // Mostrar solo completados
});
```

---

## ✅ **RESUMEN DE BENEFICIOS**

1. ✅ **Mejor UX:** Los usuarios solo ven eventos a los que pueden inscribirse
2. ✅ **Evita confusión:** No hay eventos "pasados" en el dashboard
3. ✅ **Lógica consistente:** El estado del evento determina su visibilidad
4. ✅ **Flexible:** Se puede solicitar ver completados si es necesario
5. ✅ **Automático:** Los estados se actualizan automáticamente

---

## 🔄 **WORKFLOW COMPLETO**

```
1. Evento creado
   ↓
2. Estado: 'upcoming'
   ↓ (Aparece en dashboard)
3. Llega la fecha del evento
   ↓
4. Estado: 'in_progress'
   ↓ (Aún aparece en dashboard)
5. Termina el evento (fecha + duración)
   ↓
6. Estado: 'completed'
   ↓ (YA NO aparece en dashboard)
7. Permanece en "Mis Eventos" del usuario
```

---

## 📞 **ARCHIVOS MODIFICADOS**

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `eventconnect/backend/authentication/repositories/event.repository.ts` | 214 | Filtro en `getEventsWithOrganizer()` |
| `eventconnect/backend/events/repositories/event.repository.ts` | 56-61 | Filtro predeterminado en `findAllWithFilters()` |

---

## ✨ **RESULTADO FINAL**

**Ahora el dashboard SOLO muestra eventos activos o próximos.**  
**Los eventos completados ya NO aparecen para inscribirse.** 🎉

---

**¡Cambios listos para producción!** 🚀



