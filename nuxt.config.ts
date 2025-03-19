// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: ["~/plugins/apexcharts.client.ts"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/public/main.css'],
})
