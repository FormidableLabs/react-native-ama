package com.reactnativeama.components

import android.graphics.Color
import android.view.View
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class AmaFlatListWrapperManager : ViewGroupManager<AmaFlatListWrapper>() {
  private lateinit var container: AmaFlatListWrapper

  override fun getName() = "AmaFlatListWrapper"

  override fun createViewInstance(reactContext: ThemedReactContext): AmaFlatListWrapper {
    container = AmaFlatListWrapper(reactContext)

    return container
  }

  @ReactProp(name = "itemsCount")
  fun setItemsCount(view: AmaFlatListWrapper, count: Int) {
    view.setItemsCount(count)
  }

  override fun addView(parent: AmaFlatListWrapper?, child: View?, index: Int) {
     container.addView(child)
  }
}
