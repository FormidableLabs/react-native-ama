import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Divider } from '../components/landing/divider';
import { LandingBanner } from '../components/landing/landing-banner';
import { LandingFeaturedProjects } from '../components/landing/landing-featured-projects';
import { LandingFeatures } from '../components/landing/landing-features';
import { LandingHero } from '../components/landing/landing-hero';
import {
  feature1,
  feature2,
  feature3,
} from '../components/landing/landing-images';
import { Section } from '../components/landing/section';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className="dark:bg-gray-500 bg-gray-200 dark:text-white text-theme-2">
        <LandingHero
          heading={siteConfig.title}
          body={siteConfig.tagline}
          copyText="yarn add @react-native-ama/core"
          navItems={[
            {
              link: '/open-source/react-native-ama/docs/',
              title: 'Documentation',
            },
            {
              link: 'https://github.com/FormidableLabs/react-native-ama',
              title: 'Github',
            },
          ]}
        />
      </div>
      <LandingFeatures
        heading="Features"
        list={[
          {
            imgSrc: feature1,
            alt: 'Real-time Accessibility checks',
            title: 'Real-time Accessibility checks',
            html: {
              __html:
                'AMA provides a comprehensive suite of pre-built components and functions designed to handle accessibility concerns out of the box. This allows developers to quickly and easily integrate accessible features into mobile apps without the need to implement complex accessibility logic.',
            },
          },
          {
            imgSrc: feature2,
            alt: 'Compositional Architecture',
            title: 'Compositional Architecture',
            html: {
              __html:
                'AMA features a compositional architecture with well-defined sub-packages, enabling developers to include only the accessibility features they need. This approach keeps apps lightweight and efficient while ensuring all necessary accessibility concerns are addressed.',
            },
          },
          {
            imgSrc: feature3,
            alt: 'WCAG Compliant',
            title: 'WCAG Compliant',
            body: 'AMA aims to meet the Web Content Accessibility Guidelines (WCAG), providing a solid foundation for creating mobile apps that are accessible to all users. This commitment to compliance helps ensure your app meets industry standards for accessibility.',
          },
        ]}
      />
      <Divider />
      <Section className="flex justify-center flex-col md:flex-row">
        <LandingBanner
          heading="Get Started"
          body="Integrating AMA's accessible features effortlessly into your mobile apps today!"
          cta={{
            link: '/open-source/react-native-ama/docs',
            text: 'Documentation',
          }}
        />
      </Section>
      <Divider />
      <LandingFeaturedProjects
        heading="Other Open Source"
        projects={[
          {
            title: 'Victory Native',
            name: 'Victory',
            link: 'https://commerce.nearform.com/open-source/victory-native/',
            description:
              'A charting library for React Native with a focus on performance and customization.',
          },
          {
            title: 'React Native App Auth',
            name: 'React Native App Auth',
            color: '#5ABDEE',
            link: 'https://commerce.nearform.com/open-source/react-native-app-auth',
            description:
              'React native bridge for AppAuth - an SDK for communicating with OAuth2 providers',
          },
          {
            name: 'urql',
            link: 'https://commerce.nearform.com/open-source/urql/',
            description:
              'The highly customizable and versatile GraphQL client for React, Svelte, Vue, or plain JavaScript, with which you add on features like normalized caching as you grow.',
          },
          {
            name: 'groqd',
            link: 'https://commerce.nearform.com/open-source/groqd/',
            description:
              'A schema-unaware, runtime and type-safe query builder for GROQ.',
          },
        ]}
      />
    </Layout>
  );
}
