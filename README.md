# Stage Devices — Blueprint Lab Table

A Vite + React + TypeScript marketing site for Stage Devices, featuring dual Blueprint/Drafting themes and modular, motion-rich UI primitives.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Icons

Drop product icons in:

```
public/assets/icon-synctimer.png
public/assets/icon-tenney.png
```

If an icon is missing, the UI automatically falls back to an inline SVG mark.

## GitHub Pages deployment

This project is already configured for the base path `https://stagedevices.github.io/stagedevices-web/`.

1. Run `npm run build` to generate the `dist/` directory.
2. Deploy the `dist/` folder to GitHub Pages (e.g. configure Pages to publish from the `dist/` folder on your chosen branch).
3. Ensure the repository settings point to `/stagedevices-web` when publishing.

## Optional Paper Shaders

`ShaderBackdrop` is present as a progressive enhancement hook, disabled by default. Enable it only after adding the Paper Shaders dependency and keep the CSS/SVG backdrop as the baseline.

## Manual test checklist

- Theme toggle changes visuals AND interaction primitives (scanline vs trace, spotlight behavior).
- Hover hero: blueprint scanline appears intermittently; drafting shows pencil trace.
- Explore opens chooser overlay; “View” opens product sheet; closing returns correctly.
- `prefers-reduced-motion`: no drift, no scanline/trace; UI still beautiful.
- Routes render with the same Shell/backdrop; corner control works everywhere.
- Works under GitHub Pages base path (`/stagedevices-web`).
- No console errors.
