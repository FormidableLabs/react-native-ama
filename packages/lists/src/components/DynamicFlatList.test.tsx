import { render } from '@testing-library/react-native';
import * as React from 'react';
import * as UseDynamicList from '../hooks/useDynamicList';
import { DynamicFlatList } from './DynamicFlatList';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DynamicFlatList', () => {
  it('uses the style provided by useDynamicFlatList when __DEV__ is true', () => {
    jest.spyOn(UseDynamicList, 'useDynamicList').mockReturnValue({
      style: { backgroundColor: 'formidable' },
    } as any);

    const { getByTestId } = render(
      <DynamicFlatList
        data={[]}
        singularMessage="%count% singular"
        pluralMessage="%count% plurarl"
        renderItem={() => null}
        testID={'test-id'}
      />,
    );

    expect(getByTestId('test-id').props.style).toEqual({
      backgroundColor: 'formidable',
    });
  });

  it('does not uses the style provided by useDynamicFlatList when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;

    jest.spyOn(UseDynamicList, 'useDynamicList').mockReturnValue({
      style: { backgroundColor: 'formidable' },
    } as any);

    const {
      DynamicFlatList: OriginalDynamicFlatList,
    } = require('./DynamicFlatList');

    const { getByTestId } = render(
      <OriginalDynamicFlatList
        data={[]}
        singularMessage="%count% singular"
        pluralMessage="%count% plurarl"
        renderItem={() => null}
        testID={'test-id'}
      />,
    );

    expect(getByTestId('test-id').props.style).toEqual(undefined);
  });
});

jest.mock('../hooks/useDynamicList');
