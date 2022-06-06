import { render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { FormField } from '../components/FormField';
import { Form, useForm } from './Form';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Form', () => {
  it('stores the useFormField refs', () => {
    const { getByTestId } = render(
      <Form onSubmit={() => {}}>
        <FormField>
          <DummyComponent />
        </FormField>
      </Form>,
    );

    waitFor(() => expect(getByTestId('dummy')).toContain(1));
  });
});

const DummyComponent = () => {
  const { refs } = useForm();

  return <Text testID="dummy">{refs?.length}</Text>;
};
