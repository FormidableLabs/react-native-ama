package com.reactnativeama.components

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

  @ReactProp(name = "rowsCount")
  fun setRowsCount(view: AmaFlatListWrapper, count: Int) {
    view.setRowsCount(count)
  }

  @ReactProp(name = "columnsCount")
  fun setColumnsCount(view: AmaFlatListWrapper, count: Int) {
    view.setColumnsCount(count)
  }

  override fun addView(parent: AmaFlatListWrapper?, child: View?, index: Int) {
     container.addView(child)
  }
}
