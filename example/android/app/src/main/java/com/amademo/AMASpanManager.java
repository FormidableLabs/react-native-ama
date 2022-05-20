package com.amademo;

import android.content.Context;
import android.graphics.Color;
import android.text.Spannable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.amademo.Events.onPressEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.common.mapbuffer.ReadableMapBuffer;
import com.facebook.react.uimanager.IViewManagerWithChildren;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.StateWrapper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewDefaults;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTextAnchorViewManager;
import com.facebook.react.views.text.ReactTextUpdate;
import com.facebook.react.views.text.ReactTextViewManagerCallback;
import com.facebook.react.views.text.TextAttributeProps;
import com.facebook.react.views.text.TextLayoutManager;
import com.facebook.react.views.text.TextLayoutManagerMapBuffer;
import com.facebook.yoga.YogaMeasureMode;

import java.util.HashMap;
import java.util.Map;

public class AMASpanManager extends ReactTextAnchorViewManager<AMASpanView, AMATextShadowNode>
        implements IViewManagerWithChildren {
    public static final String REACT_CLASS = "AMASpan";
    AMATextShadowNode mAMATextShadowNode;

    private static final short TX_STATE_KEY_ATTRIBUTED_STRING = 0;
    private static final short TX_STATE_KEY_PARAGRAPH_ATTRIBUTES = 1;
    static final int UNSET = -1;

    protected @Nullable
    ReactTextViewManagerCallback mReactTextViewManagerCallback;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public AMASpanView createViewInstance(ThemedReactContext context) {
        return new AMASpanView(context);
    }

    @ReactProp(name = "text")
    public void setText(AMASpanView component, @NonNull ReadableArray content) {
        component.setText(content);
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

    /**
     * TODO: Fix wrong lineHeight.
     * At the moment when the property is removed from the style the text is not rendered
     * correctly, unless a refresh of the app is made.
     */
    @ReactProp(name = ViewProps.LINE_HEIGHT)
    public void setLineHeight(AMASpanView view, @Nullable float lineHeight) {
        view.setLineHeight((int) PixelUtil.toPixelFromSP(lineHeight));
    }

    @ReactProp(name = ViewProps.COLOR)
    public void setColor(AMASpanView view, int color) {
        view.setTextColor(color);
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

    @ReactProp(name = "linkStyle")
    public void setLinkStyle(AMASpanView view, int linkStyle) {
        view.setLinkStyle(linkStyle);
    }

    @Override
    public void updateExtraData(@NonNull AMASpanView view, Object extraData) {
    }

    @Override
    public AMATextShadowNode createShadowNodeInstance() {
        mAMATextShadowNode = new AMATextShadowNode();
        return mAMATextShadowNode;
    }

    @Override
    public Class<AMATextShadowNode> getShadowNodeClass() {
        return AMATextShadowNode.class;
    }

    @Override
    protected void onAfterUpdateTransaction(AMASpanView view) {
        super.onAfterUpdateTransaction(view);
        view.updateView();
    }

    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public Object updateState(
            AMASpanView view, ReactStylesDiffMap props, @Nullable StateWrapper stateWrapper) {
        if (stateWrapper == null) {
            return null;
        }

        ReadableNativeMap state = stateWrapper.getStateData();
        if (state == null) {
            return null;
        }

        ReadableMap attributedString = state.getMap("attributedString");
        ReadableMap paragraphAttributes = state.getMap("paragraphAttributes");
        Spannable spanned =
                TextLayoutManager.getOrCreateSpannableForText(
                        view.getContext(), attributedString, mReactTextViewManagerCallback);
        view.setSpanned(spanned);

        int textBreakStrategy =
                TextAttributeProps.getTextBreakStrategy(paragraphAttributes.getString("textBreakStrategy"));

        return new ReactTextUpdate(
                spanned,
                state.hasKey("mostRecentEventCount") ? state.getInt("mostRecentEventCount") : -1,
                false, // TODO add this into local Data
                TextAttributeProps.getTextAlignment(props, TextLayoutManager.isRTL(attributedString)),
                textBreakStrategy,
                TextAttributeProps.getJustificationMode(props));
    }

    private Object getReactTextUpdate(
            AMASpanView view, ReactStylesDiffMap props, ReadableMapBuffer state) {

        ReadableMapBuffer attributedString = state.getMapBuffer(TX_STATE_KEY_ATTRIBUTED_STRING);
        ReadableMapBuffer paragraphAttributes = state.getMapBuffer(TX_STATE_KEY_PARAGRAPH_ATTRIBUTES);
        Spannable spanned =
                TextLayoutManagerMapBuffer.getOrCreateSpannableForText(
                        view.getContext(), attributedString, mReactTextViewManagerCallback);
        view.setSpanned(spanned);

        int textBreakStrategy =
                TextAttributeProps.getTextBreakStrategy(
                        paragraphAttributes.getString(TextLayoutManagerMapBuffer.PA_KEY_TEXT_BREAK_STRATEGY));

        return new ReactTextUpdate(
                spanned,
                -1, // UNUSED FOR TEXT
                false, // TODO add this into local Data
                TextAttributeProps.getTextAlignment(
                        props, TextLayoutManagerMapBuffer.isRTL(attributedString)),
                textBreakStrategy,
                TextAttributeProps.getJustificationMode(props));
    }

    @Override
    public @Nullable
    Map getExportedCustomDirectEventTypeConstants() {
        @Nullable
        Map<String, Object> baseEventTypeConstants = super.getExportedCustomDirectEventTypeConstants();
        Map<String, Object> eventTypeConstants =
                baseEventTypeConstants == null ? new HashMap<String, Object>() : baseEventTypeConstants;
        eventTypeConstants.putAll(
                MapBuilder.of(
                        "topTextLayout", MapBuilder.of("registrationName", "onTextLayout"),
                        "topInlineViewLayout", MapBuilder.of("registrationName", "onInlineViewLayout"),
                        onPressEvent.EVENT_NAME, MapBuilder.of("registrationName", onPressEvent.EVENT_NAME)));
        return eventTypeConstants;
    }

    @Override
    public long measure(
            Context context,
            ReadableMap localData,
            ReadableMap props,
            ReadableMap state,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode,
            @Nullable float[] attachmentsPositions) {
        return TextLayoutManager.measureText(
                context,
                localData,
                props,
                width,
                widthMode,
                height,
                heightMode,
                mReactTextViewManagerCallback,
                attachmentsPositions);
    }

    public long measure(
            Context context,
            ReadableMapBuffer localData,
            ReadableMapBuffer props,
            @Nullable ReadableMapBuffer state,
            float width,
            YogaMeasureMode widthMode,
            float height,
            YogaMeasureMode heightMode,
            @Nullable float[] attachmentsPositions) {
        return TextLayoutManagerMapBuffer.measureText(
                context,
                localData,
                props,
                width,
                widthMode,
                height,
                heightMode,
                mReactTextViewManagerCallback,
                attachmentsPositions);
    }

    @Override
    public void setPadding(AMASpanView view, int left, int top, int right, int bottom) {
        view.setPadding(left, top, right, bottom);
    }
}

