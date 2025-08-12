# Configuración de Envío de Emails

Este proyecto utiliza **Nodemailer** para enviar emails desde los formularios de contacto, solicitudes de asociación y devoluciones.

## 📧 Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura las siguientes variables:

```bash
# Configuración SMTP
SMTP_HOST=smtp.gmail.com              # Servidor SMTP
SMTP_PORT=587                         # Puerto (587 para TLS, 465 para SSL)
SMTP_SECURE=false                     # true para puerto 465, false para otros
SMTP_USER=tu-email@gmail.com          # Tu email
SMTP_PASS=tu-contraseña               # Tu contraseña o app password
SMTP_FROM=system@jehnsonsupply.com    # Email remitente (opcional)
```

### 2. Proveedores de Email Comunes

#### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password  # Usar App Password, no la contraseña normal
```

**⚠️ Para Gmail:** Necesitas crear una "App Password" en tu cuenta de Google:
1. Ir a Google Account Settings
2. Security → 2-Step Verification → App passwords
3. Generar una contraseña para "Mail"

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

#### Otros Proveedores
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **iCloud:** `smtp.mail.me.com:587`
- **Custom/Business:** Consulta con tu proveedor

### 3. Configuración en siteConfig.ts

Los emails se envían a la dirección configurada en:

```typescript
// src/config/siteConfig.ts
contact: {
  email: {
    admin: "admin@jhensonsupply.com",  // ← Aquí llegan los emails
    system: "system@jehnsonsupply.com" // Email del sistema
  }
}
```

## 🚀 Tipos de Formularios

El sistema maneja 3 tipos de formularios:

### 1. Contacto (`/contact`)
- Formulario de contacto general
- Incluye: nombre, email, teléfono, asunto, mensaje

### 2. Solicitud de Asociación (`/supply`)
- Para negocios que quieren ser distribuidores
- Incluye: datos del negocio, RNC, tipo, volumen de compra, etc.

### 3. Devoluciones (`/returns`)
- Solicitudes de devolución de productos
- Incluye: número de pedido, producto, motivo, etc.

## 🔧 API Endpoint

**POST** `/api/send-email`

```json
{
  "type": "contact|supply|return",
  "formData": {
    // Datos del formulario específico
  }
}
```

## 🛡️ Seguridad

- Las credenciales SMTP se almacenan en variables de entorno
- Los emails incluyen validación del lado del servidor
- Se verifica la conexión SMTP antes de enviar
- Manejo de errores robusto

## 📝 Logs

El sistema registra:
- Emails enviados exitosamente (con messageId)
- Errores de configuración SMTP
- Errores de envío

## 🧪 Testing

Para probar el sistema:

1. Configura las variables de entorno
2. Inicia el servidor: `pnpm dev`
3. Ve a `/contact`, `/supply`, o `/returns`
4. Completa y envía un formulario
5. Verifica que el email llegue a `admin@jhensonsupply.com`

## ⚠️ Troubleshooting

### Error: "Authentication failed"
- Verifica usuario y contraseña SMTP
- Para Gmail, usa App Password en lugar de contraseña normal

### Error: "Connection timeout"
- Verifica el host y puerto SMTP
- Algunos ISPs bloquean puertos de email

### Error: "Missing SMTP configuration"
- Asegúrate de tener todas las variables de entorno configuradas
- Reinicia el servidor después de cambiar `.env.local`

### Error: "Invalid sender address"
- Verifica que el email en `SMTP_USER` sea válido
- Algunos proveedores requieren que `SMTP_FROM` coincida con `SMTP_USER`
