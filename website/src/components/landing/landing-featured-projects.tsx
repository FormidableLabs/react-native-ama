import {
  FeaturedBadge,
  ProjectBadge,
  FeaturedBadgeName,
} from 'formidable-oss-badges';
import React from 'react';

import { Divider } from './divider';
import { NFLinkButton } from './nf-link-button';

export const DASH_REGEX = /-/g;

export const DEFAULT_BADGE_COLOR_OPTIONS = [
  '#F04D21',
  '#FFC951',
  '#8FD8F7',
  '#D9D9D9',
  '#F9F7F3',
  '#166BFF',
];

function isFeaturedBadgeName(name: string): name is FeaturedBadgeName {
  return [
    'envy',
    'figlog',
    'cloudsplice',
    'ama',
    'renature',
    'victory',
    'spectacle',
    'urql',
    'nuka',
    'owl',
    'groqd',
  ].includes(name);
}

export const LandingFeaturedProjects = <Name extends string>({
  heading,
  projects,
  showDivider,
}: {
  heading: string;
  projects: {
    name: FeaturedBadgeName | Name;
    link: string;
    description: string;
    title?: string;
  }[];
  showDivider?: boolean;
}) => (
  <div className="flex flex-col gap-6 text-center md:text-left mx-16 lg:mx-32 xl:mx-64 mt-12 py-12">
    {showDivider && <Divider />}
    <h2 className="my-8 text-4xl font-semibold">{heading}</h2>
    <div className="grid grid-cols-2 gap-12">
      {projects.map(({ name, link, description, title }) => {
        const lowerCaseName = name.toLocaleLowerCase();
        return (
          <a
            href={link}
            key={link}
            className="col-span-2 sm:col-span-1 flex flex-col lg:flex-row gap-6 align-center items-center text-theme-2 hover:text-theme-2 dark:text-white dark:hover:text-white">
            {isFeaturedBadgeName(lowerCaseName) ? (
              <FeaturedBadge
                name={lowerCaseName}
                isHoverable
                className="lg:basis-1/3 max-w-xs md:justify-self-end"
              />
            ) : (
              <ProjectBadge
                color={
                  DEFAULT_BADGE_COLOR_OPTIONS[Math.floor(Math.random() * 5) + 1]
                }
                isHoverable
                abbreviation={name.charAt(0).toUpperCase() + name.slice(1, 2)}
                description={name}
                className="lg:basis-1/3 max-w-xs md:justify-self-end"
              />
            )}
            <span className="flex flex-col lg:basis-2/3 text-center md:text-left">
              <span className="text-xl font-semibold capitalize">
                {title || name}
              </span>
              <span className="text-sm max-w-md">{description}</span>
            </span>
          </a>
        );
      })}
    </div>

    <div className="my-8 pt-8 align-center">
      <NFLinkButton
        link="https://commerce.nearform.com/open-source"
        text="View All Projects"
      />
    </div>
  </div>
);
