# ✅ SOLUCIÓN COMPLETA AL ERROR 401

## 🎯 **PROBLEMA IDENTIFICADO**

El error 401 "Usuario no autenticado" al inscribirse **NO era un problema del token**, sino un **bug en el backend**.

### **Causa Raíz:**

El controlador de inscripciones buscaba `user_id` (snake_case) pero el JWT contiene `userId` (camelCase).

```typescript
// ❌ ANTES (INCORRECTO):
const userId = (req as any).user?.user_id;  // undefined ❌

// ✅ AHORA (CORRECTO):
const userId = (req as any).user?.userId;   // 7 ✅
```

---

## 🔧 **CAMBIOS REALIZADOS**

### **Archivo Modificado:**
`eventconnect/backend/authentication/controllers/registration.controller.ts`

### **Líneas Corregidas:**
- **Línea 11**: `user?.user_id` → `user?.userId`
- **Línea 92**: `user?.user_id` → `user?.userId`

### **Logs Agregados:**
```typescript
console.log('🔍 Usuario desde JWT:', (req as any).user);
console.log('🆔 userId extraído:', userId);
```

---

## 🚀 **PASOS PARA APLICAR LA SOLUCIÓN**

### **1. Reinicia el Backend** ⚠️ **IMPORTANTE**

Los cambios en el código **no se aplican automáticamente**. Debes reiniciar el servidor:

```bash
# Opción 1: Si el backend está corriendo en el terminal
Ctrl + C   # Detener el servidor
npm start  # Iniciar nuevamente

# Opción 2: Si usas otra terminal
cd eventconnect/backend
npm start
```

**Verás en la consola:**
```
✅ Servidor corriendo en puerto 3001
```

---

### **2. Prueba la Inscripción**

1. Abre la app móvil
2. Ve a un evento
3. Presiona "Inscribirse al Evento"
4. Confirma

**Resultado Esperado:**
- ✅ "¡Inscripción Exitosa!"
- ✅ Contador de inscritos aumenta en 1

**En la consola del backend verás:**
```
🔍 Usuario desde JWT: { userId: 7, role: 'participant' }
🆔 userId extraído: 7
```

---

## 📊 **DIAGNÓSTICO TÉCNICO**

### **Por Qué Funcionaban Otras Peticiones:**

| Endpoint | ¿Funciona? | Razón |
|----------|------------|-------|
| GET /organizer/profile | ✅ | No usa `user_id` en el controlador |
| GET /events | ✅ | No requiere userId |
| GET /events/with-organizer | ✅ | No requiere userId |
| POST /registrations | ❌ | **Buscaba `user_id` incorrecto** |

### **Flujo del Error:**

```
1. Usuario hace login
2. Backend genera JWT: { userId: 7, role: 'participant' }
3. Token se guarda correctamente
4. Usuario intenta inscribirse
5. Token se envía correctamente con Authorization header
6. Backend decodifica JWT: { userId: 7, role: 'participant' }
7. Controlador busca: req.user?.user_id  ❌
8. Resultado: undefined
9. Validación falla: if (!userId) → true
10. Retorna 401: "Usuario no autenticado"
```

### **Flujo Corregido:**

```
1-6. [Igual que antes]
7. Controlador busca: req.user?.userId  ✅
8. Resultado: 7
9. Validación pasa: if (!userId) → false
10. Inscripción se crea exitosamente ✅
```

---

## 🧪 **VERIFICACIÓN**

### **Logs que deberías ver (Backend):**

**Antes del cambio:**
```
🔍 Usuario desde JWT: { userId: 7, role: 'participant' }
🆔 userId extraído: undefined  ❌
```

**Después del cambio:**
```
🔍 Usuario desde JWT: { userId: 7, role: 'participant' }
🆔 userId extraído: 7  ✅
```

### **Logs que deberías ver (App Móvil):**

```
🔑 Token encontrado: eyJhbGciOiJIUzI1NiIs...
📡 POST /registrations {"event_id": 42}
🔐 Authorization header: Presente
✅ POST /registrations {"success": true, "data": {...}}
✅ Inscripción exitosa
```

---

## 📝 **LECCIONES APRENDIDAS**

### **1. Consistencia en Naming Conventions**

El problema surgió por usar **diferentes convenciones** en diferentes partes del código:

- **JWT/Auth**: camelCase (`userId`)
- **Database/Models**: snake_case (`user_id`)

**Solución:** Al acceder al JWT, usar camelCase (`userId`). Al acceder a la DB, usar snake_case (`user_id`).

### **2. Logs de Debug**

Los logs agregados ayudan a identificar problemas rápidamente:

```typescript
console.log('🔍 Usuario desde JWT:', (req as any).user);
console.log('🆔 userId extraído:', userId);
```

### **3. Error 401 No Siempre Significa "Token Inválido"**

Puede significar:
- ✅ Token no se envía
- ✅ Token expiró
- ✅ Token inválido
- ✅ **Token válido pero datos mal extraídos** ← Este era el caso

---

## 🔍 **OTROS ARCHIVOS REVISADOS (Sin Problemas)**

- ✅ `auth.middleware.ts` - Decodifica JWT correctamente
- ✅ `api.ts` (móvil) - Envía token correctamente
- ✅ `authService.ts` (móvil) - Guarda token correctamente
- ✅ `registration.routes.ts` - Aplica middleware correctamente

---

## 💡 **SI AÚN TIENES PROBLEMAS**

### **1. Verifica que el backend se haya reiniciado:**
```bash
# Deberías ver en la consola:
Servidor corriendo en puerto 3001
```

### **2. Limpia la caché de la app:**
```bash
cd eventconnect-movil
npx expo start --clear
```

### **3. Verifica los logs del backend:**

Deberías ver cuando intentas inscribirte:
```
🔍 Usuario desde JWT: { userId: 7, role: 'participant' }
🆔 userId extraído: 7
```

Si ves `undefined`, el backend **no se reinició** correctamente.

---

## 📞 **RESUMEN EJECUTIVO**

| Aspecto | Detalles |
|---------|----------|
| **Problema** | Bug en controlador de inscripciones |
| **Causa** | `user_id` vs `userId` (snake_case vs camelCase) |
| **Solución** | Cambiar `user?.user_id` → `user?.userId` |
| **Archivos Modificados** | 1 archivo (registration.controller.ts) |
| **Líneas Cambiadas** | 2 líneas (11 y 92) |
| **Acción Requerida** | **Reiniciar backend** |
| **Tiempo Estimado** | 1 minuto |

---

## ✅ **CHECKLIST FINAL**

Antes de probar, verifica:

- [ ] Guardaste los cambios en `registration.controller.ts`
- [ ] Reiniciaste el backend (`Ctrl+C` + `npm start`)
- [ ] El backend muestra "Servidor corriendo en puerto 3001"
- [ ] La app móvil está conectada a la misma red WiFi
- [ ] Iniciaste sesión en la app móvil

Si todos los checks están ✅, **la inscripción debería funcionar perfectamente**.

---

**¡El bug está corregido!** 🎉

Solo falta **reiniciar el backend** y probar.



