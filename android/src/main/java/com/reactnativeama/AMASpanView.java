package com.reactnativeama;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.BackgroundColorSpan;
import android.text.style.ClickableSpan;
import android.text.style.StyleSpan;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.view.AccessibilityDelegateCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;

import com.reactnativeama.Events.onPressEvent;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTextView;
import com.facebook.react.views.text.ReactTypefaceUtils;

public class AMASpanView extends ReactTextView {
    private String mFontFamily;
    private int mFontWeight;
    private int mFontStyle;
    private int mLinkBackgroundColor = Color.TRANSPARENT;
    private int mLinkStyle = Typeface.NORMAL;
    private ReadableArray mContent;

    public AMASpanView(Context context) {
        super(context);

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

    public void setText(@NonNull ReadableArray content) {
        mContent = content;

        update();
    }

    public void update() {
        if (mContent == null) {
            return;
        }

        SpannableStringBuilder spanText = new SpannableStringBuilder();
        int start = 0;

        for (int index = 0; index < mContent.size(); index++) {
            ReadableMap map = mContent.getMap(index);
            String text = map.getString("text");
            String callback = map.getString("onPress");

            spanText.append(text);

            if (callback != null) {
                int end = start + text.length();
                int spanIndex = index;

                spanText.setSpan(new ClickableSpan() {
                    @Override
                    public void onClick(@NonNull View view) {
                        dispatchOnPress(spanIndex);
                    }
                }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

                spanText.setSpan(
                        new BackgroundColorSpan(mLinkBackgroundColor),
                        start,
                        end,
                        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

                spanText.setSpan(new StyleSpan(mLinkStyle), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
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
    }

    public void setLinkBackgroundColor(int color) {
        mLinkBackgroundColor = color;

        update();
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

    public void setLinkStyle(int linkStyle) {
        mLinkStyle = linkStyle;

        update();
    }

    @Override
    public void setTextColor(int color) {
        super.setTextColor(color);

        update();
    }
}
