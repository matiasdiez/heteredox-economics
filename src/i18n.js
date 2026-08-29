// Internationalization (i18n) Module for Heterodox RSS
// Supported languages: 'es' (Spanish, default), 'en' (English), 'fr' (French)

export const SUPPORTED_LANGUAGES = {
  es: { code: "ES", label: "Español", locale: "es-ES" },
  en: { code: "EN", label: "English", locale: "en-US" },
  fr: { code: "FR", label: "Français", locale: "fr-FR" }
};

export const DEFAULT_LANGUAGE = "es";

export const categoryTranslations = {
  "Journals": {
    es: "Revistas Académicas",
    en: "Academic Journals",
    fr: "Revues Académiques"
  },
  "Books and Book Series": {
    es: "Libros y Colecciones",
    en: "Books and Book Series",
    fr: "Livres et Collections"
  },
  "Call for Papers": {
    es: "Call for Papers",
    en: "Call for Papers",
    fr: "Appels à Contributions"
  },
  "Call for Participants": {
    es: "Convocatoria a Participantes",
    en: "Call for Participants",
    fr: "Appels à Participants"
  },
  "Job Postings": {
    es: "Ofertas de Empleo",
    en: "Job Postings",
    fr: "Offres d'Emploi"
  },
  "Heterodox Graduate Programs, Scholarships and Grants": {
    es: "Posgrados, Becas y Ayudas",
    en: "Graduate Programs, Scholarships & Grants",
    fr: "Programmes de Master/Doctorat, Bourses et Subventions"
  },
  "For Your Information": {
    es: "Información General",
    en: "For Your Information",
    fr: "Pour Information"
  },
  "Awards": {
    es: "Premios y Galardones",
    en: "Awards",
    fr: "Prix et Distinctions"
  },
  "Conference Papers, Reports, and Podcasts": {
    es: "Ponencias, Informes y Podcasts",
    en: "Conference Papers, Reports & Podcasts",
    fr: "Articles de Conférence, Rapports et Podcasts"
  },
  "Calls for Support": {
    es: "Llamamientos de Apoyo",
    en: "Calls for Support",
    fr: "Appels à Soutien"
  },
  "Heterodox Economics in the Media": {
    es: "Economía Heterodoxa en los Medios",
    en: "Heterodox Economics in the Media",
    fr: "L'Économie Hétérodoxe dans les Médias"
  },
  "Newsletters": {
    es: "Boletines",
    en: "Newsletters",
    fr: "Bulletins d'Information"
  },
  "Ph.D Dissertations in Heterodox Economics": {
    es: "Tesis Doctorales en Economía Heterodoxa",
    en: "Ph.D Dissertations in Heterodox Economics",
    fr: "Thèses de Doctorat en Économie Hétérodoxe"
  }
};

