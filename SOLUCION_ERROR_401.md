# 🔧 Solución al Error 401 "Usuario no autenticado"

## 🚨 **Problema**
Al intentar inscribirse a un evento, aparece el error:
```
Error al Inscribirse
Usuario no autenticado
```

Con el código de error en la consola:
```
POST /registrations {"status":401,"data":{"success":false,"message":"Usuario no autenticado"}}
```

---

## 🔍 **Causa del Problema**

El error 401 significa que el **token JWT no está llegando al backend**. Posibles causas:

1. ✅ El token no se guardó correctamente al hacer login
2. ✅ El token expiró (JWT expira en 1 hora)
3. ✅ AsyncStorage no está devolviendo el token
4. ✅ El interceptor no está agregando el header Authorization

---

## 🛠️ **SOLUCIÓN INMEDIATA**

### **Paso 1: Cierra sesión y vuelve a iniciar sesión**

Esto es lo más probable que solucione el problema:

1. Ve al tab **"Perfil"**
2. Presiona **"Cerrar Sesión"**
3. Confirma
4. Vuelve a **iniciar sesión**
5. Intenta inscribirte nuevamente

**¿Por qué funciona?** El token JWT expira después de 1 hora. Si iniciaste sesión hace más de 1 hora, el token ya no es válido.

---

## 🔍 **DIAGNÓSTICO DETALLADO**

He agregado logs más detallados para diagnosticar el problema. Ahora cuando intentes iniciar sesión o hacer una petición, verás en la consola:

### **Al hacer Login:**
```
🔐 Iniciando login...
✅ Login exitoso, guardando token...
🔑 Token recibido: eyJhbGciOiJIUzI1NiIs...
✅ Token guardado correctamente en AsyncStorage
🔑 Token verificado: eyJhbGciOiJIUzI1NiIs...
```

### **Al hacer una petición (inscripción):**
```
🔑 Token encontrado: eyJhbGciOiJIUzI1NiIs...
📡 POST /registrations {event_id: 1}
🔐 Authorization header: Presente
```

### **Si NO hay token:**
```
⚠️ No hay token disponible para /registrations
📡 POST /registrations {event_id: 1}
🔐 Authorization header: Ausente
```

---

## 📱 **PASOS PARA DIAGNOSTICAR**

### **1. Verifica los logs al hacer login**

1. Cierra sesión si estás logueado
2. Abre la consola de React Native (terminal donde corre `npm start`)
3. Inicia sesión
4. Busca estos mensajes:
   - ✅ `Token guardado correctamente en AsyncStorage` → **BIEN**
   - ❌ `Token NO se guardó en AsyncStorage` → **PROBLEMA**

### **2. Verifica los logs al inscribirte**

1. Ve a un evento
2. Intenta inscribirte
3. Busca estos mensajes en la consola:
   - ✅ `Token encontrado: eyJ...` → **BIEN**
   - ✅ `Authorization header: Presente` → **BIEN**
   - ❌ `No hay token disponible` → **PROBLEMA**
   - ❌ `Authorization header: Ausente` → **PROBLEMA**

---

## 🔧 **SOLUCIONES SEGÚN EL PROBLEMA**

### **Problema 1: Token no se guarda al hacer login**

**Síntoma:**
```
❌ ERROR: Token NO se guardó en AsyncStorage
```

**Solución:**
```bash
# Limpia el cache de la app
cd eventconnect-movil
npx expo start --clear
```

---

### **Problema 2: Token no se encuentra al hacer peticiones**

**Síntoma:**
```
⚠️ No hay token disponible para /registrations
🔐 Authorization header: Ausente
```

**Solución:**

1. Verifica que hayas iniciado sesión correctamente
2. Cierra la app completamente (no solo minimizar)
3. Vuelve a abrirla
4. Intenta nuevamente

---

### **Problema 3: Token expiró**

**Síntoma:**
- Iniciaste sesión hace más de 1 hora
- Error 401 al intentar cualquier acción

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- El token se renueva automáticamente

---

### **Problema 4: Backend no está corriendo**

**Síntoma:**
```
⚠️ No se recibió respuesta del servidor
```

**Solución:**
```bash
# Inicia el backend
cd eventconnect/backend
npm start

# Debe mostrar:
✅ Servidor corriendo en puerto 3001
```

---

## 🔄 **MEJORA IMPLEMENTADA: Auto-Logout en 401**

He mejorado el código para que ahora cuando recibas un error 401, la app automáticamente te cierre la sesión y te redirija al login.

### **Antes:**
```
Error 401 → Usuario confundido → ¿Qué hago?
```

