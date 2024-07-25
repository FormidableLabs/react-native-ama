# Components

React Native components have the accessibility prop as optional, leaving the developer to know when and how to use them. Instead, the AMA components, built on top of the React Native ones, are designed to enforce minimum accessibility requirements, helping the developer know what, where and how to use the various accessibility properties.


The components also perform some [rule check](../guidelines/guidelines.md) at run time<sup>[^1]</sup> and, in case of failure, provide a link to a help page with an extended explanation. This also means that TypeScript is not a requirement to use this library.

[^1]: The checks are **only** made on the dev build
