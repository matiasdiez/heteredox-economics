import "./style.css";
import "flyonui/flyonui";
import {
  getCurrentLanguage,
  setLanguage,
  t,
  translateCategory,
  formatArticleDate,
  formatDeadlineDate,
  formatLocaleDate,
  formatArticleBodyText,
  SUPPORTED_LANGUAGES
} from "./i18n.js";

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

// Apply Initial Theme & Language attribute
document.documentElement.setAttribute("data-theme", currentTheme);
document.documentElement.setAttribute("lang", getCurrentLanguage());

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

// Language Dropdown Elements (No Flags)
const langToggleBtn = document.getElementById("lang-toggle-btn");
const langDropdownMenu = document.getElementById("lang-dropdown-menu");
const langDropdownWrapper = document.getElementById("lang-dropdown-wrapper");
const currentLangCode = document.getElementById("current-lang-code");
const langOptionBtns = document.querySelectorAll(".lang-option-btn");

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
const zoteroSyncBtn = document.getElementById("zotero-sync-btn");
const zoteroSyncIcon = document.getElementById("zotero-sync-icon");
const zoteroDisconnectBtn = document.getElementById("zotero-disconnect-btn");
const zoteroSaveBtn = document.getElementById("zotero-save-btn");
const zoteroHeaderStatusDot = document.getElementById("zotero-header-status-dot");

let currentlyRenderedArticles = [];

// Zotero Library Items Cache (URLs & Titles for fast matching)
const savedZoteroCache = {
  urls: new Set(),
  titles: new Set(),
  lastSync: 0
};

