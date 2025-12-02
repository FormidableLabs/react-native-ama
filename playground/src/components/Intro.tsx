import React from "react";
import { Text } from "./Text";

type IntroProps = {
  element: string;
};

export const Intro: React.FC<IntroProps> = ({ element }) => {
  return (
    <Text mt={8} mb={8}>
      Explore how AMA detects accessibility violations on{" "}
      <Text style={{ backgroundColor: "#333", color: "#fff" }}>{element}</Text>{" "}
      elements. Tap <Text bold>Inspect</Text> below to diagnose the issues, then
      update the code to see the checker respond in real-time.
    </Text>
  );
};
