import "./style.css";
import "flyonui/flyonui";

// Application State
let dataset = null;
let currentCategory = "ALL";
let currentIssue = "ALL";
let searchQuery = "";
let sortBy = "recent";
let viewMode = localStorage.getItem("viewMode") || "grid";

// Determine Initial Theme (localStorage -> system preference -> default light)
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
let currentTheme = storedTheme || (prefersDark ? "dark" : "light");

// Apply Initial Theme
document.documentElement.setAttribute("data-theme", currentTheme);

// DOM Elements
const articlesContainer = document.getElementById("articles-container");
const categoryFiltersContainer = document.getElementById("category-filters");
const issueSelect = document.getElementById("issue-select");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const resultsCountEl = document.getElementById("results-count");
const activeCategoryIndicator = document.getElementById("active-category-indicator");
const resetAllFiltersBtn = document.getElementById("reset-all-filters-btn");
const latestIssueBadge = document.getElementById("latest-issue-badge");
const lastUpdatedEl = document.getElementById("last-updated");
const editorialContent = document.getElementById("editorial-content");
const editorialIssueNum = document.getElementById("editorial-issue-num");
const editorialDate = document.getElementById("editorial-date");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIconSun = document.getElementById("theme-icon-sun");
const themeIconMoon = document.getElementById("theme-icon-moon");
const toastEl = document.getElementById("toast-notification");
const toastMessageEl = document.getElementById("toast-message");
const viewGridBtn = document.getElementById("view-grid-btn");
const viewListBtn = document.getElementById("view-list-btn");

// Zotero DOM Elements & State
const zoteroModal = document.getElementById("zotero-modal");
const zoteroModalTrigger = document.getElementById("zotero-modal-trigger");
const zoteroModalCloseBtn = document.getElementById("zotero-modal-close-btn");
const zoteroCancelBtn = document.getElementById("zotero-cancel-btn");
const zoteroConfigForm = document.getElementById("zotero-config-form");
const zoteroUserIdInput = document.getElementById("zotero-user-id-input");
const zoteroApiKeyInput = document.getElementById("zotero-api-key-input");
const zoteroCollectionInput = document.getElementById("zotero-collection-input");
const zoteroToggleKeyBtn = document.getElementById("zotero-toggle-key-visibility");
const eyeIconOpen = document.getElementById("eye-icon-open");
const eyeIconClosed = document.getElementById("eye-icon-closed");
const zoteroStatusBox = document.getElementById("zotero-status-box");
const zoteroStatusIcon = document.getElementById("zotero-status-icon");
const zoteroStatusText = document.getElementById("zotero-status-text");
const zoteroDisconnectBtn = document.getElementById("zotero-disconnect-btn");
const zoteroSaveBtn = document.getElementById("zotero-save-btn");
const zoteroHeaderStatusDot = document.getElementById("zotero-header-status-dot");

let currentlyRenderedArticles = [];
const savedZoteroLinks = new Set();

// Top Stats Elements
const statTotalArticles = document.getElementById("stat-total-articles");
const statTotalJournals = document.getElementById("stat-total-journals");
const statTotalCfps = document.getElementById("stat-total-cfps");
const statTotalIssues = document.getElementById("stat-total-issues");

// RSS Feed Hub State & Definitions
const feedDefinitions = {
  issues: {
    filename: "feed.xml",
    label: "Edición Completa",
    description: "Feed por edición quincenal completa (editorial + tabla de contenidos agrupada en cada entrega)."
  },
  journals: {
    filename: "journals.xml",
    label: "Solo Revistas (Journals)",
    description: "Feed filtrado exclusivamente con nuevos números, sumarios y números especiales de revistas académicas."
  },
  cfp: {
    filename: "cfp.xml",
    label: "Call for Papers",
    description: "Feed dedicado a convocatorias de ponencias, conferencias y workshops con fechas límite."
  },
  jobs: {
    filename: "jobs.xml",
    label: "Ofertas de Empleo",
    description: "Feed filtrado con ofertas académicas, plazas postdoctorales, becas y vacantes docentes."
  },
  books: {
    filename: "books.xml",
    label: "Libros y Reseñas",
    description: "Feed con lanzamientos de novedades editoriales, series y libros de economía heterodoxa."
  },
  articles: {
    filename: "articles.xml",
    label: "Todo por Convocatoria / Artículo",
    description: "Feed granular individual para cada CFP, revista, libro o anuncio indexado."
  }
};

let activeFeedKey = "issues";

// Helper to get absolute feed URL
function getAbsoluteFeedUrl(filename) {
  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  return `${origin}${pathname}/${filename}`;
}

// Setup Feed URLs and Copy Buttons
function populateFeedUrls() {
  const issuesInput = document.getElementById("feed-issues-url");
  const journalsInput = document.getElementById("feed-journals-url");
  const articlesInput = document.getElementById("feed-articles-url");

  if (issuesInput) issuesInput.value = getAbsoluteFeedUrl("feed.xml");
  if (journalsInput) journalsInput.value = getAbsoluteFeedUrl("journals.xml");
  if (articlesInput) articlesInput.value = getAbsoluteFeedUrl("articles.xml");
}

