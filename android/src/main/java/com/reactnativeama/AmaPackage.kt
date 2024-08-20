package com.reactnativeama

import android.util.Log
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.reactnativeama.components.AMAWrapperManager
import com.reactnativeama.modules.AMAKeyboardModule

class AmaPackage : ReactPackage {
    init {
        Log.d("AmaPackage", "AmaPackage is being initialized")
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
throw IllegalArgumentException()
        return listOf(AMAKeyboardModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        Log.d("AmaPackage", "AmaPackage is being initialized")
        return listOf(AMAWrapperManager())
    }
}
