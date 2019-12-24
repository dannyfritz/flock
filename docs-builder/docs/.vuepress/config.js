module.exports = {
  title: 'Flock',
  description: 'A simple, but powerful Entity Component System',
  base: '/flock-ecs/',
  dest: '../docs',
  themeConfig: {
    search: false,
    sidebarDepth: 2,
    logo: '/logo.png',
    nav: [
      { text: 'About', link: '/' },
      { text: 'Guide', link: '/guide/GettingStarted' },
      { text: 'API', link: '/api/_index_.world' }
    ],
    sidebar: {
      "/guide/": [
        "GettingStarted",
      ],
      "/api/": [
        "_index_.world",
        "_index_.entity",
        "_index_.component",
        "_index_.system",
        "_index_.current",
        "_index_.without",
        "_index_.added",
        "_index_.removed",
      ],
      "/": [""],
    },
    repo: 'dannyfritz/flock-ecs',
    docsDir: 'docs-builder/docs',
    docsBranch: 'dev',
    editLinks: true,
    lastUpdated: true
  },
};
