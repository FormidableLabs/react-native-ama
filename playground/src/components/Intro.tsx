import React from 'react';
import { Text } from './Text';

type IntroProps = {
  element: string;
};

export const Intro: React.FC<IntroProps> = ({ element }) => {
  return (
    <>
      <Text mt={8} mb={8}>
        This screen displays the accessibility checks AMA can perform on
        {element} elements.
      </Text>
      <Text>
        Tap the error or warning icon in AMA’s bottom bar to learn why an issue
        is failing.
      </Text>
      <Text>
        You can also try fixing it by updating the code to see the checker
        respond in real time.
      </Text>
    </>
  );
};
