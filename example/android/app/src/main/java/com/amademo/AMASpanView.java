package com.amademo;

import android.graphics.Typeface;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.view.AccessibilityDelegateCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.text.ReactTextView;
import com.facebook.react.views.text.ReactTypefaceUtils;

public class AMASpanView extends ReactTextView {
    private String mFontFamily;
    private int mFontWeight;
    private int mFontStyle;

    public AMASpanView(ThemedReactContext reactContext) {
        super(reactContext);

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
        SpannableStringBuilder spanText = new SpannableStringBuilder();
        int start = 0;

        for (int index = 0; index < spans.size(); index++) {
            ReadableMap map = spans.getMap(index);
            String text = map.getString("text");
            String callback = map.getString("onPress");

            spanText.append(text);

            if (callback != null) {
                spanText.setSpan(new ClickableSpan() {
                    @Override
                    public void onClick(@NonNull View view) {
                        Toast.makeText(getContext(), text, Toast.LENGTH_LONG).show();
                    }
                }, start, start + text.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            start += text.length();
        }

        setMovementMethod(LinkMovementMethod.getInstance());
        setText(spanText, TextView.BufferType.SPANNABLE);
        setMinimumHeight(500);
    }

    public void updateTypeface() {
        Typeface newTypeface =
                ReactTypefaceUtils.applyStyles(
                        getTypeface(), mFontStyle, mFontWeight, mFontFamily, getContext().getAssets());
        setTypeface(newTypeface);
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

        updateTypeface();}
}

