import { IS_IOS, IS_ANDROID } from './platformHelpers';

describe('platformHelpers', () => {
  it('IS_IOS is true when Platform.OS is ios (default mock)', () => {
    expect(IS_IOS).toBe(true);
  });

  it('IS_ANDROID is false when Platform.OS is ios (default mock)', () => {
    expect(IS_ANDROID).toBe(false);
  });
});
