package com.amademo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewDefaults;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTextShadowNode;
import com.facebook.react.views.text.ReactTextViewManagerCallback;


public class AMASpanManager extends SimpleViewManager<AMASpanView> {
    public static final String REACT_CLASS = "AMASpan";
    protected @Nullable
    ReactTextViewManagerCallback mAMASpanViewManagerCallback;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public AMASpanView createViewInstance(ThemedReactContext reactContext) {
        return new AMASpanView(reactContext);
    }

    @Override
    public void setPadding(AMASpanView view, int left, int top, int right, int bottom) {
        view.setPadding(left, top, right, bottom);
    }

    @NonNull
    @Override
    public LayoutShadowNode createShadowNodeInstance(@NonNull ReactApplicationContext context) {
        return new ReactTextShadowNode(mAMASpanViewManagerCallback);
    }

    @ReactProp(name = "content")
    public void setContent(AMASpanView component, @NonNull ReadableArray spans) {
        component.setContent(spans);
    }

    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = ViewDefaults.FONT_SIZE_SP)
    public void setFontSize(AMASpanView view, float fontSize) {
        view.setTextSize(fontSize);
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    public void setFontFamily(AMASpanView view, String fontFamily) {
        view.setFontFamily(fontFamily);
    }

    @ReactProp(name = ViewProps.FONT_WEIGHT)
    public void setFontWeight(AMASpanView view, @Nullable String fontWeight) {
        view.setFontWeight(fontWeight);
    }

    @ReactProp(name = ViewProps.FONT_STYLE)
    public void setFontStyle(AMASpanView view, @Nullable String fontStyle) {
        view.setFontStyle(fontStyle);
    }

    @ReactProp(name = ViewProps.INCLUDE_FONT_PADDING, defaultBoolean = true)
    public void setIncludeFontPadding(AMASpanView view, boolean includepad) {
        view.setIncludeFontPadding(includepad);
    }
}
