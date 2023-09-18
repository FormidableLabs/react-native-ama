import { useDoc } from '@docusaurus/theme-common/internal';
import React from 'react';

import { Critical, Severity } from '../../../../components';

const AMA_WHAT = {
  ama_severity: 'Severity',
  ama_category: 'Category',
  ama_affected_users: 'Affected users',
  ama_success_criterion: 'Success criterion',
};

const SEVERITY_VALUES = ['critical', 'critical', 'serious', 'warning'];

const PRINCIPLES = {
  P: ['Perceivable', '../guidelines/pour#perceivable'],
  O: ['Operable', '../guidelines/pour#operable'],
  U: ['Understandable', '../guidelines/pour#understandable'],
  R: ['Robust', '../guidelines/pour#robust'],
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
              value = <Severity level={SEVERITY_VALUES[value] || ''} />;
            } else if (key === 'ama_success_criterion') {
              const [sc, link] = value.split('@');

              value = (
                <a href={link} title={`Success criterion ${sc}`}>
                  {sc}
                </a>
              );
            } else if (key === 'ama_category') {
              const [label, link] = PRINCIPLES[value] || [];

              value = <a href={link}>{label}</a>;
            }

            return (
              <tr style={{ padding: 0 }} key={key}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="ama-separator" />
    </>
  );
};
