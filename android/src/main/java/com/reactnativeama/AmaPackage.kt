package com.reactnativeama

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.reactnativeama.components.AmaFlatListWrapperManager
import com.reactnativeama.modules.AMAAnimationsStatusModule

class AmaPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(AMAAnimationsStatusModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(AmaFlatListWrapperManager())
    }
}
