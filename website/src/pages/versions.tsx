import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useLatestVersion,
  useVersions,
} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

const docsPluginId = undefined; // Default docs plugin instance

function DocumentationLabel() {
  return (
    <Translate id="versionsPage.versionEntry.link">Documentation</Translate>
  );
}

function ReleaseNotesLabel() {
  return (
    <Translate id="versionsPage.versionEntry.releaseNotes">
      Release Notes
    </Translate>
  );
}

export default function Version(): JSX.Element {
  const {
    siteConfig: { projectName, customFields },
  } = useDocusaurusContext();
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);
  const currentVersion = versions.find(version => version.name === 'current')!;
  const pastVersions = versions.filter(
    version => version !== latestVersion && version.name !== 'current',
  );

  function matchPastVersion(wildCardVersion: string) {
    const regex = new RegExp('^' + wildCardVersion.replace('.x', '\\.'));

    return (customFields?.latestMinorVersions as string[]).filter(version =>
      regex.test(version),
    );
  }
  function matchCurrentVersion(wildCardVersion: string) {
    const regex = new RegExp('^' + wildCardVersion.replace('.x', '\\.'));

    const foundVersion = (customFields?.latestMinorVersions as string[]).find(
      version => regex.test(version),
    );
    return foundVersion ? `?q="%40${foundVersion}"` : '';
  }

  const repoUrl = `https://github.com/${customFields?.pastOrganizationName}/${projectName}`;

  return (
    <Layout
      title="Versions"
      description="React Native AMA versions page listing all documented versions">
      <main className="container margin-vert--lg">
        <Heading as="h1">
          <Translate id="versionsPage.title">
            React Native AMA documentation versions
          </Translate>
        </Heading>

        <div className="margin-bottom--lg">
          <Heading as="h3" id="next">
            <Translate id="versionsPage.current.title">
              Current version (Stable)
            </Translate>
          </Heading>
          <p>
            <Translate id="versionsPage.current.description">
              Here you can find the documentation for the current released
              version.
            </Translate>
          </p>
          <table>
            <tbody>
              <tr>
                <th>{latestVersion.label}</th>
                <td>
                  <Link to={latestVersion.path}>
                    <DocumentationLabel />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${repoUrl}/releases${matchCurrentVersion(latestVersion.label)}`}>
                    <ReleaseNotesLabel />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {currentVersion !== latestVersion && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="latest">
              <Translate id="versionsPage.next.title">
                Next version (Unreleased)
              </Translate>
            </Heading>
            <p>
              <Translate id="versionsPage.next.description">
                Here you can find the documentation for work-in-process
                unreleased version (Next).
              </Translate>
            </p>
            <table>
              <tbody>
                <tr>
                  <th>{currentVersion.label}</th>
                  <td>
                    <Link to={currentVersion.path}>
                      <DocumentationLabel />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {pastVersions.length > 0 && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="archive">
              <Translate id="versionsPage.archived.title">
                Past versions (Not maintained anymore)
              </Translate>
            </Heading>
            <p>
              <Translate id="versionsPage.archived.description">
                Here you can find documentation for previous versions of React
                Native AMA.
              </Translate>
            </p>
            <table>
              <tbody>
                {pastVersions.map(version => (
                  <tr key={version.name}>
                    <th>{version.label}</th>
                    <td>
                      <Link to={version.path}>
                        <DocumentationLabel />
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`${repoUrl}/releases${matchPastVersion(
                          version.label,
                        )}`}>
                        <ReleaseNotesLabel />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}
