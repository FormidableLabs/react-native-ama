// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native AMA',
  tagline: 'Accessible Mobile App Library for React Native',
  url: 'https://formidable.com',
  baseUrl:
    process.env.VERCEL_ENV === 'preview'
      ? '/'
      : '/open-source/react-native-ama/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'FormidableLabs',
  projectName: 'react-native-ama',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/FormidableLabs/react-native-ama/tree/main/website',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'animations',
        path: '../packages/animations/docs',
        routeBasePath: '/animations/',
        sidebarPath: require.resolve('./sidebars.js'),
        // Please change this to your repo.
        // Remove this to remove the "edit this page" links.
        editUrl:
          'https://github.com/FormidableLabs/react-native-ama/tree/main/website',
        remarkPlugins: [
          [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
        ],
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'React Native AMA',
        logo: {
          alt: 'React Native AMA Logo',
          src: 'img/formidable-f.svg',
        },
        items: [
          {
            label: 'Core',
            to: '/core/',
          },
          {
            label: 'Animations',
            to: '/animations/',
          },
          {
            label: 'Forms',
            to: 'forms',
          },
          {
            label: 'Extras',
            to: '/extras/',
          },
          // Formidable/GitHub icons on right
          {
            href: 'https://github.com/FormidableLabs/react-native-ama',
            className: 'header-github-link',
            'aria-label': 'GitHub Repository',
            position: 'right',
          },
          {
            href: 'https://formidable.com',
            className: 'header-formidable-link',
            'aria-label': 'Formidable Website',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Formidable`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