function setupCopyButtons() {
  const copyButtons = document.querySelectorAll("[data-copy-target]");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;

      navigator.clipboard.writeText(targetInput.value).then(() => {
        showToast("¡URL del feed copiada al portapapeles!");
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>¡Copiado!</span>`;
        btn.classList.add("btn-success");
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove("btn-success");
        }, 2000);
      });
    });
  });
}

// Toast Feedback Notification
function showToast(message) {
  if (!toastEl) return;
  if (toastMessageEl) toastMessageEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => {
    toastEl.classList.remove("opacity-0", "translate-y-2");
    toastEl.classList.add("opacity-100", "translate-y-0");
  }, 10);

  setTimeout(() => {
    toastEl.classList.remove("opacity-100", "translate-y-0");
    toastEl.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toastEl.classList.add("hidden"), 300);
  }, 2500);
}

// Update Theme UI Icons
function updateThemeUI() {
  if (currentTheme === "dark") {
    if (themeIconSun) themeIconSun.classList.remove("hidden");
    if (themeIconMoon) themeIconMoon.classList.add("hidden");
  } else {
    if (themeIconSun) themeIconSun.classList.add("hidden");
    if (themeIconMoon) themeIconMoon.classList.remove("hidden");
  }
}

// Category Badge Color Map
function getCategoryBadgeClass(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("call for paper") || cat.includes("call for participant")) return "badge-cat-cfp";
  if (cat.includes("journal")) return "badge-cat-journal";
  if (cat.includes("book")) return "badge-cat-book";
  if (cat.includes("job")) return "badge-cat-job";
  if (cat.includes("award") || cat.includes("grant") || cat.includes("scholarship")) return "badge-cat-award";
  return "badge-cat-default";
}

// Check if article is eligible for Zotero (only Journals and Books/Book Series)
function isZoteroEligible(art) {
  if (!art || !art.category) return false;
  const cat = art.category.toLowerCase().trim();
  return cat === "journals" || cat.includes("journal") || cat.includes("book");
}

// Get Direct Article Link (for Books/Journals that have direct publisher links in external_links)
function getPrimaryArticleLink(art) {
  if (!art) return "#";
  if (art.external_links && art.external_links.length > 0) {
    const isNewsletterAnchor = (art.link || "").includes("heterodoxnews.com/n/htn");
    if (isNewsletterAnchor) {
      const extLink = art.external_links.find((l) => l.url && !l.url.includes("heterodoxnews.com"));
      if (extLink && extLink.url) return extLink.url;
    }
  }
  return art.link || art.newsletter_link || "#";
}

// Zotero API Integration Helpers
function getZoteroConfig() {
  const userId = (localStorage.getItem("zotero_user_id") || "").trim();
  const apiKey = (localStorage.getItem("zotero_api_key") || "").trim();
  const collectionKey = (localStorage.getItem("zotero_collection_key") || "").trim();
  return { userId, apiKey, collectionKey, isConfigured: Boolean(userId && apiKey) };
}

function updateZoteroHeaderUI() {
  const { isConfigured } = getZoteroConfig();
  if (zoteroHeaderStatusDot) {
    if (isConfigured) {
      zoteroHeaderStatusDot.className = "w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs";
      zoteroHeaderStatusDot.title = "Zotero conectado y listo para guardar";
    } else {
      zoteroHeaderStatusDot.className = "w-2 h-2 rounded-full bg-base-content/30 inline-block";
      zoteroHeaderStatusDot.title = "Zotero no configurado (haz clic para conectar)";
    }
  }
}

function openZoteroModal(prefillStatusMsg = null) {
  const { userId, apiKey, collectionKey, isConfigured } = getZoteroConfig();
  if (zoteroUserIdInput) zoteroUserIdInput.value = userId;
  if (zoteroApiKeyInput) zoteroApiKeyInput.value = apiKey;
  if (zoteroCollectionInput) zoteroCollectionInput.value = collectionKey;

  if (zoteroDisconnectBtn) {
    if (isConfigured) {
      zoteroDisconnectBtn.classList.remove("hidden");
    } else {
      zoteroDisconnectBtn.classList.add("hidden");
    }
  }

  if (prefillStatusMsg) {
    showZoteroModalStatus(prefillStatusMsg.text, prefillStatusMsg.type);
  } else if (isConfigured) {
    showZoteroModalStatus(`Conectado con tu biblioteca (User ID: ${userId})`, "success");
  } else {
    hideZoteroModalStatus();
  }

  if (zoteroModal && typeof zoteroModal.showModal === "function") {
    zoteroModal.showModal();
  }
}

function closeZoteroModal() {
  if (zoteroModal && typeof zoteroModal.close === "function") {
    zoteroModal.close();
  }
}

function showZoteroModalStatus(message, type = "info") {
  if (!zoteroStatusBox || !zoteroStatusText) return;
  zoteroStatusBox.classList.remove(
    "hidden",
    "bg-emerald-100",
    "text-emerald-900",
    "bg-error/15",
    "text-error",
    "bg-primary/10",
    "text-primary",
    "dark:bg-emerald-950/40",
    "dark:text-emerald-300"
  );

  if (type === "success") {
    zoteroStatusBox.classList.add("bg-emerald-100", "text-emerald-900", "dark:bg-emerald-950/40", "dark:text-emerald-300");
    if (zoteroStatusIcon) {
      zoteroStatusIcon.innerHTML = `<svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
    }
  } else if (type === "error") {
    zoteroStatusBox.classList.add("bg-error/15", "text-error");
    if (zoteroStatusIcon) {
      zoteroStatusIcon.innerHTML = `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }
  } else {
    zoteroStatusBox.classList.add("bg-primary/10", "text-primary");
    if (zoteroStatusIcon) {
      zoteroStatusIcon.innerHTML = `<svg class="w-4 h-4 animate-spin shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`;
    }
  }
  zoteroStatusText.textContent = message;
}

