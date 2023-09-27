import { useDoc } from '@docusaurus/theme-common/internal';
import React from 'react';

import { Severity } from '../../../../components';

const AMA_WHAT = {
  ama_severity: 'Severity',
  ama_category: 'Accessibility Principle',
  ama_affected_users: 'Affected users',
  ama_success_criterion: 'Success criterion',
};

const PRINCIPLES = {
  Perceivable: '../guidelines/pour#perceivable',
  Operable: '../guidelines/pour#operable',
  Understandable: '../guidelines/pour#understandable',
  Robust: '../guidelines/pour#robust',
};

const AFFECTED_USERS = {
  Motor: '../guidelines/type-of-accessibility-issues#motormobility',
  Mobility: '../guidelines/type-of-accessibility-issues#motormobility',
};

export const AMASidebar = () => {
  const { frontMatter } = useDoc();

  return (
    <>
      <table className="ama-sidebar">
        <tbody>
          {Object.entries(AMA_WHAT).map(([key, label]) => {
            let value = frontMatter[key];

            if (key === 'ama_severity') {
              value = <Severity level={value || ''} />;
            } else if (key === 'ama_success_criterion' && value) {
              const [sc, link] = value.split('@');

              value = (
                <a href={link} title={`Success criterion ${sc}`}>
                  {sc}
                </a>
              );
            } else if (key === 'ama_category') {
              const link = PRINCIPLES[value];

              value = link ? <a href={link}>{value}</a> : null;
            } else if (key === 'ama_affected_users') {
              value = <AffectedUsers users={value.split(',')} />;
            }

            return value ? (
              <tr style={{ padding: 0 }} key={key}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
      <div className="ama-separator" />
    </>
  );
};

const AffectedUsers = ({ users }) => {
  const total = users.length - 1;

  return (
    <>
      {users.map((user, index) => {
        const link =
          AFFECTED_USERS[user.trim()] ||
          `../guidelines/type-of-accessibility-issues#${user.toLowerCase()}`;

        return link ? (
          <>
            <a href={link} key={user}>
              {user}
            </a>
            {index < total ? ', ' : null}
          </>
        ) : (
          user
        );
      })}
    </>
  );
};
