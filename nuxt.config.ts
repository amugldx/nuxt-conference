// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['~/assets/css/main.css'],
	modules: ['@nuxtjs/supabase', '@formkit/nuxt'],
	experimental: {
		reactivityTransform: true,
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
