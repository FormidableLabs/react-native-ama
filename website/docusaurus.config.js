// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native AMA',
  tagline: 'Accessible Mobile App Library for React Native',

  url: 'https://react-native-ama.vercel.app',
  baseUrl: '/',

  // TODO: Re-enable with formideploy
  // url: 'https://formidable.com',
  // baseUrl: '/open-source/react-native-ama/',
  onBrokenLinks: 'warn', // TODO: turn to `error` once ready to fix links
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
            label: 'Components',
            to: '/components/',
          },
          {
            label: 'Hooks',
            to: '/hooks/',
          },
          {
            label: 'Guidelines',
            to: '/guidelines/',
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
        links: [
          // Add footer links here in the future if desired
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Formidable`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
