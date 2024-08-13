package com.reactnativeama.components

import android.view.View
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AMAWrapperManager : ViewGroupManager<AMAWrapper>() {
  private lateinit var container: AMAWrapper

  override fun getName() = "AMAWrapper"

  override fun createViewInstance(reactContext: ThemedReactContext): AMAWrapper {
    container = AMAWrapper(reactContext)

    return container
  }

  override fun addView(parent: AMAWrapper?, child: View?, index: Int) {
     container.addView(child)
  }
}
