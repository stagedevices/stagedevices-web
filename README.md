README.md
# Stage Devices — Home

Typography-first, austere, monochrome homepage (single route) built with:
- Vite + React + TypeScript
- React Router
- Tailwind
- Framer Motion
- IBM Plex Mono (self-hosted via @fontsource)

## Run
```bash
npm i
npm run dev

Build
npm run build
npm run preview

Customize

Theme variables: src/styles.css

Download targets + copy: src/routes/Home.tsx

Replace icons: src/assets/synctimer.svg + src/assets/tenney.svg

Shader (optional)

The hero includes a decorative WebGL shader that auto-disables for reduced motion / save-data / low-power.
Remove src/components/HeroShader.tsx and its usage in Home.tsx to drop it entirely.

