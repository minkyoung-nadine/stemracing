# STEM Racing — Team site

Static multi-page site for F1 in Schools / STEM Racing. No build step.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats marquee, build log |
| `team.html` | Crew — 6 role cards from data |
| `sponsors.html` | Sponsors — tiered grid from data |
| `car.html` | Car — blueprint, spec sheet, engineering log |
| `garage.html` | 3D viewer — Three.js (primitive car or `car.glb`) |

## Local preview

ES modules and import maps need a local server (not `file://`):

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Open `http://localhost:8080`

## What to edit first

### Team name & logo

- Replace `assets/img/logo.svg` with your logo.
- Search/replace `YOUR TEAM` and `YOUR` in HTML files (or add a small `assets/data/site.js` later).

### Team members — `assets/data/team.js`

```js
{
  role: "principal", // principal | design | manufacturing | graphic | resource | marketing
  name: { ko: "홍길동", en: "Gildong Hong" },
  duty: { ko: "...", en: "..." },
  tools: ["Fusion 360"],
  photo: "assets/img/team/member1.jpg",
}
```

Put photos in `assets/img/team/` (create folder).

### Sponsors — `assets/data/sponsors.js`

```js
{
  tier: "title", // title | premier | supporter | inkind
  name: "Company",
  logo: "assets/img/sponsors/logo.svg",
  url: "https://...",
  since: "2025",
  blurb: { ko: "...", en: "..." },
}
```

Empty array = all tiers hidden. CTA block still shows.

### Colours & fonts — `assets/css/tokens.css`

- `--color-accent` — match team brand (default signal red `#d72638`)
- `--color-paper` — page background

### Translations — `assets/data/i18n.js`

Keys used by `data-i18n="..."` in HTML. Toggle stores `localStorage.lang` (`ko` / `en`).

### Car specs — `car.html`

Update table cells and blueprint labels with measured values.

### 3D model — `assets/models/car.glb`

Export GLB from Fusion 360 / Blender. See `assets/models/README.md`. Garage auto-loads when file exists.

## Directory

```
assets/
  css/          tokens, base, components, pages/*
  data/         i18n.js, team.js, sponsors.js
  img/          logo, placeholders, sponsors/
  js/           i18n, nav, team-render, sponsors-render, garage
  models/       car.glb (optional)
```

## Deploy

Upload the project folder to GitHub Pages, Netlify, or Vercel static hosting. No build required.
