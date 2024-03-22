import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
	important: true,
	corePlugins: {
		preflight: false,
	},
	theme: {
		fontFamily: {
			advent: ["Advent Pro", "sans-serif"],
			spaceGrotesk: ["Space Grotesk", "sans-serif"],
		},
		extend: {
			colors: {
				light: {
					primary: "#000",
					secondary: "#2c2c2c",
					accent: "#fff5",
					beige: "#f5f5f4",
				},
				dark: {
					primary: "#fff",
					secondary: "#000",
					accent: "#0005",
					beige: "#2c2c2c",
				},
			},
		},
	},

	plugins: [],
	darkMode: "class",
};
export default config;