export const translations = {
  es: {
    // Page Meta
    "page.title": "Heterodox RSS - Portal de Feeds de Heterodox Economics Newsletter",
    "page.meta_desc": "Servicio de RSS automatizado y buscador académico para Heterodox Economics Newsletter. Call for papers, revistas, libros y ofertas laborales.",

    // Brand & Header
    "brand.subtitle": "Heterodox Economics Newsletter Feed",
    "nav.latest_issue_label": "Última edición:",
    "nav.zotero_btn": "Zotero",
    "nav.zotero_title": "Configurar conexión con tu biblioteca de Zotero",
    "nav.zotero_dot_connected": "Zotero conectado y sincronizado",
    "nav.zotero_dot_disconnected": "Zotero no configurado (haz clic para conectar)",
    "nav.theme_toggle_title": "Cambiar tema (Claro / Oscuro)",
    "nav.lang_toggle_title": "Cambiar idioma (Español / English / Français)",
    "nav.official_site": "Sitio Oficial",
    "nav.official_site_title": "Visitar el sitio web oficial de Heterodox Economics Newsletter",

    // Toasts
    "toast.copied": "¡Copiado al portapapeles!",
    "toast.feed_url_copied": "¡URL del feed copiada al portapapeles!",
    "toast.dark_mode": "Modo oscuro activado 🌙",
    "toast.light_mode": "Modo claro activado ☀️",
    "toast.zotero_saved": "¡Guardado con éxito en tu biblioteca de Zotero! 📚",
    "toast.zotero_sync_success": "¡Biblioteca de Zotero sincronizada! 🔄",
    "toast.zotero_configured": "¡Zotero configurado correctamente! 🎉",
    "toast.zotero_disconnected": "Conexión con Zotero desvinculada.",
    "toast.zotero_key_error": "Error de acceso: Verifica tu API Key de Zotero.",
    "toast.zotero_save_error": "Error al guardar en Zotero ({status})",
    "toast.zotero_network_error": "Error de conexión con los servidores de Zotero.",

    // Hero Section
    "hero.badge": "Actualizado automáticamente con GitHub Actions",
    "hero.title_pre": "Heterodox Economics Newsletter en formato",
    "hero.description": "Suscríbete en tu lector de noticias favorito para recibir <strong>nuevos artículos y papers de revistas académicas</strong>, convocatorias (<em>Call for Papers</em>), novedades editoriales y oportunidades laborales.",
    "hero.stat_articles": "Artículos Indexados",
    "hero.stat_journals": "Revistas Académicas",
    "hero.stat_cfps": "Call for Papers",
    "hero.stat_issues": "Ediciones Históricas",

    // Feed Subscription Cards
    "hero.feed1_title": "Por Edición Completa",
    "hero.feed1_sub": "1 entrada por newsletter",
    "hero.feed1_desc": "Ideal si prefieres leer el editorial completo y la tabla de contenidos agrupada en cada entrega quincenal.",
    "hero.feed2_title": "Revistas y Nuevos Artículos",
    "hero.feed2_sub": "Sumarios y papers indexados",
    "hero.feed2_badge": "Nuevo",
    "hero.feed2_desc": "Recibe cada nuevo artículo académico, sumario (TOC) y número especial publicado en revistas de economía crítica.",
    "hero.feed3_title": "Feed Granular por Entrada",
    "hero.feed3_sub": "1 entrada por cada artículo o CFP",
    "hero.feed3_desc": "Recibe alertas individuales por cada artículo publicado o convocatoria, con seguimiento directo de plazos y filtros por categorías.",
    "hero.copy_btn": "Copiar",
    "hero.copied_btn": "¡Copiado!",
    "hero.copy_title": "Copiar URL",
    "hero.view_xml_title": "Ver XML",

    // Additional Category Feeds Bar
    "hero.other_feeds_label": "Otros feeds directos:",
    "hero.feed_cfp": "📣 Call for Papers",
    "hero.feed_cfp_title": "Feed XML de Call for Papers",
    "hero.feed_jobs": "💼 Ofertas de Empleo",
    "hero.feed_jobs_title": "Feed XML de Ofertas de Empleo",
    "hero.feed_books": "📚 Libros",
    "hero.feed_books_title": "Feed XML de Libros",

    // Editorial Section
    "editorial.title": "Nota Editorial:",
    "editorial.latest_issue_badge": "Última Edición",
    "editorial.issue_prefix": "Edición #{num}",
    "editorial.loading": "Cargando nota editorial...",
    "editorial.empty": "Sin nota editorial disponible para esta entrega.",

    // Filter & Search Controls
    "search.placeholder": "Buscar por revista, palabra clave, autor o convocatoria...",
    "search.clear_title": "Limpiar búsqueda",
    "filters.all_issues": "Todas las ediciones",
    "filters.issue_option": "Edición #{num} ({date})",
    "sort.title": "Ordenar resultados",
    "sort.recent": "⏱️ Más recientes",
    "sort.deadline": "📅 Próximos plazos",
    "sort.issue_desc": "🔢 Edición (Desc)",
    "sort.title_asc": "🔤 Título (A-Z)",
    "view.grid_title": "Vista Grilla (Tarjetas)",
    "view.list_title": "Vista Lista Compacta",
    "categories.heading": "Categorías:",
    "categories.all": "Todos",
    "filters.reset_btn": "Restablecer todo",
    "filters.reset_title": "Restablecer todos los filtros aplicados",

    // Results Bar
    "results.loading": "Cargando convocatorias...",
    "results.count_singular": "1 resultado encontrado",
    "results.count_plural": "{count} resultados encontrados",
    "results.active_category": "Categoría: {cat}",
    "results.last_updated": "Actualizado:",

    // Articles & Convocatorias Cards / Rows
    "card.deadline": "Plazo: {date}",
    "card.open_btn": "Abrir",
    "card.open_title": "Abrir enlace directo",
    "card.newsletter_btn": "En newsletter",
    "card.newsletter_row_btn": "Newsletter",
    "card.newsletter_title": "Ver contexto en newsletter",
    "card.zotero_save_btn": "Zotero",
    "card.zotero_save_title": "Guardar en mi biblioteca de Zotero",
    "card.zotero_saved_btn": "En Zotero",
    "card.zotero_saved_title": "Este artículo ya está guardado en tu biblioteca de Zotero",
    "card.zotero_saving": "Guardando...",
    "card.issue_format": "Ed. #{num} • {date}",
    "card.published_in": "Publicado en {journal}. Autor(es): {author}.",
    "card.author_unspecified": "No especificado",

    // Empty / Error States
    "empty.title": "No se encontraron convocatorias o artículos",
    "empty.desc": "Prueba ajustando los filtros de categoría o el término de búsqueda.",
    "empty.reset_btn": "Restablecer todos los filtros",
    "error.data_load": "No se pudieron cargar los datos del feed. Por favor refresca la página.",

    // RSS Readers Quick Setup Guide
    "guide.title": "¿Cómo añadir el feed a tu lector de noticias favorito?",
    "guide.subtitle": "Copia cualquiera de las URLs de arriba e incorpórala a tu aplicación:",
    "guide.app1_title": "NetNewsWire / Reeder",
    "guide.app1_desc": "Pulsa <strong>+</strong> (Add Feed), pega la URL directa y organízalo en tu carpeta de Economía.",
    "guide.app2_title": "Inoreader / Feedly",
    "guide.app2_desc": "Pega la URL en la barra de búsqueda superior y haz clic en <em>Subscribe / Seguir</em>.",
    "guide.app3_title": "Thunderbird / Outlook",
    "guide.app3_desc": "Crea una suscripción en la carpeta de <em>Blogs & Feeds</em> y pega el enlace del XML.",
    "guide.app4_title": "Slack / Bots Telegram",
    "guide.app4_desc": "Usa <code>/feed subscribe &lt;URL&gt;</code> en Slack o bots RSS en Telegram y Discord.",

    // Footer
    "footer.line1": "Contenidos originales editados por <strong>Heterodox Economics Newsletter</strong> (Jakob Kapeller y consorcio internacional).",
    "footer.line2": "Portal de código abierto para difusión de convocatorias y bibliografía de economía crítica.",

    // Zotero Modal
    "zotero.modal_title": "Configuración de Zotero",
    "zotero.modal_subtitle": "Guarda artículos en tu biblioteca con 1 clic",
    "zotero.modal_close_title": "Cerrar ventana",
    "zotero.guide_heading": "¿Cómo obtener tus credenciales en 30 segundos?",
    "zotero.guide_step1": "Abre <a href=\"https://www.zotero.org/settings/keys\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary font-bold underline\">zotero.org/settings/keys</a> en tu navegador.",
    "zotero.guide_step2": "Copia tu <strong>User ID</strong> numérico (arriba de la página).",
    "zotero.guide_step3": "Haz clic en <em>\"Create new private key\"</em>, dale acceso de <strong>lectura/escritura</strong> y copia la clave generada.",
    "zotero.user_id_label": "Zotero User ID",
    "zotero.user_id_placeholder": "Ej: 8492019",
    "zotero.user_id_hint": "Identificador numérico de tu cuenta personal en Zotero.",
    "zotero.api_key_label": "Zotero API Key",
    "zotero.api_key_placeholder": "Ej: 2YxN8aBc...",
    "zotero.api_key_hint": "Clave de acceso privada con permiso de escritura (\"Allow write access\").",
    "zotero.api_key_toggle_title": "Mostrar / ocultar API key",
    "zotero.collection_label": "Colección / Carpeta (Opcional)",
    "zotero.collection_placeholder": "Clave de colección (ej: 8J2K9LM) o en blanco para la raíz",
    "zotero.collection_hint": "Si lo dejas en blanco, se guardará directamente en \"Mi biblioteca\" (My Library).",
    "zotero.sync_btn": "Sincronizar",
    "zotero.sync_btn_title": "Comprobar qué artículos de la web ya están en tu biblioteca de Zotero",
    "zotero.disconnect_btn": "Desconectar",
    "zotero.cancel_btn": "Cancelar",
    "zotero.save_btn": "Verificar y Guardar",
    "zotero.status_prompt_config": "Ingresa tu User ID y API Key de Zotero para activar el guardado directo en 1 clic.",
    "zotero.status_connected_msg": "Conectado (User ID: {userId}). {countStr}",
    "zotero.status_cached_refs": "{count} referencias detectadas en biblioteca.",
    "zotero.status_library_ready": "Biblioteca lista.",
    "zotero.status_syncing": "Sincronizando con tu biblioteca de Zotero...",
    "zotero.status_sync_ok": "¡Sincronización exitosa! ({count} ítems verificados en Zotero)",
    "zotero.status_sync_fail": "Error al sincronizar con Zotero ({status})",
    "zotero.status_unreachable": "No se pudo contactar con los servidores de Zotero.",
    "zotero.status_invalid_key": "La API Key ingresada no es válida o no tiene permisos de escritura.",
    "zotero.status_verifying": "Verificando credenciales con Zotero...",
    "zotero.status_verified": "¡Conexión verificada y credenciales guardadas con éxito!",
    "zotero.status_cleared": "Credenciales eliminadas de este navegador.",
    "zotero.status_missing_fields": "Por favor ingresa tanto el User ID como la API Key.",
    "zotero.err_unauthorized": "Clave API no autorizada o sin permisos suficientes.",
    "zotero.err_not_found": "User ID no encontrado en los registros de Zotero."
  },

  en: {
    // Page Meta
    "page.title": "Heterodox RSS - Heterodox Economics Newsletter Feed Portal",
    "page.meta_desc": "Automated RSS service and academic search portal for the Heterodox Economics Newsletter. Calls for papers, journals, books, and job opportunities.",

    // Brand & Header
    "brand.subtitle": "Heterodox Economics Newsletter Feed",
    "nav.latest_issue_label": "Latest issue:",
    "nav.zotero_btn": "Zotero",
    "nav.zotero_title": "Configure connection to your Zotero library",
    "nav.zotero_dot_connected": "Zotero connected and synced",
    "nav.zotero_dot_disconnected": "Zotero not configured (click to connect)",
    "nav.theme_toggle_title": "Toggle theme (Light / Dark)",
    "nav.lang_toggle_title": "Change language (Español / English / Français)",
    "nav.official_site": "Official Site",
    "nav.official_site_title": "Visit the official Heterodox Economics Newsletter website",

    // Toasts
    "toast.copied": "Copied to clipboard!",
    "toast.feed_url_copied": "Feed URL copied to clipboard!",
    "toast.dark_mode": "Dark mode enabled 🌙",
    "toast.light_mode": "Light mode enabled ☀️",
    "toast.zotero_saved": "Successfully saved to your Zotero library! 📚",
    "toast.zotero_sync_success": "Zotero library synced! 🔄",
    "toast.zotero_configured": "Zotero configured successfully! 🎉",
    "toast.zotero_disconnected": "Zotero connection disconnected.",
    "toast.zotero_key_error": "Access error: Check your Zotero API Key.",
    "toast.zotero_save_error": "Error saving to Zotero ({status})",
    "toast.zotero_network_error": "Connection error with Zotero servers.",

    // Hero Section
    "hero.badge": "Automatically updated with GitHub Actions",
    "hero.title_pre": "Heterodox Economics Newsletter in",
    "hero.description": "Subscribe in your favorite news reader to receive <strong>new academic journal articles and papers</strong>, announcements (<em>Call for Papers</em>), book releases, and job opportunities.",
    "hero.stat_articles": "Indexed Articles",
    "hero.stat_journals": "Academic Journals",
    "hero.stat_cfps": "Calls for Papers",
    "hero.stat_issues": "Archived Issues",

    // Feed Subscription Cards
    "hero.feed1_title": "Full Issue Feed",
    "hero.feed1_sub": "1 entry per newsletter issue",
    "hero.feed1_desc": "Ideal if you prefer reading the full editorial and grouped table of contents in each biweekly newsletter edition.",
    "hero.feed2_title": "Journals & New Articles",
    "hero.feed2_sub": "TOCs and indexed papers",
    "hero.feed2_badge": "New",
    "hero.feed2_desc": "Receive every new academic paper, table of contents (TOC), and special issue published in critical economics journals.",
    "hero.feed3_title": "Granular Item Feed",
    "hero.feed3_sub": "1 entry per article or CFP",
    "hero.feed3_desc": "Receive individual alerts for each published article or call, with direct deadline tracking and category filters.",
    "hero.copy_btn": "Copy",
    "hero.copied_btn": "Copied!",
    "hero.copy_title": "Copy URL",
    "hero.view_xml_title": "View XML",

    // Additional Category Feeds Bar
    "hero.other_feeds_label": "Other direct feeds:",
    "hero.feed_cfp": "📣 Calls for Papers",
    "hero.feed_cfp_title": "Calls for Papers XML Feed",
    "hero.feed_jobs": "💼 Job Opportunities",
    "hero.feed_jobs_title": "Job Opportunities XML Feed",
    "hero.feed_books": "📚 Books",
    "hero.feed_books_title": "Books XML Feed",

    // Editorial Section
    "editorial.title": "Editorial Note:",
    "editorial.latest_issue_badge": "Latest Issue",
    "editorial.issue_prefix": "Issue #{num}",
    "editorial.loading": "Loading editorial note...",
    "editorial.empty": "No editorial note available for this issue.",

    // Filter & Search Controls
    "search.placeholder": "Search by journal, keyword, author, or call for papers...",
    "search.clear_title": "Clear search",
    "filters.all_issues": "All issues",
    "filters.issue_option": "Issue #{num} ({date})",
    "sort.title": "Sort results",
    "sort.recent": "⏱️ Most recent",
    "sort.deadline": "📅 Upcoming deadlines",
    "sort.issue_desc": "🔢 Issue (Desc)",
    "sort.title_asc": "🔤 Title (A-Z)",
    "view.grid_title": "Grid View (Cards)",
    "view.list_title": "Compact List View",
    "categories.heading": "Categories:",
    "categories.all": "All",
    "filters.reset_btn": "Reset all",
    "filters.reset_title": "Reset all applied filters",

    // Results Bar
    "results.loading": "Loading announcements...",
    "results.count_singular": "1 result found",
    "results.count_plural": "{count} results found",
    "results.active_category": "Category: {cat}",
    "results.last_updated": "Updated:",

    // Articles & Convocatorias Cards / Rows
    "card.deadline": "Deadline: {date}",
    "card.open_btn": "Open",
    "card.open_title": "Open direct link",
    "card.newsletter_btn": "In newsletter",
    "card.newsletter_row_btn": "Newsletter",
    "card.newsletter_title": "View context in newsletter",
    "card.zotero_save_btn": "Zotero",
    "card.zotero_save_title": "Save to my Zotero library",
    "card.zotero_saved_btn": "In Zotero",
    "card.zotero_saved_title": "This item is already saved in your Zotero library",
    "card.zotero_saving": "Saving...",
    "card.issue_format": "Issue #{num} • {date}",
    "card.published_in": "Published in {journal}. Author(s): {author}.",
    "card.author_unspecified": "Not specified",

    // Empty / Error States
    "empty.title": "No announcements or articles found",
    "empty.desc": "Try adjusting the category filters or modifying your search terms.",
    "empty.reset_btn": "Reset all filters",
    "error.data_load": "Could not load feed data. Please refresh the page.",

    // RSS Readers Quick Setup Guide
    "guide.title": "How to add the feed to your favorite news reader?",
    "guide.subtitle": "Copy any of the URLs above and add it to your application:",
    "guide.app1_title": "NetNewsWire / Reeder",
    "guide.app1_desc": "Click <strong>+</strong> (Add Feed), paste the direct URL and organize it in your Economics folder.",
    "guide.app2_title": "Inoreader / Feedly",
    "guide.app2_desc": "Paste the URL into the top search bar and click <em>Subscribe / Follow</em>.",
    "guide.app3_title": "Thunderbird / Outlook",
    "guide.app3_desc": "Create a new subscription in your <em>Blogs & Feeds</em> folder and paste the XML link.",
    "guide.app4_title": "Slack / Telegram Bots",
    "guide.app4_desc": "Use <code>/feed subscribe &lt;URL&gt;</code> in Slack or RSS feed bots in Telegram and Discord.",

    // Footer
    "footer.line1": "Original contents edited by the <strong>Heterodox Economics Newsletter</strong> (Jakob Kapeller and international consortium).",
    "footer.line2": "Open-source portal for the dissemination of critical economics literature and academic calls.",

    // Zotero Modal
    "zotero.modal_title": "Zotero Settings",
    "zotero.modal_subtitle": "Save articles to your library in 1 click",
    "zotero.modal_close_title": "Close window",
    "zotero.guide_heading": "How to get your credentials in 30 seconds?",
    "zotero.guide_step1": "Open <a href=\"https://www.zotero.org/settings/keys\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary font-bold underline\">zotero.org/settings/keys</a> in your browser.",
    "zotero.guide_step2": "Copy your numeric <strong>User ID</strong> (shown at the top).",
    "zotero.guide_step3": "Click <em>\"Create new private key\"</em>, grant <strong>read/write access</strong>, and copy the generated key.",
    "zotero.user_id_label": "Zotero User ID",
    "zotero.user_id_placeholder": "e.g. 8492019",
    "zotero.user_id_hint": "Numeric identifier of your personal Zotero account.",
    "zotero.api_key_label": "Zotero API Key",
    "zotero.api_key_placeholder": "e.g. 2YxN8aBc...",
    "zotero.api_key_hint": "Private access key with write permission (\"Allow write access\").",
    "zotero.api_key_toggle_title": "Show / hide API key",
    "zotero.collection_label": "Collection / Folder (Optional)",
    "zotero.collection_placeholder": "Collection key (e.g. 8J2K9LM) or blank for root",
    "zotero.collection_hint": "If left blank, items will be saved directly to \"My Library\".",
    "zotero.sync_btn": "Sync",
    "zotero.sync_btn_title": "Check which web articles are already in your Zotero library",
    "zotero.disconnect_btn": "Disconnect",
    "zotero.cancel_btn": "Cancel",
    "zotero.save_btn": "Verify & Save",
    "zotero.status_prompt_config": "Enter your Zotero User ID and API Key to enable 1-click direct saving.",
    "zotero.status_connected_msg": "Connected (User ID: {userId}). {countStr}",
    "zotero.status_cached_refs": "{count} references detected in your library.",
    "zotero.status_library_ready": "Library ready.",
    "zotero.status_syncing": "Syncing with your Zotero library...",
    "zotero.status_sync_ok": "Sync successful! ({count} items verified in Zotero)",
    "zotero.status_sync_fail": "Error syncing with Zotero ({status})",
    "zotero.status_unreachable": "Could not contact Zotero servers.",
    "zotero.status_invalid_key": "The provided API Key is invalid or lacks write permissions.",
    "zotero.status_verifying": "Verifying credentials with Zotero...",
    "zotero.status_verified": "Connection verified and credentials saved successfully!",
    "zotero.status_cleared": "Credentials removed from this browser.",
    "zotero.status_missing_fields": "Please enter both User ID and API Key.",
    "zotero.err_unauthorized": "Unauthorized API key or insufficient permissions.",
    "zotero.err_not_found": "User ID not found in Zotero records."
  },

  fr: {
    // Page Meta
    "page.title": "Heterodox RSS - Portail de Flux de l'Infolettre Heterodox Economics",
    "page.meta_desc": "Service de flux RSS automatisé et moteur de recherche académique pour l'infolettre Heterodox Economics. Appels à contributions, revues, livres et offres d'emploi.",

    // Brand & Header
    "brand.subtitle": "Flux de l'infolettre Heterodox Economics",
    "nav.latest_issue_label": "Dernière édition :",
    "nav.zotero_btn": "Zotero",
    "nav.zotero_title": "Configurer la connexion à votre bibliothèque Zotero",
    "nav.zotero_dot_connected": "Zotero connecté et synchronisé",
    "nav.zotero_dot_disconnected": "Zotero non configuré (cliquez pour vous connecter)",
    "nav.theme_toggle_title": "Changer de thème (Clair / Sombre)",
    "nav.lang_toggle_title": "Changer de langue (Español / English / Français)",
    "nav.official_site": "Site Officiel",
    "nav.official_site_title": "Visiter le site officiel de Heterodox Economics Newsletter",

    // Toasts
    "toast.copied": "Copié dans le presse-papiers !",
    "toast.feed_url_copied": "URL du flux copiée dans le presse-papiers !",
    "toast.dark_mode": "Mode sombre activé 🌙",
    "toast.light_mode": "Mode clair activé ☀️",
    "toast.zotero_saved": "Enregistré avec succès dans votre bibliothèque Zotero ! 📚",
    "toast.zotero_sync_success": "Bibliothèque Zotero synchronisée ! 🔄",
    "toast.zotero_configured": "Zotero configuré avec succès ! 🎉",
    "toast.zotero_disconnected": "Connexion à Zotero déconnectée.",
    "toast.zotero_key_error": "Erreur d'accès : Vérifiez votre clé API Zotero.",
    "toast.zotero_save_error": "Erreur lors de l'enregistrement dans Zotero ({status})",
    "toast.zotero_network_error": "Erreur de connexion avec les serveurs Zotero.",

    // Hero Section
    "hero.badge": "Mis à jour automatiquement avec GitHub Actions",
    "hero.title_pre": "Heterodox Economics Newsletter au format",
    "hero.description": "Abonnez-vous dans votre lecteur de nouvelles préféré pour recevoir les <strong>nouveaux articles et revues académiques</strong>, les appels à contributions (<em>Call for Papers</em>), les parutions de livres et les offres d'emploi.",
    "hero.stat_articles": "Articles Indexés",
    "hero.stat_journals": "Revues Académiques",
    "hero.stat_cfps": "Appels à Contributions",
    "hero.stat_issues": "Éditions Historiques",

    // Feed Subscription Cards
    "hero.feed1_title": "Par Édition Complète",
    "hero.feed1_sub": "1 entrée par numéro de l'infolettre",
    "hero.feed1_desc": "Idéal si vous préférez lire l'éditorial complet et la table des matières regroupée à chaque parution bimensuelle.",
    "hero.feed2_title": "Revues et Nouveaux Articles",
    "hero.feed2_sub": "Sommaires et articles indexés",
    "hero.feed2_badge": "Nouveau",
    "hero.feed2_desc": "Recevez chaque nouvel article académique, sommaire (TOC) et numéro spécial publié dans des revues d'économie critique.",
    "hero.feed3_title": "Flux Granulaire par Entrée",
    "hero.feed3_sub": "1 entrée par article ou appel",
    "hero.feed3_desc": "Recevez des alertes individuelles pour chaque article publié ou appel, avec suivi direct des échéances et filtrage par catégorie.",
    "hero.copy_btn": "Copier",
    "hero.copied_btn": "Copié !",
    "hero.copy_title": "Copier l'URL",
    "hero.view_xml_title": "Voir le XML",

    // Additional Category Feeds Bar
    "hero.other_feeds_label": "Autres flux directs :",
    "hero.feed_cfp": "📣 Appels à Contributions",
    "hero.feed_cfp_title": "Flux XML des Appels à Contributions",
    "hero.feed_jobs": "💼 Offres d'Emploi",
    "hero.feed_jobs_title": "Flux XML des Offres d'Emploi",
    "hero.feed_books": "📚 Livres",
    "hero.feed_books_title": "Flux XML des Livres",

    // Editorial Section
    "editorial.title": "Note Éditoriale :",
    "editorial.latest_issue_badge": "Dernière Édition",
    "editorial.issue_prefix": "Édition #{num}",
    "editorial.loading": "Chargement de la note éditoriale...",
    "editorial.empty": "Aucune note éditoriale disponible pour ce numéro.",

    // Filter & Search Controls
    "search.placeholder": "Rechercher par revue, mot-clé, auteur ou appel à contributions...",
    "search.clear_title": "Effacer la recherche",
    "filters.all_issues": "Toutes les éditions",
    "filters.issue_option": "Édition #{num} ({date})",
    "sort.title": "Trier les résultats",
    "sort.recent": "⏱️ Plus récents",
    "sort.deadline": "📅 Échéances proches",
    "sort.issue_desc": "🔢 Édition (Desc)",
    "sort.title_asc": "🔤 Titre (A-Z)",
    "view.grid_title": "Vue Grille (Cartes)",
    "view.list_title": "Vue Liste Compacte",
    "categories.heading": "Catégories :",
    "categories.all": "Tous",
    "filters.reset_btn": "Tout réinitialiser",
    "filters.reset_title": "Réinitialiser tous les filtres appliqués",

    // Results Bar
    "results.loading": "Chargement des annonces...",
    "results.count_singular": "1 résultat trouvé",
    "results.count_plural": "{count} résultats trouvés",
    "results.active_category": "Catégorie : {cat}",
    "results.last_updated": "Mis à jour :",

    // Articles & Convocatorias Cards / Rows
    "card.deadline": "Date limite : {date}",
    "card.open_btn": "Ouvrir",
    "card.open_title": "Ouvrir le lien direct",
    "card.newsletter_btn": "Dans l'infolettre",
    "card.newsletter_row_btn": "Infolettre",
    "card.newsletter_title": "Voir le contexte dans l'infolettre",
    "card.zotero_save_btn": "Zotero",
    "card.zotero_save_title": "Enregistrer dans ma bibliothèque Zotero",
    "card.zotero_saved_btn": "Dans Zotero",
    "card.zotero_saved_title": "Cet article est déjà enregistré dans votre bibliothèque Zotero",
    "card.zotero_saving": "Enregistrement...",
    "card.issue_format": "Éd. #{num} • {date}",
    "card.published_in": "Publié dans {journal}. Auteur(s) : {author}.",
    "card.author_unspecified": "Non spécifié",

    // Empty / Error States
    "empty.title": "Aucune annonce ou article trouvé",
    "empty.desc": "Essayez d'ajuster les filtres de catégorie ou vos termes de recherche.",
    "empty.reset_btn": "Réinitialiser tous les filtres",
    "error.data_load": "Impossible de charger les données du flux. Veuillez actualiser la page.",

    // RSS Readers Quick Setup Guide
    "guide.title": "Comment ajouter le flux à votre lecteur de nouvelles préféré ?",
    "guide.subtitle": "Copiez l'une des URL ci-dessus et ajoutez-la à votre application :",
    "guide.app1_title": "NetNewsWire / Reeder",
    "guide.app1_desc": "Appuyez sur <strong>+</strong> (Add Feed), collez l'URL directe et classez-la dans votre dossier Économie.",
    "guide.app2_title": "Inoreader / Feedly",
    "guide.app2_desc": "Collez l'URL dans la barre de recherche supérieure et cliquez sur <em>Subscribe / S'abonner</em>.",
    "guide.app3_title": "Thunderbird / Outlook",
    "guide.app3_desc": "Créez un nouvel abonnement dans votre dossier <em>Blogs & Flux</em> et collez le lien XML.",
    "guide.app4_title": "Slack / Robots Telegram",
    "guide.app4_desc": "Utilisez <code>/feed subscribe &lt;URL&gt;</code> dans Slack ou des robots RSS dans Telegram et Discord.",

    // Footer
    "footer.line1": "Contenus originaux édités par <strong>Heterodox Economics Newsletter</strong> (Jakob Kapeller et consortium international).",
    "footer.line2": "Portail open-source pour la diffusion d'appels à contributions et de littérature d'économie critique.",

    // Zotero Modal
    "zotero.modal_title": "Configuration de Zotero",
    "zotero.modal_subtitle": "Enregistrez des articles dans votre bibliothèque en 1 clic",
    "zotero.modal_close_title": "Fermer la fenêtre",
    "zotero.guide_heading": "Comment obtenir vos identifiants en 30 secondes ?",
    "zotero.guide_step1": "Ouvrez <a href=\"https://www.zotero.org/settings/keys\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary font-bold underline\">zotero.org/settings/keys</a> dans votre navigateur.",
    "zotero.guide_step2": "Copiez votre <strong>User ID</strong> numérique (affiché en haut).",
    "zotero.guide_step3": "Cliquez sur <em>« Create new private key »</em>, accordez l'accès en <strong>lecture/écriture</strong> et copiez la clé générée.",
    "zotero.user_id_label": "Zotero User ID",
    "zotero.user_id_placeholder": "Ex : 8492019",
    "zotero.user_id_hint": "Identifiant numérique de votre compte personnel Zotero.",
    "zotero.api_key_label": "Zotero API Key",
    "zotero.api_key_placeholder": "Ex : 2YxN8aBc...",
    "zotero.api_key_hint": "Clé d'accès privée avec permission d'écriture (« Allow write access »).",
    "zotero.api_key_toggle_title": "Afficher / masquer la clé API",
    "zotero.collection_label": "Collection / Dossier (Optionnel)",
    "zotero.collection_placeholder": "Clé de collection (ex : 8J2K9LM) ou vide pour la racine",
    "zotero.collection_hint": "Si vous laissez ce champ vide, les éléments seront enregistrés dans « Ma bibliothèque ».",
    "zotero.sync_btn": "Synchroniser",
    "zotero.sync_btn_title": "Vérifier quels articles du site sont déjà dans votre bibliothèque Zotero",
    "zotero.disconnect_btn": "Déconnecter",
    "zotero.cancel_btn": "Annuler",
    "zotero.save_btn": "Vérifier et Enregistrer",
    "zotero.status_prompt_config": "Entrez votre identifiant utilisateur et votre clé API Zotero pour activer l'enregistrement direct en 1 clic.",
    "zotero.status_connected_msg": "Connecté (User ID : {userId}). {countStr}",
    "zotero.status_cached_refs": "{count} références détectées dans votre bibliothèque.",
    "zotero.status_library_ready": "Bibliothèque prête.",
    "zotero.status_syncing": "Synchronisation avec votre bibliothèque Zotero...",
    "zotero.status_sync_ok": "Synchronisation réussie ! ({count} éléments vérifiés dans Zotero)",
    "zotero.status_sync_fail": "Erreur lors de la synchronisation avec Zotero ({status})",
    "zotero.status_unreachable": "Impossible de contacter les serveurs Zotero.",
    "zotero.status_invalid_key": "La clé API fournie est invalide ou ne dispose pas des droits d'écriture.",
    "zotero.status_verifying": "Vérification des identifiants avec Zotero...",
    "zotero.status_verified": "Connexion vérifiée et identifiants enregistrés avec succès !",
    "zotero.status_cleared": "Identifiants supprimés de ce navigateur.",
    "zotero.status_missing_fields": "Veuillez saisir à la fois l'User ID et la clé API.",
    "zotero.err_unauthorized": "Clé API non autorisée ou autorisations insuffisantes.",
    "zotero.err_not_found": "User ID introuvable dans les registres de Zotero."
  }
};