// Top Stats Elements
const statTotalArticles = document.getElementById("stat-total-articles");
const statTotalJournals = document.getElementById("stat-total-journals");
const statTotalCfps = document.getElementById("stat-total-cfps");
const statTotalIssues = document.getElementById("stat-total-issues");

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
        showToast(t("toast.feed_url_copied"));
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>${t("hero.copied_btn")}</span>`;
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

// Helper to validate URL is a direct article link and not a shared newsletter aggregator link
function isValidZoteroUrl(url) {
  if (!url || typeof url !== "string") return false;
  const clean = url.toLowerCase().trim();
  if (!clean || clean === "#" || clean.includes("heterodoxnews.com")) return false;
  return true;
}

// Key Normalization for Accurate Library Matching
function normalizeZoteroKey(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/\/$/, "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
}

function normalizeTitle(str) {
  if (!str || typeof str !== "string") return "";
  const clean = str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length >= 4 ? clean : "";
}

// Cache Management for Saved Items (Per individual article / book)
function loadSavedZoteroCache() {
  try {
    localStorage.removeItem("zotero_saved_articles_cache");
    const raw = localStorage.getItem("zotero_saved_articles_cache_v2");
    if (raw) {
      const parsed = JSON.parse(raw);
      savedZoteroCache.urls = new Set((parsed.urls || []).filter(isValidZoteroUrl).map(normalizeZoteroKey));
      savedZoteroCache.titles = new Set((parsed.titles || []).map(normalizeTitle).filter(Boolean));
      savedZoteroCache.lastSync = parsed.lastSync || 0;
    }
  } catch (e) {
    console.error("Error loading Zotero cache:", e);
  }
}

function persistSavedZoteroCache() {
  try {
    const data = {
      urls: Array.from(savedZoteroCache.urls).filter(isValidZoteroUrl),
      titles: Array.from(savedZoteroCache.titles).filter(Boolean),
      lastSync: savedZoteroCache.lastSync
    };
    localStorage.setItem("zotero_saved_articles_cache_v2", JSON.stringify(data));
  } catch (e) {
    console.error("Error persisting Zotero cache:", e);
  }
}

function markArticleAsSaved(art) {
  if (!art) return;
  const primaryLink = getPrimaryArticleLink(art);
  if (isValidZoteroUrl(primaryLink)) {
    savedZoteroCache.urls.add(normalizeZoteroKey(primaryLink));
  }
  if (isValidZoteroUrl(art.link)) {
    savedZoteroCache.urls.add(normalizeZoteroKey(art.link));
  }
  const normTitle = normalizeTitle(art.title);
  if (normTitle) {
    savedZoteroCache.titles.add(normTitle);
  }
  persistSavedZoteroCache();
}

function isArticleSavedInZotero(art) {
  if (!art) return false;
  
  const primaryLink = getPrimaryArticleLink(art);
  if (isValidZoteroUrl(primaryLink) && savedZoteroCache.urls.has(normalizeZoteroKey(primaryLink))) {
    return true;
  }
  if (isValidZoteroUrl(art.link) && savedZoteroCache.urls.has(normalizeZoteroKey(art.link))) {
    return true;
  }

  const normTitle = normalizeTitle(art.title);
  if (normTitle && savedZoteroCache.titles.has(normTitle)) {
    return true;
  }

  return false;
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
      zoteroHeaderStatusDot.title = t("nav.zotero_dot_connected");
    } else {
      zoteroHeaderStatusDot.className = "w-2 h-2 rounded-full bg-base-content/30 inline-block";
      zoteroHeaderStatusDot.title = t("nav.zotero_dot_disconnected");
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

  if (zoteroSyncBtn) {
    if (isConfigured) {
      zoteroSyncBtn.classList.remove("hidden");
    } else {
      zoteroSyncBtn.classList.add("hidden");
    }
  }

  if (prefillStatusMsg) {
    showZoteroModalStatus(prefillStatusMsg.text, prefillStatusMsg.type);
  } else if (isConfigured) {
    const cachedCount = savedZoteroCache.titles.size;
    const countStr = cachedCount > 0 ? t("zotero.status_cached_refs", { count: cachedCount }) : t("zotero.status_library_ready");
    showZoteroModalStatus(
      t("zotero.status_connected_msg", { userId, countStr }),
      "success"
    );
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
  const parts = authorStr.split(/\s*(?:,| and | y | & | et )\s*/i).filter(Boolean);
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
      title: art.title || "Untitled",
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
      title: art.title || "Untitled",
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
    title: art.title || "Untitled",
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

// Background and Manual Library Sync
let isSyncingZotero = false;

async function syncZoteroLibrary(showFeedback = false) {
  const config = getZoteroConfig();
  if (!config.isConfigured || isSyncingZotero) return;

  isSyncingZotero = true;
  if (zoteroSyncIcon) zoteroSyncIcon.classList.add("animate-spin");
  if (zoteroSyncBtn) zoteroSyncBtn.disabled = true;

  try {
    if (showFeedback) {
      showZoteroModalStatus(t("zotero.status_syncing"), "loading");
    }

    const endpoint = `https://api.zotero.org/users/${config.userId}/items?limit=100&sort=dateModified&direction=desc`;
    const res = await fetch(endpoint, {
      headers: {
        "Zotero-API-Key": config.apiKey,
        "Zotero-API-Version": "3"
      }
    });

    if (res.ok) {
      const items = await res.json();
      savedZoteroCache.urls.clear();
      savedZoteroCache.titles.clear();

      items.forEach((item) => {
        const data = item.data;
        if (!data) return;
        if (isValidZoteroUrl(data.url)) {
          savedZoteroCache.urls.add(normalizeZoteroKey(data.url));
        }
        const normTitle = normalizeTitle(data.title);
        if (normTitle) {
          savedZoteroCache.titles.add(normTitle);
        }
      });

      savedZoteroCache.lastSync = Date.now();
      persistSavedZoteroCache();
      renderArticles();

      if (showFeedback) {
        showZoteroModalStatus(t("zotero.status_sync_ok", { count: items.length }), "success");
        showToast(t("toast.zotero_sync_success"));
      }
    } else if (showFeedback) {
      showZoteroModalStatus(t("zotero.status_sync_fail", { status: res.status }), "error");
    }
  } catch (err) {
    console.error("Error syncing Zotero library:", err);
    if (showFeedback) {
      showZoteroModalStatus(t("zotero.status_unreachable"), "error");
    }
  } finally {
    isSyncingZotero = false;
    if (zoteroSyncIcon) zoteroSyncIcon.classList.remove("animate-spin");
    if (zoteroSyncBtn) zoteroSyncBtn.disabled = false;
  }
}

