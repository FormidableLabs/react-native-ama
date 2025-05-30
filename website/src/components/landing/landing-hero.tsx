import { AMABadge } from 'formidable-oss-badges';
import React, { useState } from 'react';

export const LandingHero = ({
  body,
  copyText,
  heading,
  navItems,
}: {
  body: string;
  copyText: string;
  heading: string;
  navItems: { link: string; title: string }[];
}) => {
  const [buttonText, setButtonText] = useState('Copy');

  const changeText = text => {
    setButtonText(text);
  };

  return (
    <div className="hero-pattern w-fill bg-cover bg-no-repeat">
      <div className="py-12 lg:py-24 mx-16 lg:mx-32 xl:mx-64 relative">
        <div className="flex-col md:flex-row flex justify-between gap-16 lg:gap-24 mx-auto">
          <div className="self-center md:self-left">
            <AMABadge name={'ama'} className="h-[320px] w-[320px]" />
          </div>
          <div className="text-left lg:w-6/12 text-black">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-lg leading-8">{body}</p>
            <div className="mt-10 flex flex-wrap flex-col xl:flex-row xl:items-center justify-start gap-6">
              <button
                className="overflow-hidden grid-rows-2 md:grid-rows-1 lg:max-w-fit grid lg:grid-cols-6 align-center rounded-md shadow-sm border-none bg-white my-0 py-0 px-0 text-sm font-semibold text-theme-2 hover:text-theme-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-1"
                onClick={() => {
                  changeText('Copied!');
                  navigator.clipboard.writeText(copyText);
                }}>
                <code className="max-w-fit py-2.5 pl-3.5 content-center grid-span-12 lg:col-span-4 border-0 bg-white">
                  {copyText}
                </code>
                <span className="w-full lg:min-w-fit col-span-2 capitalize rounded-b-md lg:rounded-l-none lg:!rounded-r-md text-theme-2 bg-theme-1 lg:ml-2 pr-3.5 lg:pl-2.5 py-2.5 h-full">
                  {buttonText}
                </span>
              </button>
            </div>
            <nav className="mt-6">
              <ul className="list-none flex justify-items-start content-start items-start align-left pl-0 gap-6 lg:gap-12 font-bold">
                {navItems.map(({ link, title }) => (
                  <li key={link}>
                    <a href={link} className="text-black hover:text-white">
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
