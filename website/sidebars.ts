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
          description: 'Needed to create an app with accessibility in mind',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Animations',
          href: '/animations/',
          description:
            'Used to handle accessibility within animations using react-native Animated or react-native-reanimated',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Forms',
          href: '/forms/',
          description: 'Used to create accessible forms',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'React Native',
          href: '/react-native/',
          description: 'Extends react-native components with accessibility',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Lists',
          href: '/lists/',
          description: 'Used to create accessible lists',
          autoAddBaseUrl: true,
        },
        {
          type: 'link',
          label: 'Extras',
          href: '/extras/',
          description: 'Provides extra accessible components and hooks',
          autoAddBaseUrl: true,
        },
      ],
    },
  ],
};

export default sidebars;
