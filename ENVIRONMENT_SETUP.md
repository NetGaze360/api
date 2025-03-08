# Configuración del Entorno

Este documento explica cómo configurar las variables de entorno necesarias para ejecutar la API de NetGaze360.

## Archivos de Entorno

El proyecto utiliza archivos `.env` para gestionar la configuración según el entorno:

- `.env.development` - Configuración para desarrollo local
- `.env.production` - Configuración para entorno de producción

**IMPORTANTE: Nunca subas estos archivos al repositorio, ya que contienen secretos.**

## Configuración Inicial

1. Copia el archivo `.env.template` para crear tus archivos de configuración:

```bash
# Para desarrollo
cp .env.template .env.development

# Para producción
cp .env.template .env.production
```

2. Edita los archivos y establece los valores correctos para cada entorno.

## Generación de Secretos

Para los tokens JWT, debes generar secretos fuertes. Puedes usar Node.js para esto:

```javascript
// Ejecuta en la consola de Node.js
require('crypto').randomBytes(64).toString('hex')
```

Usa diferentes valores para ACCESS_TOKEN_SECRET y REFRESH_TOKEN_SECRET, y diferentes valores para cada entorno.

## Variables Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| NODE_ENV | Entorno de ejecución | development, production |
| PORT | Puerto donde se ejecutará la API | 5000 |
| MONGO_URI | URL de conexión a MongoDB | mongodb://localhost:27017/ng360 |
| ACCESS_TOKEN_SECRET | Secreto para firmar access tokens | (valor hexadecimal largo) |
| REFRESH_TOKEN_SECRET | Secreto para firmar refresh tokens | (valor hexadecimal largo) |
| CLIENT_ORIGIN | URL del frontend para CORS | http://localhost:3000 |

## Consideraciones de Seguridad

- En producción, considera usar un gestor de secretos en lugar de archivos .env
- Asegúrate de que `.env.*` esté en tu `.gitignore`
- Rota los secretos periódicamente
- Nunca compartas tus secretos, ni siquiera con otros desarrolladores del equipo