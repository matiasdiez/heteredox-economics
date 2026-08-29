# 📰 HeterodoxRSS - Heterodox Economics Newsletter Feed & Portal

Automated service and web portal to convert [Heterodox Economics Newsletter](https://www.heterodoxnews.com/) publications into standardized **RSS feeds** and provide interactive search and consultation of academic calls, journals, books, and job opportunities.

Built with **FlyonUI** + **Tailwind CSS**, bundled with **Vite**, and automated with **GitHub Actions** for free deployment on **GitHub Pages**.

---

## 🚀 Key Features

- **Automatic detection and extraction of new issues**: The scraper (`scripts/scraper.py`) queries the HeterodoxNews archive and continuously checks for new issues (`htn363.html`, `htn364.html`, etc.).
- **Multiple ready-to-use RSS 2.0 Feeds**:
  - `feed.xml`: **Full Edition Feed** — Each entry is a newsletter release containing its full editorial note and table of contents with links.
  - `journals.xml`: **Exclusive Journals Feed** — Only new publications, table of contents, and special issues from heterodox journals.
  - `articles.xml`: **Granular General Feed** — Each entry is an individual announcement (*Call for Papers*, *Journals*, *Books*, *Job Postings*, *Awards*, etc.) with its deadline and direct anchor (`#art-...`).
  - `cfp.xml`, `jobs.xml`, `books.xml`: Direct category-filtered feeds.
- **Web Portal with FlyonUI**:
  - 1-click copy for each feed URL with visual confirmation.
  - Real-time search engine by keywords, authors, universities, and topics.
  - Interactive category filter and past issues selector.
  - Integrated reader for the latest edition's editorial note.
  - Quick guide to configure feeds in RSS readers such as NetNewsWire, Feedly, Inoreader, Thunderbird, or Slack/Discord channels.
  - Light / Dark theme support.
- **100% Serverless and Free**: Runs periodically via a cron job in GitHub Actions and is hosted on GitHub Pages.

---

## 📡 Feed URLs

Once deployed to GitHub Pages, the feeds will be available at:

- 📖 **Journals Only Feed**: `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/journals.xml`
- 📰 **Full Edition Feed**: `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/feed.xml`
- 📣 **All Announcements Feed**: `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/articles.xml`
- 🎯 **Direct Topic Feeds**:
  - `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/cfp.xml` (Call for Papers)
  - `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/jobs.xml` (Job Postings)
  - `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/books.xml` (Books)
- 💾 **JSON Dataset for Developers**: `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/data.json`

---

## 🛠️ Repository Structure

```
economic-rss/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automatic GitHub Actions workflow
├── scripts/
│   ├── scraper.py            # Python scraper and RSS / JSON generator
│   └── requirements.txt      # Dependencies (beautifulsoup4, requests)
├── public/
│   ├── feed.xml              # Edition RSS (generated)
│   ├── articles.xml          # Article RSS (generated)
│   └── data.json             # Structured dataset (generated)
├── src/
│   ├── main.js               # Client interactive logic
│   └── style.css             # Tailwind CSS + FlyonUI styles
├── index.html                # Main web interface
├── package.json              # JS dependencies and pnpm scripts
├── vite.config.js            # Vite configuration for GitHub Pages
└── README.md
```

---

## 💻 Local Development

### Prerequisites:
- Python 3.10+
- Node.js 20+
- `pnpm` (version 10+)

### 1. Install dependencies

```bash
# Python dependencies
pip install -r scripts/requirements.txt

# Node dependencies with pnpm
pnpm install
```

### 2. Run the Scraper to update feeds and data

```bash
pnpm run scrape
# or directly:
python3 scripts/scraper.py
```

### 3. Start development server

```bash
pnpm dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for production

```bash
pnpm build
pnpm preview
```

---

## ⚙️ Configuration for GitHub Pages Deployment

To publish your website and feeds on GitHub Pages:

1. **Push the code to your GitHub repository** (`main` branch).
2. On GitHub, go to **Settings** > **Pages** in your repository.
3. Under **Build and deployment** > **Source**, select **`GitHub Actions`**.
4. That's it! Every time you run `git push` or daily at 06:00 UTC (as scheduled in `.github/workflows/deploy.yml`), GitHub Actions will:
   - Run the scraper to check for new issues.
   - Generate feeds and build the web application with Vite and FlyonUI.
   - Deploy the updated site to `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`.

---

## 📄 Credits and License

- Contents and texts belong to the original publication of **[Heterodox Economics Newsletter](https://www.heterodoxnews.com/)** edited by Jakob Kapeller.
- Interface built with [FlyonUI](https://flyonui.com/) and [Tailwind CSS](https://tailwindcss.com/).
- Scraper and portal code released under the MIT License.
