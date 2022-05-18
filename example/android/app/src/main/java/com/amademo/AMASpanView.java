package com.amademo;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Typeface;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.BackgroundColorSpan;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.view.AccessibilityDelegateCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;

import com.amademo.Events.onPressEvent;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;

public class AMASpanView extends androidx.appcompat.widget.AppCompatTextView {
    private final AMATextShadowNode mAMATextShadowNode;
    private String mFontFamily;
    private int mFontWeight;
    private int mFontStyle;
    private int oldHeight;
    private ReadableArray mContent;
    private int mLinkBackgroundColor = Color.TRANSPARENT;

    public AMASpanView(ThemedReactContext reactContext, AMATextShadowNode amaTextShadowNode) {
        super(reactContext);

        mAMATextShadowNode = amaTextShadowNode;

        ViewCompat.setAccessibilityDelegate(this, new AccessibilityDelegateCompat() {
            @Override
            public void onInitializeAccessibilityNodeInfo(View host, AccessibilityNodeInfoCompat info) {
                super.onInitializeAccessibilityNodeInfo(host, info);

                info.addAction(AccessibilityNodeInfoCompat.ACTION_FOCUS);
                info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK);
                info.removeAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_LONG_CLICK);
                info.setClickable(false);
                info.setLongClickable(false);
            }
        });
    }

    public void setContent(@NonNull ReadableArray spans) {
        mContent = spans;

        update();
    }

    private void update() {
        SpannableStringBuilder spanText = new SpannableStringBuilder();
        int start = 0;

        for (int index = 0; index < mContent.size(); index++) {
            ReadableMap map = mContent.getMap(index);
            String text = map.getString("text");
            String callback = map.getString("onPress");

            spanText.append(text);

            if (callback != null) {
                int end = start + text.length();
                int finalIndex = index;

                spanText.setSpan(new ClickableSpan() {
                    @Override
                    public void onClick(@NonNull View view) {
                        dispatchOnPress(finalIndex);
                    }
                }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

                spanText.setSpan(
                        new BackgroundColorSpan(mLinkBackgroundColor),
                        start,
                        end,
                        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            start += text.length();
        }


        setMovementMethod(LinkMovementMethod.getInstance());
        setText(spanText, TextView.BufferType.SPANNABLE);

        requestLayout();
    }

    public void updateTypeface() {
        Typeface newTypeface =
                ReactTypefaceUtils.applyStyles(
                        getTypeface(), mFontStyle, mFontWeight, mFontFamily, getContext().getAssets());

        setTypeface(newTypeface);
        requestLayout();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        requestLayout();
    }

    @Override
    protected void onLayout(boolean changed, int textViewLeft, int textViewTop, int textViewRight, int textViewBottom) {
        super.onLayout(changed, textViewLeft, textViewTop, textViewRight, textViewBottom);

        setWidth(textViewRight - textViewLeft);
        measure(0, 0);

        int newHeight = getMeasuredHeight();

        if (newHeight == oldHeight) {
            return;
        }

        oldHeight = newHeight;
        mAMATextShadowNode.update(oldHeight);
    }

    public void setFontFamily(String fontFamily) {
        mFontFamily = fontFamily;

        updateTypeface();
    }

    public void setFontWeight(String fontWeight) {
        mFontWeight = ReactTypefaceUtils.parseFontWeight(fontWeight);

        updateTypeface();
    }

    public void setFontStyle(String fontStyle) {
        mFontStyle = ReactTypefaceUtils.parseFontStyle(fontStyle);

        updateTypeface();
    }

    public void setFontSize(float fontSize) {
        this.setTextSize(fontSize);

        requestLayout();
    }

    public void setLinkBackgroundColor(int color) {
        mLinkBackgroundColor = color;

        if (mContent != null) {
            update();
        }
    }

    private void dispatchOnPress(int index) {
        WritableMap map = Arguments.createMap();
        map.putInt("spanIndex", index);

        final ReactContext context = (ReactContext) getContext();
        context.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                onPressEvent.EVENT_NAME,
                map
        );
    }
}

