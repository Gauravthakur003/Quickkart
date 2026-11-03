# QuickKart — React + Vite + Tailwind CSS

The original QuickKart storefront and admin pages have been migrated into React page components.
The original CSS and JavaScript files, image assets, labels, layout and behaviour are retained to
preserve the existing appearance and functionality during the framework migration. Tailwind CSS v4
is configured and available for utility styling as components are progressively modernized.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Structure

- `src/pages/` — customer-facing React pages
- `src/admin/` — admin React pages
- `src/App.jsx` — React Router routes (including legacy `.html` aliases)
- `src/index.css` — Tailwind theme and utility layers
- `public/css/` — original QuickKart stylesheets, loaded per page
- `public/js/` — original QuickKart JavaScript functionality
- `public/assets/` — original product and hero images

## Migration note

Original stylesheets are intentionally retained and loaded page-by-page so the existing design is not
accidentally changed by a broad CSS rewrite. Tailwind is configured without its preflight reset to
avoid altering the original page rendering. The existing JavaScript is loaded after each React page
mounts so its DOM-based features continue to initialize.
