// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes } from 'prism-react-renderer';

const defaultPresets = {
  sidebarPath: require.resolve('./sidebars.js'),
  editUrl:
    'https://github.com/FormidableLabs/react-native-ama/tree/main/website',
  remarkPlugins: [
    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
  ],
  admonitions: {
    keywords: ['dev', 'note', 'tip', 'caution', 'danger', 'info', 'warn'],
  },
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native AMA',
  tagline: 'Accessible Mobile App Library for React Native',
  url: 'https://commerce.nearform.com/',
  favicon: 'img/nearform-icon.svg',
  baseUrl:
    process.env.VERCEL_ENV === 'preview'
      ? '/'
      : '/open-source/react-native-ama/',
  // TODO: change in throw
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
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
      {
        docs: {
          path: '../docs/ama',
          routeBasePath: '/',
          ...defaultPresets,
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'core',
        path: '../packages/core/docs',
        routeBasePath: '/core/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'forms',
        path: '../packages/forms/docs',
        routeBasePath: '/forms/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guidelines',
        path: '../docs/guidelines',
        routeBasePath: '/guidelines/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'checklist',
        path: '../docs/checklist',
        routeBasePath: '/checklist/',
        ...defaultPresets,
      },
    ],
  ],
  themeConfig: {
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
          to: '/forms/',
        },
        {
          label: 'Extras',
          to: '/extras/',
        },
        {
          label: 'Guidelines',
          to: '/guidelines/',
        },
        {
          label: 'Checklist',
          to: '/checklist/',
        },
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
      theme: themes.github,
      darkTheme: themes.dracula,
      magicComments: [
        {
          className: 'dimmed',
          line: 'dimmed',
        },
      ],
    },
    zoom: {
      selector: '.zoom-me',
    },
  },
};

module.exports = config;
