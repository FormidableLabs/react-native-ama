import React from 'react';

import { Divider } from './divider';
import { NFLinkButton } from './nf-link-button';

export const LandingBanner = ({
  body,
  cta,
  heading,
  showDivider,
}: {
  body: string;
  cta: { link: string; text: string };
  heading: string;
  showDivider?: boolean;
}) => (
  <div className="flex flex-col justify-center items-center text-center">
    {showDivider && <Divider />}
    <h2 className="text-4xl font-semibold">{heading}</h2>
    <p className="text-lg">{body}</p>
    <NFLinkButton link={cta.link} text={cta.text} />
  </div>
);
