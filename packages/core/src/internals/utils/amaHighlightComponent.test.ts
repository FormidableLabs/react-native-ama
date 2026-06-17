beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('amaHighlightComponent', () => {
  const setupMocks = (highlightMock = jest.fn().mockResolvedValue({ x: 0 })) => {
    jest.doMock('../../ReactNativeAmaModule', () => ({
      __esModule: true,
      default: { highlight: highlightMock },
    }));
    jest.doMock('../config', () => ({
      __esModule: true,
      default: { highlight: { mode: 'border' }, rules: {} },
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_ACCESSIBILITY_LABEL: { severity: 'Critical' },
        CONTRAST_FAILED: { severity: 'Serious' },
        CONTRAST_FAILED_AAA: { severity: 'Warning' },
      },
      AMA_COLORS: { Critical: '#f00', Serious: '#2563EB', Warning: '#2563EB' },
    }));
    return highlightMock;
  };

  it('returns null for an empty issues array', async () => {
    setupMocks();
    const { amaHighlightComponent } = require('./amaHighlightComponent');
    const result = await amaHighlightComponent([]);
    expect(result).toBeNull();
  });

  it('calls highlight with the first issue viewId and highest severity color', async () => {
    const highlightMock = setupMocks();
    const { amaHighlightComponent } = require('./amaHighlightComponent');

    await amaHighlightComponent([
      { rule: 'NO_ACCESSIBILITY_LABEL', viewId: 10 },
      { rule: 'CONTRAST_FAILED', viewId: 10 },
    ]);

    expect(highlightMock).toHaveBeenCalledWith(10, 'border', '#f00', 2);
  });

  it('uses Warning color when only warning-severity issues are present', async () => {
    const highlightMock = setupMocks();
    const { amaHighlightComponent } = require('./amaHighlightComponent');

    await amaHighlightComponent([{ rule: 'CONTRAST_FAILED_AAA', viewId: 5 }]);

    expect(highlightMock).toHaveBeenCalledWith(5, 'border', '#2563EB', 1);
  });

  it('accepts a single issue object (non-array)', async () => {
    const highlightMock = setupMocks();
    const { amaHighlightComponent } = require('./amaHighlightComponent');

    await amaHighlightComponent({ rule: 'CONTRAST_FAILED', viewId: 7 });

    expect(highlightMock).toHaveBeenCalledWith(7, 'border', '#2563EB', 1);
  });

  it('uses the mode argument over the config default', async () => {
    const highlightMock = setupMocks();
    const { amaHighlightComponent } = require('./amaHighlightComponent');

    await amaHighlightComponent([{ rule: 'CONTRAST_FAILED', viewId: 3 }], 'background');

    expect(highlightMock).toHaveBeenCalledWith(3, 'background', '#2563EB', 1);
  });
});