function hideZoteroModalStatus() {
  if (zoteroStatusBox) zoteroStatusBox.classList.add("hidden");
}

function parseCreators(authorStr) {
  if (!authorStr || typeof authorStr !== "string") return [];
  const parts = authorStr.split(/\s*(?:,| and | y | & )\s*/i).filter(Boolean);
  return parts.map((name) => {
    const clean = name.trim();
    const spaceIndex = clean.lastIndexOf(" ");
    if (spaceIndex > 0) {
      return {
        creatorType: "author",
        firstName: clean.substring(0, spaceIndex).trim(),
        lastName: clean.substring(spaceIndex + 1).trim()
      };
    }
    return {
      creatorType: "author",
      name: clean
    };
  });
}

function formatArticleForZotero(art, collectionKey) {
  const creators = parseCreators(art.author);
  const primaryLink = getPrimaryArticleLink(art);
  const tags = [
    { tag: "Heterodox Economics" },
    { tag: `Issue #${art.issue_num}` }
  ];
  if (art.category) tags.push({ tag: art.category });
  if (art.journal) tags.push({ tag: art.journal });

  const collections = collectionKey && collectionKey.trim() ? [collectionKey.trim()] : undefined;
  const isJournal = art.category === "Journals" || Boolean(art.journal);
  const isBook = (art.category || "").toLowerCase().includes("book");

  if (isJournal) {
    return {
      itemType: "journalArticle",
      title: art.title || "Sin título",
      creators: creators,
      publicationTitle: art.journal || "",
      date: art.issue_date || "",
      url: primaryLink,
      abstractNote: art.body_text || "",
      extra: `Newsletter Issue #${art.issue_num}\nContext: ${art.newsletter_link || art.link}${art.deadline ? `\nDeadline: ${art.deadline}` : ""}`,
      tags: tags,
      ...(collections ? { collections } : {})
    };
  }

  if (isBook) {
    return {
      itemType: "book",
      title: art.title || "Sin título",
      creators: creators,
      date: art.issue_date || "",
      url: primaryLink,
      abstractNote: art.body_text || "",
      extra: `Newsletter Issue #${art.issue_num}\nContext: ${art.newsletter_link || art.link}`,
      tags: tags,
      ...(collections ? { collections } : {})
    };
  }

  return {
    itemType: "webpage",
    title: art.title || "Sin título",
    creators: creators.length > 0 ? creators : undefined,
    websiteTitle: "Heterodox Economics Newsletter",
    date: art.issue_date || "",
    url: primaryLink,
    abstractNote: art.body_text || "",
    extra: `${art.deadline ? `Deadline: ${art.deadline}\n` : ""}Newsletter Issue #${art.issue_num}\nContext: ${art.newsletter_link || art.link}`,
    tags: tags,
    ...(collections ? { collections } : {})
  };
}


