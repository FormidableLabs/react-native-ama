import React from 'react';

import { Divider } from './divider';
import { Section } from './section';

export const LandingFeatures = ({
  heading,
  list,
  showDivider,
}: {
  heading: string;
  list: {
    imgSrc: string;
    alt: string;
    title: string;
    body?: string;
    html?: { __html: string };
  }[];
  showDivider?: boolean;
}) => (
  <Section className="flex flex-col">
    {showDivider && <Divider />}
    <h2 className="my-8 text-4xl font-semibold">{heading}</h2>
    <ul className="grid grid-cols-3 items-start content-start justify-items-center md:justify-items-start justify-between gap-12 list-none pl-0">
      {list.map(({ alt, body, imgSrc, title, html }, i) => (
        <li
          key={i}
          className="col-span-3 md:col-span-1 flex flex-col items-center text-center">
          <img src={imgSrc} alt={alt} className="max-h-72" />
          <span className="mt-8 text-2xl font-semibold">{title}</span>
          <span
            dangerouslySetInnerHTML={html}
            className="mt-2 text-lg leading-8 mx-3">
            {body}
          </span>
        </li>
      ))}
    </ul>
  </Section>
);
