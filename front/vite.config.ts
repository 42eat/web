import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import solidSvg from "vite-plugin-solid-svg"
import path from "path";

export default defineConfig({
	plugins: [devtools(), solidPlugin(), solidSvg()],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src")
		}
	},
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "")
			}
		}
	},
	build: {
		target: 'esnext',
	},
});
