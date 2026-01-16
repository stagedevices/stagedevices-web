import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SYNCTIMER_VERSION": JSON.stringify(
      process.env.npm_package_config_synctimerVersion ?? "v0.0",
    ),
    "import.meta.env.VITE_TENNEY_VERSION": JSON.stringify(
      process.env.npm_package_config_tenneyVersion ?? "v0.0",
    ),
    "import.meta.env.VITE_PRIVACY_URL": JSON.stringify(
      process.env.npm_package_config_privacyUrl ?? "https://example.com/privacy",
    ),
  },
});
