import * as React from 'react';

const Highlight = ({ children, rule }) => {
  const color = rule === 'MUST_NOT' ? '#b60000' : '#807700';

  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: '#fff',
        padding: '0.4rem 0.6rem',
      }}>
      {children}
    </span>
  );
};

export const MustNot = () => <Highlight rule="MUST_NOT">MUST_NOT</Highlight>;
export const ShouldNot = () => (
  <Highlight rule="SHOULD_NOT">SHOULD_NOT</Highlight>
);
