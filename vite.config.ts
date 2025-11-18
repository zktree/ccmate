import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	css: {
		postcss: "./postcss.config.js",
	},

	// utools 插件开发配置
	base: "./",
	server: {
		port: 5173,
		host: "0.0.0.0",
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, "index.html"),
			},
		},
	},
	publicDir: "public",
});
