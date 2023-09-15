import { useDoc } from '@docusaurus/theme-common/internal';
import React from 'react';

import { Critical, Severity } from '../../../../components';

const AMA_WHAT = {
  ama_severity: 'Severity',
  ama_category: 'Category',
  ama_affected_users: 'Affected users',
  ama_success_criterion: 'Success criterion',
};

const SEVERITY_VALUES = ['', 'critical', 'serious', 'warning'];
export const AMASidebar = () => {
  const { frontMatter } = useDoc();

  return (
    <>
      <table className="ama-sidebar">
        {Object.entries(AMA_WHAT).map(([key, label]) => {
          let value = frontMatter[key];

          if (key === 'ama_severity') {
            value = <Severity level={SEVERITY_VALUES[value] || ''} />;
          } else if (key === 'ama_success_criterion') {
            const [sc, link] = value.split('@');

            value = (
              <a href={link} title={`Success criterion ${sc}`}>
                {sc}
              </a>
            );
          }

          return (
            <tr style={{ padding: 0 }}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          );
        })}
      </table>
      <div className="ama-separator" />
    </>
  );
};
