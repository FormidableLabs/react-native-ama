package com.amademo;

import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.amademo.Events.onPressEvent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewDefaults;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import java.util.Map;



public class AMASpanManager extends SimpleViewManager<AMASpanView> {
    public final int COMMAND_CREATE = 1;
    public static final String REACT_CLASS = "AMASpan";
    protected AMATextShadowNode mAmaTextShadowNode;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public AMASpanView createViewInstance(ThemedReactContext reactContext) {
        return new AMASpanView(reactContext, mAmaTextShadowNode);
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(onPressEvent.EVENT_NAME, MapBuilder.of("registrationName", onPressEvent.EVENT_NAME));
    }

    @Override
    public void setPadding(AMASpanView view, int left, int top, int right, int bottom) {
        view.setPadding(left, top, right, bottom);
    }

    @NonNull
    @Override
    public LayoutShadowNode createShadowNodeInstance(@NonNull ReactApplicationContext context) {
        mAmaTextShadowNode = new AMATextShadowNode();

        return mAmaTextShadowNode;
    }

    @ReactProp(name = "content")
    public void setContent(AMASpanView component, @NonNull ReadableArray spans) {
        component.setContent(spans);
    }

    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = ViewDefaults.FONT_SIZE_SP)
    public void setFontSize(AMASpanView view, float fontSize) {
        view.setFontSize(fontSize);
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

    @ReactProp(name = "linkColor")
    public void setLinkColor(AMASpanView view, String color) {
        view.setLinkTextColor(Color.parseColor(color));
    }

    @ReactProp(name = "linkBackgroundColor")
    public void setLinkBackgroundColor(AMASpanView view, String color) {
        view.setLinkBackgroundColor(Color.parseColor(color));
    }
}

class AMATextShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private int mHeight = 0;

    public AMATextShadowNode() {
        setMeasureFunction(this);
    }

    @Override
    public long measure(
            YogaNode node,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode) {
        return YogaMeasureOutput.make(0, mHeight);
    }

    public void update(int measuredHeight) {
        mHeight = measuredHeight;

        dirty();
    }
}
