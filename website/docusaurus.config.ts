import type {
  Options as PresetOptions,
  ThemeConfig,
} from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const lightTheme = themes.github;
const darkTheme = themes.dracula;

const defaultPresets = {
  sidebarPath: './sidebars.ts',
  editUrl:
    'https://github.com/FormidableLabs/react-native-ama/tree/main/website',
  remarkPlugins: [
    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
  ],
  admonitions: {
    keywords: ['dev', 'note', 'tip', 'caution', 'danger', 'info', 'warn'],
  },
};

const config: Config = {
  title: 'React Native AMA',
  tagline: 'A comprehensive drop-in accessibility library for React Native.',
  url: 'https://commerce.nearform.com/',
  favicon: 'img/nearform-icon.svg',
  baseUrl:
    process.env.VERCEL_ENV === 'preview'
      ? '/'
      : '/open-source/react-native-ama/',
  // TODO: change in throw
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'NearForm',
  customFields: {
    pastOrganizationName: 'FormidableLabs',
    latestMinorVersions: ['0.7.5', '1.0.1'], // this is the latest patch version for each minor version
  },
  projectName: 'react-native-ama',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          // routeBasePath: 'docs',
          ...defaultPresets,
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies PresetOptions,
    ],
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
      },
    ],
  ],
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom'),
    async function tailwindPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins = [
            require('postcss-import'),
            require('tailwindcss'),
            require('autoprefixer'),
          ];
          return postcssOptions;
        },
      };
    },
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
        id: 'animations',
        path: '../packages/animations/docs',
        routeBasePath: '/animations/',
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
        id: 'react-native',
        path: '../packages/react-native/docs',
        routeBasePath: '/react-native/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lists',
        path: '../packages/lists/docs',
        routeBasePath: '/lists/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'extras',
        path: '../packages/extras/docs',
        routeBasePath: '/extras/',
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guidelines',
        path: 'guidelines',
        routeBasePath: 'guidelines',
        async sidebarItemsGenerator({
          defaultSidebarItemsGenerator,
          numberPrefixParser,
          item,
          version,
          docs,
          categoriesMetadata,
          isCategoryIndex,
        }) {
          // Example: return an hardcoded list of static sidebar items
          return [
            { type: 'doc', id: 'bottomsheet' },
            { type: 'doc', id: 'bottomsheet' },
          ];
        },
        ...defaultPresets,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'checklist',
        path: 'checklist',
        routeBasePath: '/checklist/',
        ...defaultPresets,
      },
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'React Native AMA',
      logo: {
        alt: 'Nearform logo',
        src: 'img/nearform-logo-white.svg',
      },
      items: [
        {
          label: 'Documentation',
          to: '/docs/',
        },
        {
          position: 'left',
          label: 'Guidelines',
          to: '/guidelines/',
        },
        {
          label: 'Checklist',
          position: 'left',
          to: '/checklist/',
        },
        {
          label: 'Packages',
          type: 'dropdown',
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
              label: 'React Native',
              to: '/react-native/',
            },
            {
              label: 'Lists',
              to: '/lists/',
            },
            {
              label: 'Extras',
              to: '/extras/',
            },
          ],
        },
        {
          type: 'docsVersionDropdown',
          dropdownItemsAfter: [{ to: '/versions', label: 'All versions' }], // Add additional dropdown items at the end of the dropdown.
          dropdownActiveClassDisabled: true, //Do not add the link active class when browsing docs.
          position: 'right',
        },
        {
          href: 'https://github.com/FormidableLabs/react-native-ama',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
          position: 'right',
        },
        {
          href: 'https://commerce.nearform.com/',
          className: 'header-nearform-link',
          'aria-label': 'Nearform Commerce Website',
          position: 'right',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'Nearform logo',
        src: 'img/nearform-logo-white.svg',
        href: 'https://commerce.nearform.com',
        width: 100,
        height: 100,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Nearform`,
    },
    prism: {
      theme: lightTheme,
      darkTheme: darkTheme,
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
  } satisfies ThemeConfig,
};

export default config;
