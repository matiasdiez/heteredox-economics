import "./style.css";
import "flyonui/flyonui";

// Application State
let dataset = null;
let currentCategory = "ALL";
let currentIssue = "ALL";
let searchQuery = "";
let currentTheme = localStorage.getItem("theme") || "light";

// Apply Theme
document.documentElement.setAttribute("data-theme", currentTheme);

// DOM Elements
const articlesContainer = document.getElementById("articles-container");
const categoryFiltersContainer = document.getElementById("category-filters");
const issueSelect = document.getElementById("issue-select");
const searchInput = document.getElementById("search-input");
const resultsCountEl = document.getElementById("results-count");
const latestIssueBadge = document.getElementById("latest-issue-badge");
const lastUpdatedEl = document.getElementById("last-updated");
const editorialContent = document.getElementById("editorial-content");
const editorialIssueNum = document.getElementById("editorial-issue-num");
const editorialDate = document.getElementById("editorial-date");
const themeToggleBtn = document.getElementById("theme-toggle");
const toastEl = document.getElementById("toast-notification");

// Setup Copy Buttons
function setupCopyButtons() {
  const getAbsoluteFeedUrl = (filename) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
    return `${origin}${pathname}/${filename}`;
  };

  const issuesUrl = getAbsoluteFeedUrl("feed.xml");
  const articlesUrl = getAbsoluteFeedUrl("articles.xml");

  const issuesInput = document.getElementById("feed-issues-url");
  const articlesInput = document.getElementById("feed-articles-url");

  if (issuesInput) issuesInput.value = issuesUrl;
  if (articlesInput) articlesInput.value = articlesUrl;

  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        navigator.clipboard.writeText(targetInput.value).then(() => {
          showToast(`¡Enlace copiado al portapapeles!`);
        });
      }
    });
  });
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden", "opacity-0");
  toastEl.classList.add("opacity-100");
  setTimeout(() => {
    toastEl.classList.add("opacity-0");
    setTimeout(() => toastEl.classList.add("hidden"), 300);
  }, 2500);
}

// Category Badge Color Map
function getCategoryBadgeClass(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("call for paper")) return "badge-primary text-white";
  if (cat.includes("call for participant")) return "badge-info text-white";
  if (cat.includes("journal")) return "badge-secondary text-white";
  if (cat.includes("book")) return "badge-accent text-white";
  if (cat.includes("job")) return "badge-success text-white";
  if (cat.includes("award")) return "badge-warning text-gray-900";
  if (cat.includes("media") || cat.includes("podcast")) return "badge-info";
  return "badge-neutral text-white";
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
        <div class="alert alert-soft alert-error max-w-xl mx-auto my-8">
          <p>No se pudieron cargar los datos del feed. Por favor refresca la página.</p>
        </div>
      `;
    }
  }
}

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
}

function renderEditorial() {
  if (!dataset || !dataset.issues || dataset.issues.length === 0) return;
  const latest = dataset.issues[0];
  if (editorialIssueNum) editorialIssueNum.textContent = `Edición #${latest.issue_num}`;
  if (editorialDate) editorialDate.textContent = latest.date_str;
  if (editorialContent) {
    editorialContent.innerHTML = latest.editorial_html || "<p>Sin nota editorial disponible.</p>";
  }
}

function renderFilters() {
  if (!dataset) return;

  // Render Issue Selector Options
  if (issueSelect) {
    issueSelect.innerHTML = '<option value="ALL">Todas las ediciones</option>';
    dataset.issues.forEach((issue) => {
      const opt = document.createElement("option");
      opt.value = issue.issue_num;
      opt.textContent = `Edición #${issue.issue_num} (${issue.date_str})`;
      issueSelect.appendChild(opt);
    });

    issueSelect.addEventListener("change", (e) => {
      currentIssue = e.target.value;
      renderArticles();
    });
  }

  // Render Category Filter Pills
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
}

