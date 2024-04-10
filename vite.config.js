import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        minify: "terser", // ? usar solo default devuelve fallos en Kaboom con código que no funciona
    }
})