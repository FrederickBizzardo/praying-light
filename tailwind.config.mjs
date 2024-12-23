/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'Onest': ['Onest-Regular'],
				'OnestB': ['Onest-Black'],
				'Inter': ['Inter-Regular'],
				'InterI': ['Inter-Italic'],
				'Archivo': ['Archivo-Bold'],
			},
		},
	},
	plugins: [],
}
