import * as React from 'react';

const Highlight = ({ children, rule, small }) => {
  const color = rule === 'MUST_NOT' ? '#b60000' : '#807700';

  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: '#fff',
        padding: '0.4rem 0.6rem',
        fontSize: 16,
        display: 'inline-block',
        verticalAlign: 'middle'
      }}>
      {children}
    </span>
  );
};

export const MustNot = () => <Highlight rule="MUST_NOT">MUST_NOT</Highlight>;
export const ShouldNot = () => (
  <Highlight rule="SHOULD_NOT">SHOULD_NOT</Highlight>
);

