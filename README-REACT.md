# Holoptic React App

React conversion of the Holoptic website with 3 pages and shared header/footer.

## Setup

```bash
npm install
npm run dev
```

## Structure

- `src/App.jsx` - Main app with routing
- `src/components/` - Shared Header, Footer, Layout
- `src/pages/` - Home, Pricing, Contact pages
- `src/hooks/useI18n.js` - i18n hook for translations
- `src/i18n/translations.js` - Translation strings (EN, HU, SV)
- `assets/` - Images and CSS (reused from original)

## Build

```bash
npm run build
```

The build output will be in the `dist/` folder.