### **Ahora:**
```
Error 401 → Auto-logout → Redirige a login → Usuario vuelve a iniciar sesión
```

---

## 🧪 **PRUEBAS A REALIZAR**

### **Prueba 1: Login y verificación de token**

```bash
1. Abre la consola del terminal
2. Cierra sesión en la app
3. Inicia sesión
4. Verifica en la consola:
   ✅ "Token guardado correctamente"
5. Ve a un evento
6. Intenta inscribirte
7. Verifica en la consola:
   ✅ "Token encontrado"
   ✅ "Authorization header: Presente"
8. Deberías poder inscribirte exitosamente
```

### **Prueba 2: Token expirado (simulación)**

```bash
1. Inicia sesión
2. Espera 5 minutos (o más de 1 hora para que expire)
3. Intenta inscribirte
4. Si el token expiró:
   - Verás error 401
   - Cierra sesión y vuelve a iniciar
```

---

## 📊 **INFORMACIÓN TÉCNICA**

### **Flujo Normal (Sin Error)**
```
1. Usuario hace login
2. Backend retorna token JWT
3. Token se guarda en AsyncStorage
4. Usuario intenta inscribirse
5. Interceptor de axios obtiene token de AsyncStorage
6. Interceptor agrega header: Authorization: Bearer <token>
7. Backend valida token
8. ✅ Inscripción exitosa
```

### **Flujo con Error 401**
```
1. Usuario hace login (hace 2 horas)
2. Token guardado (pero ya expiró)
3. Usuario intenta inscribirse
4. Interceptor obtiene token expirado
5. Interceptor agrega header con token expirado
6. Backend valida token → ❌ EXPIRADO
7. Backend retorna 401 Unauthorized
8. App muestra error
```

---

## 🎯 **CHECKLIST DE VERIFICACIÓN**

Antes de pedir ayuda, verifica:

- [ ] El backend está corriendo (`npm start` en `eventconnect/backend`)
- [ ] Puedes hacer login (ves el dashboard después de login)
- [ ] Iniciaste sesión hace menos de 1 hora
- [ ] La consola muestra "Token guardado correctamente"
- [ ] La consola muestra "Token encontrado" al inscribirte
- [ ] La IP en `src/constants/config.ts` es correcta
- [ ] Tu teléfono y PC están en la misma red WiFi

---

## 🔐 **CONFIGURACIÓN DEL TOKEN JWT**

El token JWT tiene esta configuración en el backend:

```typescript
// eventconnect/backend/config/env.ts
jwt: {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h' // ⚠️ Token expira en 1 hora
}
```

**Esto significa:**
- Si inicias sesión a las 10:00 AM
- El token expira a las 11:00 AM
- Después de las 11:00 AM, recibirás error 401
- **Solución:** Volver a iniciar sesión

---

## 💡 **CONSEJOS**

1. **Cierra sesión al terminar de usar la app** para evitar tokens expirados
2. **No dejes la app abierta mucho tiempo sin usar**
3. **Si ves error 401, simplemente vuelve a iniciar sesión**
4. **Los logs te dirán exactamente qué está pasando**

---

## 🐛 **SI NADA FUNCIONA**

Si después de todo esto sigues con problemas:

1. **Limpia completamente el cache:**
```bash
cd eventconnect-movil
npx expo start --clear
# Presiona 'r' para reload
```

2. **Reinicia el backend:**
```bash
cd eventconnect/backend
# Ctrl+C para detener
npm start
```

3. **Reinstala AsyncStorage:**
```bash
cd eventconnect-movil
npm install @react-native-async-storage/async-storage
```

4. **Verifica que el backend esté en la IP correcta:**
```typescript
// src/constants/config.ts
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.3.5:3001/api'  // ⚠️ Verifica esta IP
  : 'https://tu-api-produccion.com/api';
```

---

## 📞 **LOGS IMPORTANTES A COMPARTIR**

Si necesitas ayuda, comparte estos logs:

1. **Al hacer login:**
```
🔐 Iniciando login...
✅ Login exitoso, guardando token...
🔑 Token recibido: [primeros 20 caracteres]
✅ Token guardado correctamente en AsyncStorage
```

2. **Al inscribirte:**
```
🔑 Token encontrado: [primeros 20 caracteres]
📡 POST /registrations
🔐 Authorization header: Presente/Ausente
❌ POST /registrations {"status":401...}
```

---

**¡Espero que esto solucione tu problema!** 🚀

En el 99% de los casos, **cerrar sesión y volver a iniciar sesión** soluciona el error 401.



