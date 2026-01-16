# Implementación de MFA/TOTP para Administradores

## 📋 Descripción

Este módulo implementa autenticación de dos factores (MFA) usando TOTP (Time-based One-Time Password) para el login de administradores. Los administradores pueden configurar Google Authenticator, Authy, Microsoft Authenticator u otra app compatible con TOTP.

## 🔧 Configuración de Base de Datos

1. Ejecuta el siguiente script SQL en Supabase SQL Editor:

```bash
backend/src/features/mfa/scripts/add_mfa_columns.sql
```

Este script agrega las siguientes columnas a la tabla `admins`:
- `mfa_secret`: Secreto TOTP en formato base32
- `mfa_habilitado`: Booleano que indica si MFA está activo
- `mfa_backup_codes`: JSON con códigos de respaldo

## 🚀 Uso

### Para Administradores

#### 1. Activar MFA

1. Iniciar sesión en el panel de administrador
2. Ir a Configuración de Seguridad (o el componente MFASettings)
3. Click en "Activar 2FA"
4. Escanear el código QR con tu app autenticadora
5. Ingresar el código de 6 dígitos para verificar
6. Guardar los códigos de respaldo en un lugar seguro

#### 2. Login con MFA

1. Ingresar email y contraseña normalmente
2. El sistema detectará que tienes MFA habilitado
3. Ingresar el código de 6 dígitos de tu app autenticadora
4. Acceso concedido

#### 3. Usar Códigos de Respaldo

Si pierdes acceso a tu dispositivo autenticador:
1. En la pantalla de verificación MFA, ingresa uno de tus códigos de respaldo de 8 dígitos
2. Cada código solo puede usarse una vez
3. Regenera nuevos códigos desde la configuración de seguridad

## 📁 Estructura de Archivos

### Backend

```
backend/src/features/mfa/
├── services/
│   └── mfaService.js           # Lógica de negocio MFA/TOTP
├── controllers/
│   └── mfaController.js        # Controladores de endpoints MFA
├── routes/
│   └── mfaRoutes.js           # Rutas API para MFA
└── scripts/
    └── add_mfa_columns.sql    # Script SQL para agregar columnas
```

### Frontend

```
frontend/src/features/mfa/
├── components/
│   ├── MFASetup.jsx           # Componente de configuración (QR, verificación)
│   ├── MFAVerification.jsx    # Componente de verificación en login
│   └── index.js
├── services/
│   └── mfaService.js          # API calls para MFA
└── index.js
```

### Componentes Admin Modificados

```
frontend/src/features/admin/
├── components/
│   ├── LoginAdminForm.jsx     # Modificado para soportar MFA
│   └── MFASettings.jsx        # Nuevo: Panel de configuración MFA
└── services/
    └── adminAuthService.js    # Modificado para manejar respuesta MFA
```

## 🔐 Flujo de Login con MFA

```
1. Usuario ingresa email/password
   ↓
2. Backend verifica credenciales
   ↓
3. ¿Tiene MFA habilitado?
   ├─ NO → Retorna token, login completo
   └─ SÍ → Retorna requiresMFA: true + adminId
           ↓
4. Frontend muestra componente MFAVerification
   ↓
5. Usuario ingresa código TOTP (6 dígitos) o código de respaldo (8 dígitos)
   ↓
6. Backend verifica el código
   ↓
7. Si es válido → Retorna token, login completo
   Si es inválido → Error, reintentar
```

## 🛠️ Dependencias Instaladas

### Backend
- `speakeasy`: Generación y verificación de códigos TOTP
- `qrcode`: Generación de códigos QR

```bash
npm install speakeasy qrcode helmet
```

## 📱 Apps Autenticadoras Compatibles

- Google Authenticator (Android/iOS)
- Microsoft Authenticator (Android/iOS)
- Authy (Android/iOS/Desktop)
- 1Password
- Bitwarden
- Cualquier app compatible con TOTP/RFC 6238

## 🔑 Códigos de Respaldo

- Se generan 10 códigos de respaldo al activar MFA
- Cada código tiene 8 dígitos
- Solo se pueden usar una vez
- Se pueden regenerar desde la configuración
- Importante guardarlos en un lugar seguro (offline)

## 📚 Referencias

- [RFC 6238 - TOTP](https://tools.ietf.org/html/rfc6238)
- [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy)
- [QRCode Documentation](https://github.com/soldair/node-qrcode)
