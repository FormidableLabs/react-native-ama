package com.reactnativeama.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.provider.Settings
import androidx.annotation.NonNull
import android.content.res.Configuration

class AMAKeyboardModule(private val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    @NonNull
    override fun getName(): String {
        return "AMAKeyboard"
    }

    @ReactMethod
    fun isKeyboardConnected(): Boolean {
        val keyboard = context.resources.configuration.keyboard

        return keyboard != Configuration.KEYBOARD_UNDEFINED && keyboard != Configuration.KEYBOARD_NOKEYS
    }
}
