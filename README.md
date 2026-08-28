# 📰 HeterodoxRSS - Heterodox Economics Newsletter Feed & Portal

Servicio automatizado y portal web para convertir las publicaciones de [Heterodox Economics Newsletter](https://www.heterodoxnews.com/) en **feeds RSS** estandarizados y permitir la búsqueda y consulta interactiva de convocatorias académicas, revistas, libros y ofertas laborales.

Diseñado con **FlyonUI** + **Tailwind CSS**, empaquetado con **Vite** y automatizado con **GitHub Actions** para su despliegue gratuito en **GitHub Pages**.

---

## 🚀 Características Principales

- **Detección y extracción automática de nuevos números**: El scraper (`scripts/scraper.py`) consulta el archivo de HeterodoxNews y sondea nuevos números (`htn363.html`, `htn364.html`, etc.) de forma continua.
- **Múltiples Feeds RSS 2.0 listos para usar**:
  - `feed.xml`: **Feed por Edición Completa** — Cada entrada es una entrega del newsletter con su nota editorial íntegra y tabla de contenidos con enlaces.
  - `journals.xml`: **Feed Exclusivo de Journals y Revistas** — Solo nuevas publicaciones, sumarios y números especiales de revistas heterodoxas.
  - `articles.xml`: **Feed Granular General** — Cada entrada es un anuncio individual (*Call for Papers*, *Journals*, *Books*, *Job Postings*, *Awards*, etc.) con su fecha límite y ancla directa (`#art-...`).
  - `cfp.xml`, `jobs.xml`, `books.xml`: Feeds directos filtrados por categoría.
- **Portal Web con FlyonUI**:
  - Copia con 1 clic de las URLs de cada feed con confirmación visual.
  - Buscador en tiempo real por palabras clave, autores, universidades y temas.
  - Filtro interactivo por categorías y selector de números anteriores.
  - Lector integrado del editorial de la última edición.
  - Guía rápida para configurar el feed en lectores como NetNewsWire, Feedly, Inoreader, Thunderbird o canales de Slack/Discord.
  - Soporte de temas Claro/Oscuro (*Light / Dark*).
- **100% Serverless y Gratuito**: Corre periódicamente mediante un cron en GitHub Actions y se aloja en GitHub Pages.

---

## 📡 URLs de los Feeds

Una vez desplegado en GitHub Pages, los feeds estarán disponibles en:

- 📖 **Feed Solo Journals**: `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/journals.xml`
- 📰 **Feed por Edición Completa**: `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/feed.xml`
- 📣 **Feed Todas las Convocatorias**: `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/articles.xml`
- 🎯 **Feeds temáticos directos**:
  - `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/cfp.xml` (Call for Papers)
  - `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/jobs.xml` (Ofertas de Empleo)
  - `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/books.xml` (Libros)
- 💾 **Dataset JSON para desarrolladores**: `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/data.json`

---

## 🛠️ Estructura del Repositorio

```
economic-rss/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Workflow automático de GitHub Actions
├── scripts/
│   ├── scraper.py            # Extractor en Python y generador de RSS / JSON
│   └── requirements.txt      # Dependencias (beautifulsoup4, requests)
├── public/
│   ├── feed.xml              # RSS por edición (generado)
│   ├── articles.xml          # RSS por artículos (generado)
│   └── data.json             # Dataset estructurado (generado)
├── src/
│   ├── main.js               # Lógica interactiva del cliente
│   └── style.css             # Estilos de Tailwind CSS + FlyonUI
├── index.html                # Interfaz web principal
├── package.json              # Dependencias JS y scripts pnpm
├── vite.config.js            # Configuración de Vite para GitHub Pages
└── README.md
```

---

## 💻 Desarrollo Local

### Requisitos previos:
- Python 3.10+
- Node.js 20+
- `pnpm` (versión 10+)

### 1. Instalar dependencias

```bash
# Dependencias de Python
pip install -r scripts/requirements.txt

# Dependencias de Node con pnpm
pnpm install
```

### 2. Ejecutar el Scraper para actualizar feeds y datos

```bash
pnpm run scrape
# o directamente:
python3 scripts/scraper.py
```

### 3. Iniciar el servidor de desarrollo

```bash
pnpm dev
```
Abre tu navegador en `http://localhost:3000`.

### 4. Compilar para producción

```bash
pnpm build
pnpm preview
```

---

## ⚙️ Configuración para Despliegue en GitHub Pages

Para publicar tu web y los feeds en GitHub Pages:

1. **Subir el código a tu repositorio en GitHub** (rama `main`).
2. En GitHub, entra a **Settings** > **Pages** en tu repositorio.
3. En la sección **Build and deployment** > **Source**, selecciona **`GitHub Actions`**.
4. ¡Listo! Cada vez que hagas `git push` o cada día a las 06:00 UTC (según el cron programado en `.github/workflows/deploy.yml`), GitHub Actions:
   - Ejecutará el scraper para comprobar nuevos números.
   - Generará los feeds y compilará la web con Vite y FlyonUI.
   - Publicará el sitio actualizado en `https://<TU-USUARIO>.github.io/<NOMBRE-REPOSITORIO>/`.

---

## 📄 Créditos y Licencia

- Los contenidos y textos pertenecen a la publicación original de **[Heterodox Economics Newsletter](https://www.heterodoxnews.com/)** editada por Jakob Kapeller.
- Interfaz construida con [FlyonUI](https://flyonui.com/) y [Tailwind CSS](https://tailwindcss.com/).
- Código del scraper y portal liberado bajo licencia MIT.