async function saveArticleToZotero(art, buttonEl) {
  const config = getZoteroConfig();
  if (!config.isConfigured) {
    openZoteroModal({
      text: t("zotero.status_prompt_config"),
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
    <span>${t("card.zotero_saving")}</span>
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
      markArticleAsSaved(art);
      renderArticles();
      showToast(t("toast.zotero_saved"));
    } else if (res.status === 403 || res.status === 401) {
      buttonEl.disabled = false;
      buttonEl.classList.remove("btn-zotero-loading");
      buttonEl.innerHTML = originalHtml;
      showToast(t("toast.zotero_key_error"));
      openZoteroModal({
        text: t("zotero.status_invalid_key"),
        type: "error"
      });
    } else {
      const errText = await res.text();
      console.error("Zotero API Error:", res.status, errText);
      buttonEl.disabled = false;
      buttonEl.classList.remove("btn-zotero-loading");
      buttonEl.innerHTML = originalHtml;
      showToast(t("toast.zotero_save_error", { status: res.status }));
    }
  } catch (err) {
    console.error("Error connecting to Zotero API:", err);
    buttonEl.disabled = false;
    buttonEl.classList.remove("btn-zotero-loading");
    buttonEl.innerHTML = originalHtml;
    showToast(t("toast.zotero_network_error"));
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
          <p>${t("error.data_load")}</p>
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
    lastUpdatedEl.textContent = formatLocaleDate(meta.updated_at, getCurrentLanguage());
  }

  if (statTotalArticles && meta.total_articles_indexed) {
    statTotalArticles.textContent = Number(meta.total_articles_indexed).toLocaleString(SUPPORTED_LANGUAGES[getCurrentLanguage()]?.locale);
  }
  if (statTotalJournals && meta.total_journal_papers_indexed) {
    statTotalJournals.textContent = Number(meta.total_journal_papers_indexed).toLocaleString(SUPPORTED_LANGUAGES[getCurrentLanguage()]?.locale);
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
  if (editorialIssueNum) {
    editorialIssueNum.textContent = t("editorial.issue_prefix", { num: latest.issue_num });
  }
  if (editorialDate) {
    const formattedDate = formatArticleDate(latest.iso_date || latest.date_str, getCurrentLanguage());
    editorialDate.textContent = `(${formattedDate})`;
  }
  if (editorialContent) {
    editorialContent.innerHTML = latest.editorial_html || `<p>${t("editorial.empty")}</p>`;
  }
}

// Render Filters and Category Pills
function renderFilters() {
  if (!dataset) return;

  // Issue Selector Options
  if (issueSelect) {
    const previousSelection = currentIssue;
    issueSelect.innerHTML = `<option value="ALL">${t("filters.all_issues")}</option>`;
    dataset.issues.forEach((issue) => {
      const opt = document.createElement("option");
      opt.value = issue.issue_num;
      const formattedDate = formatArticleDate(issue.iso_date || issue.date_str, getCurrentLanguage());
      opt.textContent = t("filters.issue_option", { num: issue.issue_num, date: formattedDate });
      if (String(previousSelection) === String(issue.issue_num)) opt.selected = true;
      issueSelect.appendChild(opt);
    });
  }

  // Category Filter Pills
  if (categoryFiltersContainer) {
    categoryFiltersContainer.innerHTML = "";
    
    // "Todos" / "All" / "Tous" pill
    const totalCount = dataset.recent_articles.length;
    const allBtn = createCategoryBtn("ALL", t("categories.all"), totalCount, currentCategory === "ALL");
    categoryFiltersContainer.appendChild(allBtn);

    dataset.metadata.categories_summary.forEach((cat) => {
      const translatedCat = translateCategory(cat.name, getCurrentLanguage());
      const btn = createCategoryBtn(cat.name, translatedCat, cat.count, currentCategory === cat.name);
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
      const translatedCat = translateCategory(currentCategory, getCurrentLanguage());
      activeCategoryIndicator.textContent = t("results.active_category", { cat: translatedCat });
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
    const currentLang = getCurrentLanguage();
    filtered = filtered.filter((art) => {
      const translatedCat = translateCategory(art.category, currentLang).toLowerCase();
      const bodyFormatted = formatArticleBodyText(art, currentLang).toLowerCase();
      return (
        (art.title && art.title.toLowerCase().includes(q)) ||
        (art.author && art.author.toLowerCase().includes(q)) ||
        (art.journal && art.journal.toLowerCase().includes(q)) ||
        (art.body_text && art.body_text.toLowerCase().includes(q)) ||
        bodyFormatted.includes(q) ||
        (art.deadline && art.deadline.toLowerCase().includes(q)) ||
        (art.category && art.category.toLowerCase().includes(q)) ||
        translatedCat.includes(q)
      );
    });
  }

  // Apply Sorting
  filtered = sortArticles(filtered, sortBy);

  // Update Count
  if (resultsCountEl) {
    resultsCountEl.textContent = filtered.length === 1 
      ? t("results.count_singular") 
      : t("results.count_plural", { count: filtered.length });
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
        <h3 class="text-base font-bold text-base-content">${t("empty.title")}</h3>
        <p class="text-base-content/75 mt-1 text-xs leading-relaxed">${t("empty.desc")}</p>
        <button id="reset-empty-btn" class="btn btn-secondary text-white btn-xs mt-4 rounded-xl font-bold">${t("empty.reset_btn")}</button>
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

// Compact Row Template
function renderListRow(art, idx) {
  const isJournal = art.category === "Journals" && art.journal;
  const badgeClass = getCategoryBadgeClass(art.category);
  const categoryDisplayName = translateCategory(art.category, getCurrentLanguage());
  const isSaved = isArticleSavedInZotero(art);
  const canSaveZotero = isZoteroEligible(art);
  const primaryLink = getPrimaryArticleLink(art);
  const formattedDate = formatArticleDate(art.iso_date || art.issue_date, getCurrentLanguage());
  const formattedDeadline = formatDeadlineDate(art.deadline, getCurrentLanguage());
  
  const deadlineBadge = art.deadline
    ? `<span class="badge badge-deadline text-[11px] font-bold flex items-center gap-1 shrink-0 rounded-md">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>${t("card.deadline", { date: formattedDeadline })}</span>
      </span>`
    : "";

  let zoteroBtnHtml = "";
  if (canSaveZotero) {
    if (isSaved) {
      zoteroBtnHtml = `
        <span class="btn btn-xs btn-zotero btn-zotero-saved gap-1 font-bold rounded-lg cursor-default shadow-xs" title="${t("card.zotero_saved_title")}">
          <svg class="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>${t("card.zotero_saved_btn")}</span>
        </span>
      `;
    } else {
      zoteroBtnHtml = `
        <button type="button" class="btn btn-xs btn-zotero gap-1 font-bold rounded-lg shadow-xs" data-zotero-index="${idx}" title="${t("card.zotero_save_title")}">
          <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M4.54 3.6h14.92v3.74l-8.62 10.82h8.62V22H4.54v-3.74l8.62-10.82H4.54V3.6z"/>
          </svg>
          <span>${t("card.zotero_save_btn")}</span>
        </button>
      `;
    }
  }

  return `
    <article class="list-view-row bg-base-100 border border-base-300 rounded-2xl p-4 shadow-xs hover:border-secondary/60 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0 flex-grow">
        <div class="flex items-center gap-2 flex-wrap mb-1.5">
          <span class="badge ${badgeClass} text-[11px] px-2.5 py-0.5 rounded-md">${categoryDisplayName}</span>
          ${isJournal ? `<span class="text-xs font-bold text-primary truncate max-w-[280px]" title="${art.journal}">📖 ${art.journal}</span>` : ""}
          <span class="text-[11px] font-bold text-base-content/85">${t("card.issue_format", { num: art.issue_num, date: formattedDate })}</span>
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
        <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs gap-1 font-bold rounded-lg" title="${t("card.open_title")}">
          <span>${t("card.open_btn")}</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <a href="${art.newsletter_link || art.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs border-base-300 text-base-content hover:bg-secondary hover:text-white hover:border-secondary font-bold rounded-lg transition-all" title="${t("card.newsletter_title")}">
          <span>${t("card.newsletter_row_btn")}</span>
        </a>
      </div>
    </article>
  `;
}

// Grid Card Template
function renderGridCard(art, idx) {
  const isJournal = art.category === "Journals" && art.journal;
  const badgeClass = getCategoryBadgeClass(art.category);
  const categoryDisplayName = translateCategory(art.category, getCurrentLanguage());
  const isSaved = isArticleSavedInZotero(art);
  const canSaveZotero = isZoteroEligible(art);
  const primaryLink = getPrimaryArticleLink(art);
  const formattedDate = formatArticleDate(art.iso_date || art.issue_date, getCurrentLanguage());
  const formattedDeadline = formatDeadlineDate(art.deadline, getCurrentLanguage());
  const bodyTextDisplay = formatArticleBodyText(art, getCurrentLanguage());
  
  let zoteroBtnHtml = "";
  if (canSaveZotero) {
    if (isSaved) {
      zoteroBtnHtml = `
        <span class="btn btn-xs btn-zotero btn-zotero-saved gap-1 font-bold rounded-lg shadow-xs cursor-default" title="${t("card.zotero_saved_title")}">
          <svg class="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>${t("card.zotero_saved_btn")}</span>
        </span>
      `;
    } else {
      zoteroBtnHtml = `
        <button type="button" class="btn btn-xs btn-zotero gap-1 font-bold rounded-lg shadow-xs" data-zotero-index="${idx}" title="${t("card.zotero_save_title")}">
          <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M4.54 3.6h14.92v3.74l-8.62 10.82h8.62V22H4.54v-3.74l8.62-10.82H4.54V3.6z"/>
          </svg>
          <span>${t("card.zotero_save_btn")}</span>
        </button>
      `;
    }
  }

  const deadlineHtml = art.deadline
    ? `<div class="badge badge-deadline text-xs font-bold px-2.5 py-1 rounded-md mt-2 flex items-center gap-1.5 w-fit">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>${t("card.deadline", { date: formattedDeadline })}</span>
      </div>`
    : "";

  const cleanPrimaryUrl = (primaryLink || "").trim().replace(/\/$/, "");
  const cleanMainUrl = (art.link || "").trim().replace(/\/$/, "");

  const relevantExtLinks = (art.external_links || []).filter((l) => {
    const cleanUrl = (l.url || "").trim().replace(/\/$/, "");
    const textLower = (l.text || "").trim().toLowerCase();
    
    if (cleanUrl === cleanMainUrl || cleanUrl === cleanPrimaryUrl) return false;
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
          <span class="badge ${badgeClass} text-xs px-2.5 py-0.5 rounded-md">${categoryDisplayName}</span>
          <span class="text-xs text-base-content/85 font-bold">${t("card.issue_format", { num: art.issue_num, date: formattedDate })}</span>
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
          bodyTextDisplay
            ? `<p class="text-xs text-base-content font-medium mt-3 line-clamp-3 leading-relaxed">
                ${bodyTextDisplay}
              </p>`
            : ""
        }

        ${extLinksHtml}
      </div>

      <!-- Footer Actions -->
      <div class="bg-base-200/60 px-6 py-3.5 border-t border-base-300/60 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <a href="${primaryLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs gap-1 font-bold rounded-lg shadow-xs" title="${t("card.open_title")}">
            <span>${t("card.open_btn")}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
          ${zoteroBtnHtml}
        </div>
        <a href="${art.newsletter_link || art.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs border-base-300 text-base-content hover:bg-secondary hover:text-white hover:border-secondary font-bold gap-1.5 px-3 py-1.5 rounded-lg transition-all" title="${t("card.newsletter_title")}">
          <span>${t("card.newsletter_btn")}</span>
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

// Apply Language & Translations to Full DOM
function applyTranslations(lang = getCurrentLanguage()) {
  const langConfig = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.es;

  // Update HTML lang attribute
  document.documentElement.setAttribute("lang", lang);

  // Update document title & meta description
  document.title = t("page.title", {}, lang);
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", t("page.meta_desc", {}, lang));
  }

  // Update Language Switcher UI in header (Code only, no flags)
  if (currentLangCode) currentLangCode.textContent = langConfig.code;

  // Update Checkmarks in Dropdown Menu
  langOptionBtns.forEach((btn) => {
    const code = btn.getAttribute("data-lang-code");
    const check = btn.querySelector(".lang-check");
    if (check) {
      if (code === lang) {
        check.classList.remove("hidden");
      } else {
        check.classList.add("hidden");
      }
    }
  });

  // Update text elements with [data-i18n]
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = t(key, {}, lang);
    }
  });

  // Update HTML elements with [data-i18n-html]
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (key) {
      el.innerHTML = t(key, {}, lang);
    }
  });

  // Update placeholders with [data-i18n-placeholder]
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      el.placeholder = t(key, {}, lang);
    }
  });

  // Update title / tooltip attributes with [data-i18n-title]
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) {
      el.title = t(key, {}, lang);
    }
  });

  // Re-render Dynamic Sections
  renderHeaderStats();
  renderEditorial();
  renderFilters();
  renderArticles();
  updateZoteroHeaderUI();
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
      showToast(currentTheme === "dark" ? t("toast.dark_mode") : t("toast.light_mode"));
    });
  }

  // Language Dropdown Toggle & Selection (Clean, No Flags)
  if (langToggleBtn && langDropdownMenu) {
    langToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = langDropdownMenu.classList.contains("hidden");
      if (isHidden) {
        langDropdownMenu.classList.remove("hidden");
        langToggleBtn.setAttribute("aria-expanded", "true");
      } else {
        langDropdownMenu.classList.add("hidden");
        langToggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close language dropdown on outside click
    document.addEventListener("click", (e) => {
      if (langDropdownWrapper && !langDropdownWrapper.contains(e.target)) {
        langDropdownMenu.classList.add("hidden");
        langToggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Handle Language Selection
    langOptionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute("data-lang-code");
        if (selectedLang) {
          setLanguage(selectedLang);
          applyTranslations(selectedLang);
          langDropdownMenu.classList.add("hidden");
          langToggleBtn.setAttribute("aria-expanded", "false");
        }
      });
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

  if (zoteroSyncBtn) {
    zoteroSyncBtn.addEventListener("click", () => syncZoteroLibrary(true));
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
        showZoteroModalStatus(t("zotero.status_missing_fields"), "error");
        return;
      }

      showZoteroModalStatus(t("zotero.status_verifying"), "loading");
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
            throw new Error(t("zotero.err_unauthorized"));
          }
          if (testRes.status === 404) {
            throw new Error(t("zotero.err_not_found"));
          }
          throw new Error(`Error (${testRes.status} ${testRes.statusText})`);
        }

        // Save valid config to localStorage
        localStorage.setItem("zotero_user_id", userId);
        localStorage.setItem("zotero_api_key", apiKey);
        localStorage.setItem("zotero_collection_key", collectionKey);

        showZoteroModalStatus(t("zotero.status_verified"), "success");
        updateZoteroHeaderUI();
        showToast(t("toast.zotero_configured"));

        // Trigger sync in background
        syncZoteroLibrary(false);

        setTimeout(() => {
          closeZoteroModal();
          if (zoteroSaveBtn) zoteroSaveBtn.disabled = false;
        }, 1000);
      } catch (err) {
        console.error("Zotero verification error:", err);
        showZoteroModalStatus(err.message || "Error", "error");
        if (zoteroSaveBtn) zoteroSaveBtn.disabled = false;
      }
    });
  }

  if (zoteroDisconnectBtn) {
    zoteroDisconnectBtn.addEventListener("click", () => {
      localStorage.removeItem("zotero_user_id");
      localStorage.removeItem("zotero_api_key");
      localStorage.removeItem("zotero_collection_key");
      localStorage.removeItem("zotero_saved_articles_cache");

      savedZoteroCache.urls.clear();
      savedZoteroCache.titles.clear();
      savedZoteroCache.lastSync = 0;

      if (zoteroUserIdInput) zoteroUserIdInput.value = "";
      if (zoteroApiKeyInput) zoteroApiKeyInput.value = "";
      if (zoteroCollectionInput) zoteroCollectionInput.value = "";

      updateZoteroHeaderUI();
      showZoteroModalStatus(t("zotero.status_cleared"), "info");
      zoteroDisconnectBtn.classList.add("hidden");
      if (zoteroSyncBtn) zoteroSyncBtn.classList.add("hidden");
      renderArticles();
      showToast(t("toast.zotero_disconnected"));
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
document.addEventListener("DOMContentLoaded", async () => {
  loadSavedZoteroCache();
  updateThemeUI();
  updateZoteroHeaderUI();
  populateFeedUrls();
  setupCopyButtons();
  setupEventListeners();
  applyTranslations(getCurrentLanguage());
  await loadData();
  syncZoteroLibrary(false);
});
