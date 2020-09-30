export default {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'Astral',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'title',
                name: 'title',
                content: 'Astral, the superior image hosting service',
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Astral is a simple and powerful image hosting platform, with great support, competent developers, and a welcoming community.',
            },
            {
                hid: 'theme-color',
                name: 'theme-color',
                content: '#e6394a',
            },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css' },
        ],
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        'vuesax/dist/vuesax.css',
        '~/assets/css/main.css',
        '~/assets/css/dashboard.css',
        '~/assets/css/profile.css',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/vuesax',
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
    // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
    // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {},

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
    },
};