function createCategoryBtn(catValue, label, count, isActive) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn btn-sm rounded-full transition-all ${
    isActive ? "btn-primary shadow-sm" : "btn-outline border-base-300 hover:btn-neutral"
  }`;
  btn.innerHTML = `<span>${label}</span> <span class="badge badge-sm ${isActive ? 'bg-white/20 text-white' : 'badge-soft'} ml-1">${count}</span>`;
  btn.addEventListener("click", () => {
    currentCategory = catValue;
    renderFilters();
    renderArticles();
  });
  return btn;
}

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

  // Filter by Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.body_text.toLowerCase().includes(q) ||
        (art.deadline && art.deadline.toLowerCase().includes(q)) ||
        art.category.toLowerCase().includes(q)
    );
  }

  if (resultsCountEl) {
    resultsCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`;
  }

  if (filtered.length === 0) {
    articlesContainer.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 text-base-content/60 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold">No se encontraron convocatorias o artículos</h3>
        <p class="text-base-content/70 mt-1 text-sm">Prueba ajustando los filtros o el término de búsqueda.</p>
        <button id="reset-filters-btn" class="btn btn-outline btn-sm mt-4">Restablecer filtros</button>
      </div>
    `;
    const resetBtn = document.getElementById("reset-filters-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        currentCategory = "ALL";
        currentIssue = "ALL";
        searchQuery = "";
        if (searchInput) searchInput.value = "";
        if (issueSelect) issueSelect.value = "ALL";
        renderFilters();
        renderArticles();
      });
    }
    return;
  }

  articlesContainer.innerHTML = filtered
    .map((art) => {
      const badgeClass = getCategoryBadgeClass(art.category);
      const deadlineHtml = art.deadline
        ? `
        <div class="flex items-center gap-1.5 text-xs font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-md mt-2 w-fit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Plazo: ${art.deadline}</span>
        </div>`
        : "";

      const extLinksHtml =
        art.external_links && art.external_links.length > 0
          ? `<div class="mt-4 pt-3 border-t border-base-200 flex flex-wrap gap-2">
              <span class="text-xs text-base-content/60 self-center">Enlaces:</span>
              ${art.external_links
                .map(
                  (l) =>
                    `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline hover:btn-primary gap-1 max-w-[220px] truncate" title="${l.text}">
                      <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      <span class="truncate">${l.text}</span>
                    </a>`
                )
                .join("")}
            </div>`
          : "";

      return `
        <article class="card card-bordered bg-base-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div class="card-body p-5">
            <div class="flex items-start justify-between gap-2 flex-wrap mb-2">
              <span class="badge ${badgeClass} text-xs font-medium">${art.category}</span>
              <span class="text-xs text-base-content/60 font-medium">Edición #${art.issue_num} • ${art.issue_date}</span>
            </div>
            
            <h3 class="card-title text-base sm:text-lg font-bold leading-snug hover:text-primary transition-colors">
              <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="flex items-start gap-1">
                <span>${art.title}</span>
              </a>
            </h3>

            ${deadlineHtml}

            <p class="text-sm text-base-content/80 mt-3 line-clamp-3 leading-relaxed">
              ${art.body_text}
            </p>

            ${extLinksHtml}
          </div>

          <div class="card-footer bg-base-200/40 px-5 py-3 border-t border-base-200 flex items-center justify-between">
            <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="btn btn-link btn-xs p-0 text-primary font-semibold gap-1">
              <span>Ver en newsletter</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

// Search Input Listener with Debounce
if (searchInput) {
  let debounceTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuery = e.target.value;
      renderArticles();
    }, 200);
  });
}

// Theme Toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const themes = ["light", "dark", "corporate", "luxury"];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    currentTheme = nextTheme;
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    showToast(`Tema cambiado a: ${currentTheme}`);
  });
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  setupCopyButtons();
  loadData();
});
