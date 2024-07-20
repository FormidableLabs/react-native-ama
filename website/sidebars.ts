import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars: SidebarsConfig = {
  sidebar: [
    { type: 'autogenerated', dirName: '.' }, // By default, Docusaurus generates a sidebar from the docs folder structure
    {
      type: 'category',
      label: 'Packages',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Core',
          href: '/core/',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Animations',
          href: '/animations/',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Forms',
          href: '/forms/',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'React Native',
          href: '/react-native/',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Lists',
          href: '/lists/',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Extras',
          href: '/extras/',
          autoAddBaseUrl: true,
        },
      ],
    },
  ],
};

export default sidebars;
