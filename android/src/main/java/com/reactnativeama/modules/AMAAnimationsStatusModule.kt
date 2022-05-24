package com.reactnativeama.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.provider.Settings
import androidx.annotation.NonNull

class AMAAnimationsStatusModule(private val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    @NonNull
    override fun getName(): String {
        return "AMAAnimationsStatus"
    }

    @ReactMethod
    fun areAnimationsEnabled(promise: Promise) {
        val animationDurationScale = Settings.Global.getFloat(
            context.getContentResolver(),
            Settings.Global.ANIMATOR_DURATION_SCALE,
            1.0f
        )
        val transitionAnimationScale = Settings.Global.getFloat(
            context.getContentResolver(),
            Settings.Global.TRANSITION_ANIMATION_SCALE,
            1.0f
        )
        val windowAnimationScale = Settings.Global.getFloat(
            context.getContentResolver(),
            Settings.Global.WINDOW_ANIMATION_SCALE,
            1.0f
        )

        promise.resolve(animationDurationScale == 1f && transitionAnimationScale == 1f && windowAnimationScale == 1f)
    }
}