async function saveArticleToZotero(art, buttonEl) {
  const config = getZoteroConfig();
  if (!config.isConfigured) {
    openZoteroModal({
      text: "Ingresa tu User ID y API Key de Zotero para activar el guardado directo en 1 clic.",
      type: "info"
    });
    return;
  }

  const originalHtml = buttonEl.innerHTML;
  buttonEl.classList.add("btn-zotero-loading");
  buttonEl.disabled = true;
  buttonEl.innerHTML = `
    <svg class="w-3.5 h-3.5 animate-spin shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Guardando...</span>
  `;

  try {
    const payload = [formatArticleForZotero(art, config.collectionKey)];
    const res = await fetch(`https://api.zotero.org/users/${config.userId}/items`, {
      method: "POST",
      headers: {
        "Zotero-API-Key": config.apiKey,
        "Content-Type": "application/json",
        "Zotero-API-Version": "3"
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 201) {
      savedZoteroLinks.add(art.link);
      buttonEl.classList.remove("btn-zotero-loading");
      buttonEl.classList.add("btn-zotero-saved");
      buttonEl.disabled = true;
      buttonEl.innerHTML = `
        <svg class="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <span>¡Guardado!</span>
      `;
      showToast("¡Guardado con éxito en tu biblioteca de Zotero! 📚");
    } else if (res.status === 403 || res.status === 401) {
      buttonEl.disabled = false;
      buttonEl.classList.remove("btn-zotero-loading");
      buttonEl.innerHTML = originalHtml;
      showToast("Error de acceso: Verifica tu API Key de Zotero.");
      openZoteroModal({
        text: "La API Key ingresada no es válida o no tiene permisos de escritura.",
        type: "error"
      });
    } else {
      const errText = await res.text();
      console.error("Zotero API Error:", res.status, errText);
      buttonEl.disabled = false;
      buttonEl.classList.remove("btn-zotero-loading");
      buttonEl.innerHTML = originalHtml;
      showToast(`Error al guardar en Zotero (${res.status})`);
    }
  } catch (err) {
    console.error("Error connecting to Zotero API:", err);
    buttonEl.disabled = false;
    buttonEl.classList.remove("btn-zotero-loading");
    buttonEl.innerHTML = originalHtml;
    showToast("Error de conexión con los servidores de Zotero.");
  }
}


// Load Data
async function loadData() {
  try {
    const basePath = (import.meta.env.BASE_URL || "./").replace(/\/$/, "");
    const candidateUrls = [
      `${basePath}/data.json`,
      "./data.json",
      "data.json",
      "/data.json"
    ];

    let res = null;
    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          res = response;
          break;
        }
      } catch (e) {
        // try next candidate
      }
    }

    if (!res) throw new Error("No se pudo cargar data.json");
    dataset = await res.json();

    renderHeaderStats();
    renderEditorial();
    renderFilters();
    renderArticles();
  } catch (err) {
    console.error("Error loading data:", err);
    if (articlesContainer) {
      articlesContainer.innerHTML = `
        <div class="col-span-full alert alert-soft alert-error max-w-xl mx-auto my-8 border border-error/30">
          <p>No se pudieron cargar los datos del feed. Por favor refresca la página.</p>
        </div>
      `;
    }
  }
}

