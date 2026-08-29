# 📰 HeterodoxRSS - Flux & Portail pour Heterodox Economics Newsletter

Service automatisé et portail web permettant de convertir les publications de la [Heterodox Economics Newsletter](https://www.heterodoxnews.com/) en **flux RSS** standardisés et de faciliter la recherche et la consultation interactive d'appels à communications, de revues, d'ouvrages et d'offres d'emploi académiques.

Conçu avec **FlyonUI** + **Tailwind CSS**, packagé avec **Vite** et automatisé avec **GitHub Actions** pour un déploiement gratuit sur **GitHub Pages**.

---

## 🚀 Fonctionnalités Principales

- **Détection et extraction automatiques des nouveaux numéros** : Le scraper (`scripts/scraper.py`) consulte les archives d'HeterodoxNews et surveille en continu la publication de nouveaux numéros (`htn363.html`, `htn364.html`, etc.).
- **Plusieurs flux RSS 2.0 prêts à l'emploi** :
  - `feed.xml` : **Flux par Édition Complète** — Chaque entrée correspond à un numéro de la newsletter avec son éditorial complet et sa table des matières avec liens.
  - `journals.xml` : **Flux Exclusif Revues / Journaux** — Uniquement les nouvelles parutions, sommaires et numéros spéciaux de revues hétérodoxes.
  - `articles.xml` : **Flux Granulaire Général** — Chaque entrée est une annonce individuelle (*Appels à communications / Call for Papers*, *Revues*, *Livres*, *Offres d'emploi*, *Prix académiques*, etc.) avec sa date limite et son ancre directe (`#art-...`).
  - `cfp.xml`, `jobs.xml`, `books.xml` : Flux thématiques directs filtrés par catégorie.
- **Portail Web avec FlyonUI** :
  - Copie en 1 clic de l'URL de chaque flux avec confirmation visuelle.
  - Moteur de recherche en temps réel par mots-clés, auteurs, universités et thèmes.
  - Filtrage interactif par catégories et sélecteur d'éditions précédentes.
  - Lecteur intégré pour l'éditorial du dernier numéro.
  - Guide rapide pour configurer les flux dans vos lecteurs RSS comme NetNewsWire, Feedly, Inoreader, Thunderbird ou vos canaux Slack/Discord.
  - Prise en charge des thèmes Clair / Sombre (*Light / Dark*).
- **100% Serverless et Gratuit** : S'exécute périodiquement via un cron GitHub Actions et est hébergé sur GitHub Pages.

---

## 📡 URLs des Flux

Une fois déployés sur GitHub Pages, les flux seront disponibles aux adresses suivantes :

- 📖 **Flux Revues uniquement** : `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/journals.xml`
- 📰 **Flux par Édition Complète** : `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/feed.xml`
- 📣 **Flux Toutes les Annonces** : `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/articles.xml`
- 🎯 **Flux thématiques directs** :
  - `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/cfp.xml` (Appels à communications / Call for Papers)
  - `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/jobs.xml` (Offres d'emploi)
  - `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/books.xml` (Livres)
- 💾 **Jeu de données JSON pour les développeurs** : `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/data.json`

---

## 🛠️ Structure du Répertoire

```
economic-rss/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Workflow automatique GitHub Actions
├── scripts/
│   ├── scraper.py            # Script Python d'extraction et générateur RSS / JSON
│   └── requirements.txt      # Dépendances Python (beautifulsoup4, requests)
├── public/
│   ├── feed.xml              # RSS par édition (généré)
│   ├── articles.xml          # RSS par article (généré)
│   └── data.json             # Données structurées (généré)
├── src/
│   ├── main.js               # Logique interactive côté client
│   └── style.css             # Styles Tailwind CSS + FlyonUI
├── index.html                # Interface web principale
├── package.json              # Dépendances JS et scripts pnpm
├── vite.config.js            # Configuration Vite pour GitHub Pages
└── README.md
```

---

## 💻 Développement Local

### Prérequis :
- Python 3.10+
- Node.js 20+
- `pnpm` (version 10+)

### 1. Installer les dépendances

```bash
# Dépendances Python
pip install -r scripts/requirements.txt

# Dépendances Node avec pnpm
pnpm install
```

### 2. Exécuter le Scraper pour actualiser les flux et les données

```bash
pnpm run scrape
# ou directement :
python3 scripts/scraper.py
```

### 3. Démarrer le serveur de développement

```bash
pnpm dev
```
Ouvrez votre navigateur à l'adresse `http://localhost:3000`.

### 4. Compiler pour la production

```bash
pnpm build
pnpm preview
```

---

## ⚙️ Configuration pour le Déploiement sur GitHub Pages

Pour publier votre site web et vos flux sur GitHub Pages :

1. **Pousser le code vers votre dépôt GitHub** (branche `main`).
2. Sur GitHub, accédez à **Settings** > **Pages** dans votre dépôt.
3. Dans la section **Build and deployment** > **Source**, sélectionnez **`GitHub Actions`**.
4. C'est tout ! À chaque `git push` ou tous les jours à 06:00 UTC (selon la planification cron dans `.github/workflows/deploy.yml`), GitHub Actions :
   - Exécutera le scraper pour vérifier les nouveaux numéros.
   - Générera les flux et compilera le site web avec Vite et FlyonUI.
   - Déploiera le site mis à jour à l'adresse `https://<VOTRE-UTILISATEUR>.github.io/<NOM-DU-DEPOT>/`.

---

## 📄 Crédits et Licence

- Les contenus et textes appartiennent à la publication originale de **[Heterodox Economics Newsletter](https://www.heterodoxnews.com/)** éditée par Jakob Kapeller.
- Interface créée avec [FlyonUI](https://flyonui.com/) et [Tailwind CSS](https://tailwindcss.com/).
- Code du scraper et du portail publié sous licence MIT.
