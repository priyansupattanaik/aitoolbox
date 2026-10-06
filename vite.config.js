import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function catalogFile() {
  return {
    name: "catalog-file",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== "/data.MD") return next();
        res.setHeader("content-type", "text/markdown; charset=utf-8");
        fs.createReadStream("data.MD").pipe(res);
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "data.MD",
        source: fs.readFileSync("data.MD"),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), catalogFile()],
  server: { port: 5173, host: true },
});