// Render Top Stats
function renderHeaderStats() {
  if (!dataset) return;
  const meta = dataset.metadata;
  if (latestIssueBadge && meta.latest_issue) {
    latestIssueBadge.textContent = `#${meta.latest_issue}`;
  }
  if (lastUpdatedEl && meta.updated_at) {
    const d = new Date(meta.updated_at);
    lastUpdatedEl.textContent = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (statTotalArticles && meta.total_articles_indexed) {
    statTotalArticles.textContent = Number(meta.total_articles_indexed).toLocaleString();
  }
  if (statTotalJournals && meta.total_journal_papers_indexed) {
    statTotalJournals.textContent = Number(meta.total_journal_papers_indexed).toLocaleString();
  }
  if (statTotalIssues && meta.total_issues_indexed) {
    statTotalIssues.textContent = meta.total_issues_indexed;
  }
  if (statTotalCfps && meta.categories_summary) {
    const cfpEntry = meta.categories_summary.find((c) => c.name.toLowerCase().includes("call for paper"));
    statTotalCfps.textContent = cfpEntry ? cfpEntry.count : meta.categories_summary.length;
  }
}

// Render Editorial Section
function renderEditorial() {
  if (!dataset || !dataset.issues || dataset.issues.length === 0) return;
  const latest = dataset.issues[0];
  if (editorialIssueNum) editorialIssueNum.textContent = `Edición #${latest.issue_num}`;
  if (editorialDate) editorialDate.textContent = `(${latest.date_str})`;
  if (editorialContent) {
    editorialContent.innerHTML = latest.editorial_html || "<p>Sin nota editorial disponible para esta entrega.</p>";
  }
}

// Render Filters and Category Pills
function renderFilters() {
  if (!dataset) return;

  // Issue Selector Options
  if (issueSelect) {
    issueSelect.innerHTML = '<option value="ALL">Todas las ediciones</option>';
    dataset.issues.forEach((issue) => {
      const opt = document.createElement("option");
      opt.value = issue.issue_num;
      opt.textContent = `Edición #${issue.issue_num} (${issue.date_str})`;
      if (String(currentIssue) === String(issue.issue_num)) opt.selected = true;
      issueSelect.appendChild(opt);
    });

    issueSelect.addEventListener("change", (e) => {
      currentIssue = e.target.value;
      updateFilterSummary();
      renderArticles();
    });
  }

  // Category Filter Pills
  if (categoryFiltersContainer) {
    categoryFiltersContainer.innerHTML = "";
    
    // "Todos" pill
    const totalCount = dataset.recent_articles.length;
    const allBtn = createCategoryBtn("ALL", "Todos", totalCount, currentCategory === "ALL");
    categoryFiltersContainer.appendChild(allBtn);

    dataset.metadata.categories_summary.forEach((cat) => {
      const btn = createCategoryBtn(cat.name, cat.name, cat.count, currentCategory === cat.name);
      categoryFiltersContainer.appendChild(btn);
    });
  }

  updateFilterSummary();
}

function createCategoryBtn(catValue, label, count, isActive) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn rounded-full transition-all shrink-0 px-4 py-2 text-sm font-bold border shadow-2xs ${
    isActive 
      ? "btn-secondary shadow-xs text-white border-secondary" 
      : "bg-base-100 hover:bg-base-200 text-base-content border-base-300"
  }`;
  btn.innerHTML = `<span>${label}</span> <span class="badge badge-sm ${isActive ? 'bg-white/25 text-white font-black' : 'bg-base-200 text-base-content font-bold border border-base-300'} ml-2 font-mono rounded-full px-2 py-0.5">${count}</span>`;
  btn.addEventListener("click", () => {
    currentCategory = catValue;
    renderFilters();
    renderArticles();
  });
  return btn;
}

function updateFilterSummary() {
  const isFiltered = currentCategory !== "ALL" || currentIssue !== "ALL" || searchQuery.trim() !== "";
  if (resetAllFiltersBtn) {
    if (isFiltered) {
      resetAllFiltersBtn.classList.remove("hidden");
      resetAllFiltersBtn.classList.add("inline-flex");
    } else {
      resetAllFiltersBtn.classList.add("hidden");
      resetAllFiltersBtn.classList.remove("inline-flex");
    }
  }

  if (activeCategoryIndicator) {
    if (currentCategory !== "ALL") {
      activeCategoryIndicator.textContent = `Categoría: ${currentCategory}`;
      activeCategoryIndicator.classList.remove("hidden");
      activeCategoryIndicator.classList.add("inline-flex");
    } else {
      activeCategoryIndicator.classList.add("hidden");
      activeCategoryIndicator.classList.remove("inline-flex");
    }
  }
}

// Sorting Algorithm
function sortArticles(articles, criteria) {
  const list = [...articles];
  switch (criteria) {
    case "deadline":
      return list.sort((a, b) => {
        if (a.deadline && !b.deadline) return -1;
        if (!a.deadline && b.deadline) return 1;
        if (a.deadline && b.deadline) {
          const dateA = Date.parse(a.deadline) || 0;
          const dateB = Date.parse(b.deadline) || 0;
          return dateA - dateB;
        }
        return 0;
      });
    case "issue_desc":
      return list.sort((a, b) => (Number(b.issue_num) || 0) - (Number(a.issue_num) || 0));
    case "title_asc":
      return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "recent":
    default:
      return list;
  }
}

// Render Articles (Grid vs List View)
function renderArticles() {
  if (!dataset || !articlesContainer) return;

  let filtered = dataset.recent_articles;

  // Filter by Issue
  if (currentIssue !== "ALL") {
    filtered = filtered.filter((art) => String(art.issue_num) === String(currentIssue));
  }

  // Filter by Category
  if (currentCategory !== "ALL") {
    filtered = filtered.filter((art) => art.category === currentCategory);
  }

  // Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((art) => {
      return (
        (art.title && art.title.toLowerCase().includes(q)) ||
        (art.author && art.author.toLowerCase().includes(q)) ||
        (art.journal && art.journal.toLowerCase().includes(q)) ||
        (art.body_text && art.body_text.toLowerCase().includes(q)) ||
        (art.deadline && art.deadline.toLowerCase().includes(q)) ||
        (art.category && art.category.toLowerCase().includes(q))
      );
    });
  }

  // Apply Sorting
  filtered = sortArticles(filtered, sortBy);

  // Update Count
  if (resultsCountEl) {
    resultsCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;
  }

  // Set Container View Class
  if (viewMode === "list") {
    articlesContainer.className = "list-view-container flex flex-col gap-2.5";
  } else {
    articlesContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5";
  }

  // Empty State
  if (filtered.length === 0) {
    articlesContainer.className = "w-full py-12";
    articlesContainer.innerHTML = `
      <div class="max-w-md mx-auto text-center bg-base-100 p-8 rounded-2xl border border-base-300 shadow-xs">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-base-200 text-base-content/60 mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-base-content">No se encontraron convocatorias o artículos</h3>
        <p class="text-base-content/75 mt-1 text-xs leading-relaxed">Prueba ajustando los filtros de categoría o el término de búsqueda.</p>
        <button id="reset-empty-btn" class="btn btn-secondary text-white btn-xs mt-4 rounded-xl">Restablecer todos los filtros</button>
      </div>
    `;
    const resetEmptyBtn = document.getElementById("reset-empty-btn");
    if (resetEmptyBtn) resetEmptyBtn.addEventListener("click", resetAllFilters);
    return;
  }

  // Render Based on View Mode
  currentlyRenderedArticles = filtered;
  if (viewMode === "list") {
    articlesContainer.innerHTML = filtered.map((art, idx) => renderListRow(art, idx)).join("");
  } else {
    articlesContainer.innerHTML = filtered.map((art, idx) => renderGridCard(art, idx)).join("");
  }
}

// Compact Row Template (With 10% visible borders & AAA contrast)
function renderListRow(art, idx) {
  const isJournal = art.category === "Journals" && art.journal;
  const badgeClass = getCategoryBadgeClass(art.category);
  const isSaved = savedZoteroLinks.has(art.link);
  const canSaveZotero = isZoteroEligible(art);
  const primaryLink = getPrimaryArticleLink(art);
  
  const deadlineBadge = art.deadline
    ? `<span class="badge badge-deadline text-[11px] font-bold flex items-center gap-1 shrink-0 rounded-md">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Plazo: ${art.deadline}</span>
      </span>`
    : "";

  const zoteroBtnHtml = canSaveZotero
    ? `<button type="button" class="btn btn-xs btn-zotero ${isSaved ? 'btn-zotero-saved' : ''} gap-1 font-bold rounded-lg" data-zotero-index="${idx}" title="Guardar en mi biblioteca de Zotero" ${isSaved ? 'disabled' : ''}>
        ${
          isSaved
            ? `<svg class="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>¡Guardado!</span>`
            : `<svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M4.54 3.6h14.92v3.74l-8.62 10.82h8.62V22H4.54v-3.74l8.62-10.82H4.54V3.6z"/></svg><span>Zotero</span>`
        }
      </button>`
    : "";

  return `
    <article class="list-view-row bg-base-100 border border-base-300 rounded-2xl p-4 shadow-xs hover:border-secondary/60 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0 flex-grow">
        <div class="flex items-center gap-2 flex-wrap mb-1.5">
          <span class="badge ${badgeClass} text-[11px] px-2.5 py-0.5 rounded-md">${art.category}</span>
          ${isJournal ? `<span class="text-xs font-bold text-primary truncate max-w-[280px]" title="${art.journal}">📖 ${art.journal}</span>` : ""}
          <span class="text-[11px] font-bold text-base-content/85">#${art.issue_num} (${art.issue_date})</span>
          ${deadlineBadge}
        </div>

        <h3 class="text-sm sm:text-base font-extrabold text-base-content hover:text-primary transition-colors leading-snug">
          <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="hover:underline">
            ${art.title}
          </a>
        </h3>

        ${
          art.author
            ? `<p class="text-xs text-base-content font-medium mt-1 truncate">✍️ ${art.author}</p>`
            : ""
        }
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 w-full sm:w-auto justify-end">
        ${zoteroBtnHtml}
        <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs gap-1 font-bold rounded-lg" title="Abrir enlace directo">
          <span>Abrir</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <a href="${art.newsletter_link || art.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs border-base-300 text-base-content hover:bg-secondary hover:text-white hover:border-secondary font-bold rounded-lg transition-all" title="Ver contexto en newsletter">
          <span>Newsletter</span>
        </a>
      </div>
    </article>
  `;
}

// Grid Card Template (With 10% visible borders and Color Hunt palette)
function renderGridCard(art, idx) {
  const isJournal = art.category === "Journals" && art.journal;
  const badgeClass = getCategoryBadgeClass(art.category);
  const isSaved = savedZoteroLinks.has(art.link);
  const canSaveZotero = isZoteroEligible(art);
  const primaryLink = getPrimaryArticleLink(art);
  
  const zoteroBtnHtml = canSaveZotero
    ? `<button type="button" class="btn btn-xs btn-zotero ${isSaved ? 'btn-zotero-saved' : ''} gap-1 font-bold rounded-lg shadow-xs" data-zotero-index="${idx}" title="Guardar en mi biblioteca de Zotero" ${isSaved ? 'disabled' : ''}>
        ${
          isSaved
            ? `<svg class="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>¡Guardado!</span>`
            : `<svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M4.54 3.6h14.92v3.74l-8.62 10.82h8.62V22H4.54v-3.74l8.62-10.82H4.54V3.6z"/></svg><span>Zotero</span>`
        }
      </button>`
    : "";

  const deadlineHtml = art.deadline
    ? `<div class="badge badge-deadline text-xs font-bold px-2.5 py-1 rounded-md mt-2 flex items-center gap-1.5 w-fit">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Plazo: ${art.deadline}</span>
      </div>`
    : "";

  // Filter external links: Eliminate "Abrir Artículo" / "Abrir enlace", primary link, and duplicates
  const cleanPrimaryUrl = (primaryLink || "").trim().replace(/\/$/, "");
  const cleanMainUrl = (art.link || "").trim().replace(/\/$/, "");

  const relevantExtLinks = (art.external_links || []).filter((l) => {
    const cleanUrl = (l.url || "").trim().replace(/\/$/, "");
    const textLower = (l.text || "").trim().toLowerCase();
    
    // Check if duplicate of main link or primary link
    if (cleanUrl === cleanMainUrl || cleanUrl === cleanPrimaryUrl) return false;
    
    // Check if generic "Abrir artículo" / "Abrir enlace" label or "here"
    if (textLower === "abrir artículo" || textLower === "abrir articulo" || textLower === "abrir enlace" || textLower === "abrir" || textLower === "here") {
      return false;
    }
    
    return true;
  });

  const extLinksHtml =
    relevantExtLinks.length > 0
      ? `<div class="mt-3.5 pt-3 border-t border-base-300/60 flex flex-wrap gap-1.5">
          ${relevantExtLinks
            .map(
              (l) =>
                `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-xs bg-base-200 hover:bg-primary hover:text-white text-base-content border border-base-300 gap-1 max-w-[200px] truncate rounded-lg font-semibold transition-colors" title="${l.text}">
                  <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  <span class="truncate">${l.text}</span>
                </a>`
            )
            .join("")}
        </div>`
      : "";

  return `
    <article class="card bg-base-100 border border-base-300 rounded-2xl shadow-xs hover:border-secondary/60 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div class="p-6 flex-grow">
        
        <!-- Header Category & Date -->
        <div class="flex items-start justify-between gap-2 flex-wrap mb-2.5">
          <span class="badge ${badgeClass} text-xs px-2.5 py-0.5 rounded-md">${art.category}</span>
          <span class="text-xs text-base-content/85 font-bold">Ed. #${art.issue_num} • ${art.issue_date}</span>
        </div>

        ${
          isJournal
            ? `<div class="text-xs font-extrabold text-primary flex items-center gap-1.5 mb-2">
                <svg class="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span class="truncate" title="${art.journal}">${art.journal}</span>
              </div>`
            : ""
        }

        <!-- Title -->
        <h3 class="font-extrabold text-base leading-snug text-base-content group-hover:text-primary transition-colors">
          <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="hover:underline">
            ${art.title}
          </a>
        </h3>

        ${
          art.author
            ? `<div class="mt-2 text-xs text-base-content flex items-center gap-1.5 font-medium">
                <svg class="w-3.5 h-3.5 shrink-0 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span>${art.author}</span>
              </div>`
            : ""
        }

        ${deadlineHtml}

        ${
          art.body_text
            ? `<p class="text-xs text-base-content font-medium mt-3 line-clamp-3 leading-relaxed">
                ${art.body_text}
              </p>`
            : ""
        }

        ${extLinksHtml}
      </div>

      <!-- Footer Actions: Shortened "Abrir", Conditional "Zotero", and "En newsletter" -->
      <div class="bg-base-200/60 px-6 py-3.5 border-t border-base-300/60 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs gap-1 font-bold rounded-lg shadow-xs" title="Abrir enlace directo">
            <span>Abrir</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
          ${zoteroBtnHtml}
        </div>
        <a href="${art.newsletter_link || art.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs border-base-300 text-base-content hover:bg-secondary hover:text-white hover:border-secondary font-bold gap-1.5 px-3 py-1.5 rounded-lg transition-all" title="Ver contexto completo en newsletter">
          <span>En newsletter</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </article>
  `;
}

// Reset Filters Function
function resetAllFilters() {
  currentCategory = "ALL";
  currentIssue = "ALL";
  searchQuery = "";
  if (searchInput) searchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
  if (issueSelect) issueSelect.value = "ALL";
  renderFilters();
  renderArticles();
}

// Setup Event Listeners
function setupEventListeners() {
  // Search Input with Debounce & Clear Button
  if (searchInput) {
    let debounceTimeout;
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (searchQuery.length > 0) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        updateFilterSummary();
        renderArticles();
      }, 150);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchQuery = "";
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      clearSearchBtn.classList.add("hidden");
      updateFilterSummary();
      renderArticles();
    });
  }

  // Issue Select Dropdown
  if (issueSelect) {
    issueSelect.addEventListener("change", (e) => {
      currentIssue = e.target.value;
      updateFilterSummary();
      renderArticles();
    });
  }

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      renderArticles();
    });
  }

  // View Mode Switcher
  const updateViewModeUI = (mode) => {
    viewMode = mode;
    localStorage.setItem("viewMode", mode);
    if (mode === "grid") {
      viewGridBtn.className = "btn btn-sm btn-primary text-primary-content shadow-xs rounded-lg px-3 py-2 flex items-center justify-center font-bold transition-all h-9";
      viewListBtn.className = "btn btn-sm bg-transparent text-base-content hover:bg-base-300 rounded-lg px-3 py-2 flex items-center justify-center font-bold transition-all h-9 border-0";
    } else {
      viewListBtn.className = "btn btn-sm btn-primary text-primary-content shadow-xs rounded-lg px-3 py-2 flex items-center justify-center font-bold transition-all h-9";
      viewGridBtn.className = "btn btn-sm bg-transparent text-base-content hover:bg-base-300 rounded-lg px-3 py-2 flex items-center justify-center font-bold transition-all h-9 border-0";
    }
    renderArticles();
  };

  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", () => updateViewModeUI("grid"));
  }
  if (viewListBtn) {
    viewListBtn.addEventListener("click", () => updateViewModeUI("list"));
  }

  // Set initial view button state
  if (viewMode === "list") {
    updateViewModeUI("list");
  }

  // Reset All Filters Button
  if (resetAllFiltersBtn) {
    resetAllFiltersBtn.addEventListener("click", resetAllFilters);
  }

  // Theme Toggle Button (Light <-> Dark)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
      updateThemeUI();
      showToast(currentTheme === "dark" ? "Modo oscuro activado 🌙" : "Modo claro activado ☀️");
    });
  }

  // Zotero Modal Triggers & Form Listeners
  if (zoteroModalTrigger) {
    zoteroModalTrigger.addEventListener("click", () => openZoteroModal());
  }

  if (zoteroModalCloseBtn) {
    zoteroModalCloseBtn.addEventListener("click", () => closeZoteroModal());
  }

  if (zoteroCancelBtn) {
    zoteroCancelBtn.addEventListener("click", () => closeZoteroModal());
  }

  if (zoteroToggleKeyBtn && zoteroApiKeyInput) {
    zoteroToggleKeyBtn.addEventListener("click", () => {
      if (zoteroApiKeyInput.type === "password") {
        zoteroApiKeyInput.type = "text";
        if (eyeIconOpen) eyeIconOpen.classList.add("hidden");
        if (eyeIconClosed) eyeIconClosed.classList.remove("hidden");
      } else {
        zoteroApiKeyInput.type = "password";
        if (eyeIconOpen) eyeIconOpen.classList.remove("hidden");
        if (eyeIconClosed) eyeIconClosed.classList.add("hidden");
      }
    });
  }

  if (zoteroConfigForm) {
    zoteroConfigForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = (zoteroUserIdInput ? zoteroUserIdInput.value : "").trim();
      const apiKey = (zoteroApiKeyInput ? zoteroApiKeyInput.value : "").trim();
      const collectionKey = (zoteroCollectionInput ? zoteroCollectionInput.value : "").trim();

      if (!userId || !apiKey) {
        showZoteroModalStatus("Por favor ingresa tanto el User ID como la API Key.", "error");
        return;
      }

      showZoteroModalStatus("Verificando credenciales con Zotero...", "loading");
      if (zoteroSaveBtn) zoteroSaveBtn.disabled = true;

      try {
        const testRes = await fetch(`https://api.zotero.org/users/${userId}/items?limit=1`, {
          headers: {
            "Zotero-API-Key": apiKey,
            "Zotero-API-Version": "3"
          }
        });

        if (!testRes.ok) {
          if (testRes.status === 403 || testRes.status === 401) {
            throw new Error("Clave API no autorizada o sin permisos suficientes.");
          }
          if (testRes.status === 404) {
            throw new Error("User ID no encontrado en los registros de Zotero.");
          }
          throw new Error(`Error de conexión con Zotero (${testRes.status} ${testRes.statusText})`);
        }

        // Save valid config to localStorage
        localStorage.setItem("zotero_user_id", userId);
        localStorage.setItem("zotero_api_key", apiKey);
        localStorage.setItem("zotero_collection_key", collectionKey);

        showZoteroModalStatus("¡Conexión verificada y credenciales guardadas con éxito!", "success");
        updateZoteroHeaderUI();
        showToast("¡Zotero configurado correctamente! 🎉");

        setTimeout(() => {
          closeZoteroModal();
          if (zoteroSaveBtn) zoteroSaveBtn.disabled = false;
        }, 1000);
      } catch (err) {
        console.error("Zotero verification error:", err);
        showZoteroModalStatus(err.message || "Error al verificar conexión con Zotero.", "error");
        if (zoteroSaveBtn) zoteroSaveBtn.disabled = false;
      }
    });
  }

  if (zoteroDisconnectBtn) {
    zoteroDisconnectBtn.addEventListener("click", () => {
      localStorage.removeItem("zotero_user_id");
      localStorage.removeItem("zotero_api_key");
      localStorage.removeItem("zotero_collection_key");

      if (zoteroUserIdInput) zoteroUserIdInput.value = "";
      if (zoteroApiKeyInput) zoteroApiKeyInput.value = "";
      if (zoteroCollectionInput) zoteroCollectionInput.value = "";

      updateZoteroHeaderUI();
      showZoteroModalStatus("Credenciales eliminadas de este navegador.", "info");
      zoteroDisconnectBtn.classList.add("hidden");
      showToast("Conexión con Zotero desvinculada.");
    });
  }

  // Close modal when clicking backdrop outside dialog box
  if (zoteroModal) {
    zoteroModal.addEventListener("click", (e) => {
      if (e.target === zoteroModal) {
        closeZoteroModal();
      }
    });
  }

  // Delegated Event Listener for "Guardar en Zotero" Buttons on cards and rows
  if (articlesContainer) {
    articlesContainer.addEventListener("click", (e) => {
      const zoteroBtn = e.target.closest("[data-zotero-index]");
      if (zoteroBtn) {
        e.preventDefault();
        const idx = Number(zoteroBtn.getAttribute("data-zotero-index"));
        const article = currentlyRenderedArticles[idx];
        if (article) {
          saveArticleToZotero(article, zoteroBtn);
        }
      }
    });
  }

  // Global Keyboard Shortcuts (/ to search, Escape to blur/close)
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput) {
        searchInput.blur();
      }
      closeZoteroModal();
    }
  });
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  updateThemeUI();
  updateZoteroHeaderUI();
  populateFeedUrls();
  setupCopyButtons();
  setupEventListeners();
  loadData();
});


