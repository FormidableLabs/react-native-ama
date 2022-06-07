package com.reactnativeama.components

import android.content.Context
import android.view.ViewGroup
import android.view.accessibility.AccessibilityNodeInfo

class AmaFlatListWrapper(context: Context?) : ViewGroup(context) {
    private var itemsCount = 0

    init {
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
        focusable = FOCUSABLE
    }

    override fun onInitializeAccessibilityNodeInfo(info: AccessibilityNodeInfo?) {
        super.onInitializeAccessibilityNodeInfo(info)

        info?.collectionInfo = AccessibilityNodeInfo.CollectionInfo.obtain(
            itemsCount,
            1,
            false
        )
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    }

    fun setItemsCount(count: Int) {
        itemsCount = count
    }
}
