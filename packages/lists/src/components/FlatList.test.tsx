import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { AccessibilityInfo } from 'react-native';
import { FlatList } from './FlatList';

beforeEach(() => {
  jest.clearAllMocks();

  AccessibilityInfo.announceForAccessibility = jest.fn();
});

describe('FlatList', () => {
  describe('listType "dynamic"', () => {
    it('does not announce the number of items on first render', async () => {
      render(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={'%count% item found'}
          pluralMessage={'%count% items found'}
          renderItem={() => null}
        />,
      );

      await waitFor(() => {
        expect(
          AccessibilityInfo.announceForAccessibility,
        ).not.toHaveBeenCalled();
      });
    });

    it.each`
      sliceStart | sliceEnd | count | type
      ${0}       | ${2}     | ${2}  | ${'plural'}
      ${1}       | ${2}     | ${1}  | ${'singular'}
    `(
      'announce the number of items displayed when the data changes',
      ({ sliceStart, sliceEnd, count, type }) => {
        const messages: Record<string, string> = {
          singular: '%count% item found',
          plural: '%count% items found',
        };

        const renderAPI = render(
          <FlatList
            data={DATA}
            listType="dynamic"
            singularMessage={messages.singular}
            pluralMessage={messages.plural}
            renderItem={() => null}
          />,
        );

        renderAPI.update(
          <FlatList
            data={DATA.slice(sliceStart, sliceEnd)}
            listType="dynamic"
            singularMessage={messages.singular}
            pluralMessage={messages.plural}
            renderItem={() => null}
          />,
        );

        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          messages[type].replace('%count%', count),
        );
      },
    );

    it.each`
      sliceStart | sliceEnd
      ${0}       | ${2}
      ${1}       | ${2}
    `('resets the count of announced items', ({ sliceStart, sliceEnd }) => {
      const messages: Record<string, string> = {
        singular: '%count% item found',
        plural: '%count% items found',
      };

      const renderAPI = render(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={messages.singular}
          pluralMessage={messages.plural}
          renderItem={() => null}
        />,
      );

      renderAPI.update(
        <FlatList
          data={DATA.slice(sliceStart, sliceEnd)}
          listType="dynamic"
          singularMessage={messages.singular}
          pluralMessage={messages.plural}
          renderItem={() => null}
        />,
      );

      renderAPI.update(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={messages.singular}
          pluralMessage={messages.plural}
          renderItem={() => null}
        />,
      );

      renderAPI.update(
        <FlatList
          data={DATA.slice(sliceStart, sliceEnd)}
          listType="dynamic"
          singularMessage={messages.singular}
          pluralMessage={messages.plural}
          renderItem={() => null}
        />,
      );

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(
        2,
      );
    });

    it('does not announce if the list shows again all the items', () => {
      const { update } = render(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={'%count% item found'}
          pluralMessage={'%count% items found'}
          renderItem={() => null}
        />,
      );

      update(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={'%count% item found'}
          pluralMessage={'%count% items found'}
          renderItem={() => null}
        />,
      );

      expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
    });

    it('allows using a custom function to detect if the number of items displayed is plural', () => {
      const isPlural = jest.fn().mockReturnValue(false);

      const { update } = render(
        <FlatList
          data={DATA}
          listType="dynamic"
          singularMessage={'%count% item found'}
          pluralMessage={'%count% items found'}
          isPlural={isPlural}
          renderItem={() => null}
        />,
      );

      update(
        <FlatList
          data={DATA.slice(1)}
          listType="dynamic"
          singularMessage={'%count% item found'}
          pluralMessage={'%count% items found'}
          isPlural={isPlural}
          renderItem={() => null}
        />,
      );

      expect(isPlural).toHaveBeenCalledWith(2);
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        '2 item found',
      );
    });
  });

  describe('listType="static"', () => {
    it.each`
      sliceStart | sliceEnd
      ${0}       | ${2}
      ${1}       | ${2}
    `(
      'does not announce the number of items displayed when the data changes',
      ({ sliceStart, sliceEnd }) => {
        const renderAPI = render(
          <FlatList data={DATA} listType="static" renderItem={() => null} />,
        );

        renderAPI.update(
          <FlatList
            data={DATA.slice(sliceStart, sliceEnd)}
            listType="static"
            renderItem={() => null}
          />,
        );

        expect(
          AccessibilityInfo.announceForAccessibility,
        ).not.toHaveBeenCalled();
      },
    );

    it('renders without errors with rowsCount specified', () => {
      const { toJSON } = render(
        <FlatList
          data={[]}
          listType="static"
          rowsCount={42}
          renderItem={() => null}
        />,
      );

      expect(toJSON()).not.toBeNull();
    });

    it('renders without errors with numColumns specified', () => {
      const { toJSON } = render(
        <FlatList
          data={DATA}
          listType="static"
          numColumns={2}
          renderItem={() => null}
        />,
      );

      expect(toJSON()).not.toBeNull();
    });

    it('sets rowsCount to 0 if the data is undefined', () => {
      const { toJSON } = render(
        <FlatList
          data={undefined}
          listType="static"
          numColumns={2}
          renderItem={() => null}
        />,
      );

      expect(toJSON()).not.toBeNull();
    });
  });
});

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Formidable',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'React Native',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Typescript',
  },
];
