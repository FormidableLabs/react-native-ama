import React from 'react';
import Desktop from '@theme-original/DocItem/TOC/Desktop';
import { useDoc } from '@docusaurus/theme-common/internal';

import { AMASidebar } from './AMASidebar';

export default function DesktopWrapper(props) {
  const { frontMatter } = useDoc();

  const shouldRenderAMASidebar = Boolean(frontMatter.ama_severity);

  return shouldRenderAMASidebar ? (
    <div className="with-ama-sidebar">
      <AMASidebar />
      <Desktop {...props} />
    </div>
  ) : (
    <Desktop {...props} />
  );
}
