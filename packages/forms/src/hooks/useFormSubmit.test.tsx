import { renderHook } from '@testing-library/react-native';
import * as Form from '../components/Form';
import { useFormSubmit } from './useFormSubmit';

describe('useFormSubmit', () => {
  it('returns a submitForm callback from form context', async () => {
    const submitForm = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(Form, 'useForm').mockImplementation(
      () => ({ submitForm }) as any,
    );

    const { result } = renderHook(() => useFormSubmit());

    await result.current.submitForm();

    expect(submitForm).toHaveBeenCalledTimes(1);
  });
});
