# holoptic.org

Corporate website for **Holoptic Kft.**, live at <https://holoptic.org>.

The site is a single-page React app built with Vite, served as static files from GitHub Pages.

## Tech stack

| Area      | Tool                                        |
| --------- | ------------------------------------------- |
| UI        | React 18                                    |
| Routing   | React Router 6 (`BrowserRouter`)            |
| Build     | Vite 5 with `@vitejs/plugin-react`          |
| Styling   | One plain CSS file (`src/index.css`)        |
| Fonts     | Google Fonts: DM Sans and Libre Baskerville |
| Analytics | Umami Cloud                                 |
| Hosting   | GitHub Pages, deployed by GitHub Actions    |

## Requirements

- Node.js 24 (the version CI uses)
- npm (comes with Node)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:5173> and reloads as you edit.

## Scripts

| Command           | What it does                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite dev server.                                                                                                     |
| `npm run build`   | Builds the production site into `dist/`, then copies `index.html` to `dist/404.html` (see [Routing](#routing-on-github-pages)). |
| `npm run preview` | Serves the built `dist/` folder locally, so you can check it before deploying.                                                  |

### Formatting

Prettier is a dev dependency, but there's no config file or npm script for it, so it runs with its default settings:

```bash
npx prettier --write src index.html
```

## Project structure

```
.
├── index.html               # HTML shell: SEO, Open Graph/Twitter, JSON-LD, Umami
├── vite.config.js           # Vite config (base "/", output in dist/)
├── public/                  # Copied unchanged to the root of dist/
│   ├── CNAME                # Custom domain for GitHub Pages
│   └── images/              # Logos, background photos, social preview image
├── src/
│   ├── main.jsx             # Entry point: mounts <App/> and imports index.css
│   ├── App.jsx              # Route table (one tree, optional language prefix)
│   ├── index.css            # All site styles
│   ├── i18n/
│   │   ├── languages.js     # Supported languages, URL helpers, language detection
│   │   ├── I18n.jsx         # LangLayout route element, useI18n(), document language/SEO tags
│   │   └── en.js … es.js    # One dictionary per language (en.js is the master copy)
│   ├── components/
│   │   ├── Layout.jsx       # Header, page content, Footer; scrolls to top on page change
│   │   ├── Header.jsx       # Logo, navigation, mobile menu, language switcher
│   │   ├── LanguageSwitcher.jsx
│   │   ├── Footer.jsx
│   │   ├── Emblem.jsx       # Animated inline logo (draw-on, bezel, pulses, shine, scroll)
│   │   ├── EmblemParticles.jsx  # Logo as gold particles (Home, Private AI box)
│   │   ├── WaveField.jsx    # Interactive WebGL dot wave (Home, About)
│   │   └── EnterpriseExperience.jsx  # Section used on Home
│   └── pages/
│       ├── Home.jsx
│       ├── Expertise.jsx
│       ├── About.jsx
│       └── Contact.jsx
└── .github/workflows/deploy.yml  # Builds and deploys on every push to main
```

## Pages and routing

Routes are defined in `src/App.jsx`. Every path also exists with a language prefix (see [Languages](#languages)):

| Path         | Component   |
| ------------ | ----------- |
| `/`          | `Home`      |
| `/expertise` | `Expertise` |
| `/about`     | `About`     |
| `/contact`   | `Contact`   |
| any other    | `Home`      |

To add a page:

1. Create the component in `src/pages/`.
2. Add a `<Route>` for it inside the `/:lang?` route in `src/App.jsx`.
3. Add its text to every dictionary in `src/i18n/` (at least `en.js`; other languages fall back to English).
4. Add a `[path, key]` entry to the `links` array in `src/components/Header.jsx`, and a `<Link to={lp(path)}>` in `Footer.jsx` if it belongs there too. Always build internal links with `lp()` from `useI18n()` so they stay in the current language.

The Contact page form posts to [Formspree](https://formspree.io/) (the same form as ai.holoptic.org). Each enquiry includes `source=holoptic.org` and the visitor's `language`; the topic is always sent in English.

## Languages

The site is available in English, Hungarian, Swedish, German, French, Italian and Spanish.

- **URLs:** English is at the root (`/about`); other languages use a prefix (`/hu/about`, `/de/about`, …). `/en/...` redirects to the unprefixed URL.
- **Detection:** on the first English URL of a visit, the visitor is sent to their saved choice (`localStorage` key `holoptic-lang`) or, failing that, the first supported language in their browser settings. Choosing a language in the switcher saves it. Prefixed URLs are never redirected.
- **Text:** each language has a dictionary in `src/i18n/`. `en.js` is the master copy; anything a translation leaves out falls back to English, item by item. Components read text with `const { d } = useI18n()`.
- **SEO:** `LangLayout` sets `<html lang>`, the page title and description, the canonical URL and `hreflang` alternates for every page. Link previews (Open Graph) come from the static `index.html` and stay in English.
- **Not translated on purpose:** the HOLOPTIC / TECHNOLOGY ENGINEERING lock-up, "Private AI", company and technology names, and the enquiry email subject.

To add a language, add it to `LANGUAGES` in `src/i18n/languages.js`, create its dictionary, and import it in `src/i18n/I18n.jsx`.

### Routing on GitHub Pages

GitHub Pages only serves real files. If someone opens or reloads a path like `/about` or `/hu/about` directly, Pages finds no file there and serves `404.html` instead. The build script copies `index.html` to `dist/404.html`, so that response is the app itself, and React Router then shows the right page.

Visitors see the correct page, but the HTTP status is still 404. That's a limitation of GitHub Pages.

## Styling

All styles live in `src/index.css`. The first part of the file is minified into a few long lines: the base theme, layout, and the breakpoints at `850px` and `580px`. The page-specific rules below that are written out in normal formatting.

The theme colors are CSS custom properties on `:root`:

| Variable  | Value     | Used for                    |
| --------- | --------- | --------------------------- |
| `--navy`  | `#091a2b` | Header, dark sections       |
| `--navy2` | `#10273b` | Secondary dark surface      |
| `--gold`  | `#c9a46c` | Accents, links, buttons     |
| `--cream` | `#f6f3ed` | Light sections              |
| `--muted` | `#64717b` | Body text on light sections |

Background photos are linked from the CSS with absolute paths such as `url('/images/budapest-chain-bridge-night-3200.webp')`.

## Static assets

Anything in `public/` is served from the site root, so `public/images/foo.webp` is available at `/images/foo.webp`. Use WebP for photos.

Each hero photo comes in two widths, `-1600` and `-3200`, picked with `image-set()` for normal and high-density screens. The photos are from Unsplash (free license, no attribution required). When you replace one, delete the old files so `public/images` holds only what the site uses.

| File                                          | Used by                                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `images/holoptic-algiz.svg`                   | Favicon, JSON-LD logo, and the shape `EmblemParticles.jsx` samples (the header logo is `Emblem.jsx`) |
| `images/holoptic-social.png` (1200×630)       | `og:image` / `twitter:image` link previews                                                           |
| `images/holoptic-horizontal.svg`              | Not served on any page; the source for `holoptic-social.png` (see below)                             |
| `images/budapest-chain-bridge-night-*.webp`   | Home hero                                                                                            |
| `images/budapest-parliament-blue-hour-*.webp` | Expertise hero                                                                                       |
| `images/esztergom-basilica-*.webp`            | About hero                                                                                           |
| `images/budapest-ferenciek-dusk-*.webp`       | Contact hero (license plates blurred)                                                                |

### Regenerating the social preview image

`holoptic-social.png` is the horizontal logo centered on a 1200×630 navy canvas. To rebuild it after a logo change (requires `rsvg-convert` and ImageMagick, e.g. `brew install librsvg imagemagick`):

```bash
rsvg-convert -w 1020 public/images/holoptic-horizontal.svg -o /tmp/logo.png
magick -size 1200x630 xc:'#071A2B' /tmp/logo.png -gravity center -composite \
  -strip PNG24:public/images/holoptic-social.png
```

Link previews are cached by the platforms that show them. After deploying a new image, refresh the cache with the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) or a similar tool.

## SEO and analytics

The static `<head>` in `index.html` is written by hand:

- title, description, keywords, canonical URL (English defaults)
- Open Graph and Twitter Card tags
- JSON-LD `Organization` data (name, logo, Budapest address)
- the Umami analytics script (`cloud.umami.is`, website ID set in `data-website-id`)

When the app runs, `LangLayout` (`src/i18n/I18n.jsx`) replaces `<html lang>`, the title, the description and the canonical URL with the current language's values, and adds `hreflang` alternates. Titles and descriptions come from the `meta` section of each dictionary, so they differ by language, not by page. Open Graph tags are not changed, because link-preview crawlers don't run JavaScript.

If you change the company details, update the meta tags, the JSON-LD and the `meta` text in the dictionaries together.

## Deployment

Every push to `main` deploys automatically through `.github/workflows/deploy.yml`:

1. **build**: runs `npm ci` and `npm run build` on Node 24, then uploads `dist/` as the Pages artifact.
2. **deploy**: publishes the artifact with `actions/deploy-pages`.

Merging or pushing to `main` puts changes live, so run `npm run build && npm run preview` first.

Repository settings this relies on:

- **Settings → Pages → Source** must be set to **GitHub Actions**.
- The custom domain comes from `public/CNAME` (`holoptic.org`). DNS for the domain must point to GitHub Pages.

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` is set at the top of the workflow to silence the Node 20 deprecation warnings from the official actions.

## Related sites

- <https://ai.holoptic.org>: the Private AI site, linked from the header and footer. It lives outside this repository.
