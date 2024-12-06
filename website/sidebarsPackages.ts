import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars: SidebarsConfig = {
  docs: [
    { type: 'autogenerated', dirName: '.' },
    {
      type: 'category',
      label: 'Packages',
      collapsible: true,
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'AMA Packages',
        description: 'Learn about the packages `@react-native-ama` offers!',
        slug: '/packages',
        keywords: ['packages'],
      },
      items: [
        {
          type: 'link',
          label: 'Core',
          href: '/core/',
          description:
            'The core functionality needed to create an app with accessibility in mind',
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
          description: 'Extends React Native components with accessibility',
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
