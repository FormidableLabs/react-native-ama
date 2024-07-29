import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const SIDEBAR_POSITION_REGEX = /sidebar_position:\s?(\d+)/m;
const TITLE_EXTRACTOR = /^#\s?(.*)$/m;

/**
 * Looks like Docusaurus has an issue autogenerating docs for multi doc instance
 * https://stackoverflow.com/questions/77528478/sidebar-wont-autogenerate-with-docs-multi-instances-on-docusaurus
 */
function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function autoGenerate(path: string) {
  const fs = require('fs');
  const files = fs.readdirSync(path);

  return files
    .map((file: string) => {
      if (!file.endsWith('.md') || file === 'index.md') {
        return null;
      }

      const name = file.replace('.md', '');
      const content = fs.readFileSync(`${path}/${file}`, {
        encoding: 'utf8',
        flag: 'r',
      });
      const position = content.match(SIDEBAR_POSITION_REGEX)?.[1];
      const title = content.match(TITLE_EXTRACTOR)?.[1];

      return {
        type: 'link',
        label: title ?? capitalizeFirstLetter(name.replace('-', ' ')),
        href: name,
        autoAddBaseUrl: true,
        position: parseInt(position ?? 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // sort by position
      if (a.position === b.position) {
        return 0;
      }

      return a.position > b.position ? -1 : 1;
    })
    .map(({ position, ...rest }) => {
      return rest;
    });
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars: SidebarsConfig = {
  docs: [
    ...autoGenerate('docs/ama'),
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
  guidelines: [autoGenerate('guidelines')],
  checklist: [autoGenerate('checklist')],
};

export default sidebars;