let currentLanguage = localStorage.getItem("preferred_lang") || DEFAULT_LANGUAGE;
if (!SUPPORTED_LANGUAGES[currentLanguage]) {
  currentLanguage = DEFAULT_LANGUAGE;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (SUPPORTED_LANGUAGES[lang]) {
    currentLanguage = lang;
    localStorage.setItem("preferred_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    return true;
  }
  return false;
}

export function t(key, params = {}, lang = currentLanguage) {
  const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
  let text = dict[key] || translations[DEFAULT_LANGUAGE][key] || key;

  if (params && typeof params === "object") {
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
    });
  }

  return text;
}

export function translateCategory(catName, lang = currentLanguage) {
  if (!catName) return "";
  const match = categoryTranslations[catName];
  if (match && match[lang]) return match[lang];
  return catName;
}

export function formatLocaleDate(dateInput, lang = currentLanguage) {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const locale = SUPPORTED_LANGUAGES[lang]?.locale || "es-ES";
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatArticleDate(dateInput, lang = currentLanguage) {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const locale = SUPPORTED_LANGUAGES[lang]?.locale || "es-ES";
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatDeadlineDate(dateStr, lang = currentLanguage) {
  if (!dateStr || typeof dateStr !== "string") return dateStr || "";
  const clean = dateStr.trim();
  const d = Date.parse(clean);
  if (!isNaN(d)) {
    const locale = SUPPORTED_LANGUAGES[lang]?.locale || "es-ES";
    return new Date(d).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  return clean;
}

export function formatArticleBodyText(art, lang = currentLanguage) {
  if (!art) return "";
  let text = (art.body_text || "").trim();

  // Pattern 1: Spanish "Publicado en ... Autor(es): ..."
  const pubRegexEs = /^Publicado en\s+(.*?)\.\s+Autor\(es\):\s*(.*?)\.?$/i;
  const matchEs = text.match(pubRegexEs);
  if (matchEs) {
    const journal = matchEs[1].trim();
    let author = matchEs[2].trim();
    if (!author || author === "No especificado" || author === "Not specified" || author === "Non spécifié") {
      author = t("card.author_unspecified", {}, lang);
    }
    return t("card.published_in", { journal, author }, lang);
  }

  // Pattern 2: English "Published in ... Author(s): ..."
  const pubRegexEn = /^Published in\s+(.*?)\.\s+Author\(s\):\s*(.*?)\.?$/i;
  const matchEn = text.match(pubRegexEn);
  if (matchEn) {
    const journal = matchEn[1].trim();
    let author = matchEn[2].trim();
    if (!author || author === "No especificado" || author === "Not specified" || author === "Non spécifié") {
      author = t("card.author_unspecified", {}, lang);
    }
    return t("card.published_in", { journal, author }, lang);
  }

  // Pattern 3: French "Publié dans ... Auteur(s) : ..."
  const pubRegexFr = /^Publi[ée] dans\s+(.*?)\.\s+Auteur\(s\)\s*:\s*(.*?)\.?$/i;
  const matchFr = text.match(pubRegexFr);
  if (matchFr) {
    const journal = matchFr[1].trim();
    let author = matchFr[2].trim();
    if (!author || author === "No especificado" || author === "Not specified" || author === "Non spécifié") {
      author = t("card.author_unspecified", {}, lang);
    }
    return t("card.published_in", { journal, author }, lang);
  }

  // Fallback for journal category if body text is missing or generic
  if (art.category === "Journals" && (art.journal || art.author)) {
    const journal = art.journal || art.title || "";
    let author = art.author || "";
    if (!author || author === "No especificado" || author === "Not specified" || author === "Non spécifié") {
      author = t("card.author_unspecified", {}, lang);
    }
    return t("card.published_in", { journal, author }, lang);
  }

  return text;
}
