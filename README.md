# 📊 KasHIO NPS — Encuesta de Satisfacción

Sistema completo de encuesta NPS para KasHIO: formulario animado + dashboard de resultados en tiempo real, conectado a Google Sheets.

---

## 🗂 Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Encuesta pública (para clientes) |
| `dashboard.html` | Dashboard de resultados (interno) |
| `apps-script.js` | Backend en Google Apps Script |

---

## 🚀 Deploy (GitHub + Cloudflare Pages)

### 1. Subir cambios a GitHub
```bash
# Editá cualquier archivo directamente en GitHub
# o usá git si tenés el repo clonado localmente:
git add .
git commit -m "descripción del cambio"
git push
```
Cloudflare Pages detecta el push y despliega automáticamente en ~30 segundos.

### 2. Ver el sitio
- **Encuesta:** `https://kashio-nps.pages.dev`
- **Dashboard:** `https://kashio-nps.pages.dev/dashboard.html`

### 3. Link personalizado por cliente
```
https://kashio-nps.pages.dev?cliente=NombreEmpresa
```

---

## ⚙️ Configuración inicial

### Google Apps Script
1. Abrí tu Google Sheet → **Extensiones → Apps Script**
2. Pegá el contenido de `apps-script.js`
3. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Acceso: **Cualquier usuario**
4. Copiá la URL generada

### Conectar la URL al proyecto
En `index.html` y `dashboard.html`, reemplazá la constante:
```javascript
const SHEETS_URL = "https://script.google.com/macros/s/TU_URL_AQUI/exec";
const SCRIPT_URL = "https://script.google.com/macros/s/TU_URL_AQUI/exec";
```

---

## 📐 Arquitectura

```
Cliente
  └── index.html (Cloudflare Pages)
        └── GET ?param=valor → Apps Script
              └── Google Sheets (guarda respuesta)

Equipo KasHIO
  └── dashboard.html (Cloudflare Pages)
        └── GET ?action=getData → Apps Script
              └── Google Sheets (lee todos los datos)
```

---

## 📊 Campos del Google Sheet

| Columna | Descripción |
|---|---|
| Fecha | Timestamp de la respuesta |
| Cliente | Nombre de empresa ingresado |
| P1 - Gestiones de cobranza | Calificación 0-10 |
| P2 - Continuidad del servicio | Calificación 0-10 |
| P3 - Atención de soporte | Calificación 0-10 |
| P4 - Satisfacción general | Calificación 0-10 |
| P5 - NPS (Recomendación) | Calificación 0-10 |
| Categoría NPS | Promotor / Pasivo / Detractor |
| Comentario | Texto libre (opcional) |

---

## 🏷 Categorías NPS

| Puntaje | Categoría interna | Categoría Sheet |
|---|---|---|
| 9 – 10 | 😍 KasHIO Lover | Promotor |
| 7 – 8 | 😐 Pasivo | Pasivo |
| 0 – 6 | 😡 KasHIO Challenger | Detractor |

**Fórmula NPS:**
```
NPS = (% KasHIO Lovers) - (% KasHIO Challengers)
Rango: -100 a 100
```

---

## 🔗 Links útiles

- [Google Apps Script](https://script.google.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Google Sheets](https://docs.google.com/spreadsheets/d/1gIlpYE1t6tek4SkUntbvONtDuKBg0Cl6XF3k7cxsLD4)

---

KasHIO &copy; 2026
