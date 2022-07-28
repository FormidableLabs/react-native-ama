package com.reactnativeama.components

import android.content.Context
import android.view.ViewGroup
import android.view.accessibility.AccessibilityNodeInfo

class AmaFlatListWrapper(context: Context?) : ViewGroup(context) {
    private var rowsCount = 0
    private var columnsCount = 1

    init {
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
        focusable = FOCUSABLE
    }

    override fun onInitializeAccessibilityNodeInfo(info: AccessibilityNodeInfo?) {
        super.onInitializeAccessibilityNodeInfo(info)

        info?.collectionInfo = AccessibilityNodeInfo.CollectionInfo.obtain(
            rowsCount,
            columnsCount,
            false
        )
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    }

    override fun setFocusable(focusable: Boolean) {
    }

    override fun setFocusable(focusable: Int) {
    }

    fun setRowsCount(count: Int) {
        rowsCount = count
    }

    fun setColumnsCount(count: Int) {
        columnsCount = count
    }
}
