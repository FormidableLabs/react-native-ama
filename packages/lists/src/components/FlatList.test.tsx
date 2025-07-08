import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { FlatList } from './FlatList';

beforeEach(() => {
  jest.clearAllMocks();

  AccessibilityInfo.announceForAccessibility = jest.fn();
});

Platform.OS = 'android';

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
      sliceStart | sliceEnd | count | type
      ${0}       | ${2}     | ${2}  | ${'plural'}
      ${1}       | ${2}     | ${1}  | ${'singular'}
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

    it('uses the given rowCount when specified', () => {
      const { toJSON } = render(
        <FlatList
          data={[]}
          listType="static"
          rowsCount={42}
          renderItem={() => null}
        />,
      );

      expect(toJSON()).toMatchInlineSnapshot(`
        <View
          columnsCount={1}
          rowsCount={42}
        >
          <RCTScrollView
            data={Array []}
            getItem={[Function]}
            getItemCount={[Function]}
            keyExtractor={[Function]}
            onContentSizeChange={[Function]}
            onLayout={[Function]}
            onMomentumScrollBegin={[Function]}
            onMomentumScrollEnd={[Function]}
            onScroll={[Function]}
            onScrollBeginDrag={[Function]}
            onScrollEndDrag={[Function]}
            removeClippedSubviews={true}
            renderItem={[Function]}
            scrollEventThrottle={50}
            stickyHeaderIndices={Array []}
            viewabilityConfigCallbackPairs={Array []}
          >
            <View />
          </RCTScrollView>
        </View>
      `);
    });

    it('divides the number of items by the number of columns', () => {
      const { toJSON } = render(
        <FlatList
          data={DATA}
          listType="static"
          numColumns={2}
          renderItem={() => null}
        />,
      );

      expect(toJSON()).toMatchInlineSnapshot(`
        <View
          columnsCount={2}
          rowsCount={2}
        >
          <RCTScrollView
            data={
              Array [
                Object {
                  "id": "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
                  "title": "Formidable",
                },
                Object {
                  "id": "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
                  "title": "React Native",
                },
                Object {
                  "id": "58694a0f-3da1-471f-bd96-145571e29d72",
                  "title": "Typescript",
                },
              ]
            }
            getItem={[Function]}
            getItemCount={[Function]}
            keyExtractor={[Function]}
            onContentSizeChange={[Function]}
            onLayout={[Function]}
            onMomentumScrollBegin={[Function]}
            onMomentumScrollEnd={[Function]}
            onScroll={[Function]}
            onScrollBeginDrag={[Function]}
            onScrollEndDrag={[Function]}
            removeClippedSubviews={true}
            renderItem={[Function]}
            scrollEventThrottle={50}
            stickyHeaderIndices={Array []}
            viewabilityConfigCallbackPairs={Array []}
          >
            <View>
              <View
                onLayout={[Function]}
                style={null}
              />
              <View
                onLayout={[Function]}
                style={null}
              />
              <View
                onLayout={[Function]}
                style={null}
              />
            </View>
          </RCTScrollView>
        </View>
      `);
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

      expect(toJSON()).toMatchInlineSnapshot(`
        <View
          columnsCount={2}
          rowsCount={0}
        >
          <RCTScrollView
            getItem={[Function]}
            getItemCount={[Function]}
            keyExtractor={[Function]}
            onContentSizeChange={[Function]}
            onLayout={[Function]}
            onMomentumScrollBegin={[Function]}
            onMomentumScrollEnd={[Function]}
            onScroll={[Function]}
            onScrollBeginDrag={[Function]}
            onScrollEndDrag={[Function]}
            removeClippedSubviews={true}
            renderItem={[Function]}
            scrollEventThrottle={50}
            stickyHeaderIndices={Array []}
            viewabilityConfigCallbackPairs={Array []}
          >
            <View />
          </RCTScrollView>
        </View>
      `);
    });
  });
});

jest.mock('./ListWrapper', () => {
  const { View } = jest.requireActual('react-native');

  return {
    // @ts-ignore
    ListWrapper: props => <View {...props} />,
  };
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
