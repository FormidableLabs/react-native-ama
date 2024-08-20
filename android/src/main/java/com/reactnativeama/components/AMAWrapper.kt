package com.reactnativeama.components

import android.content.Context
import android.view.ViewGroup
import android.view.accessibility.AccessibilityNodeInfo

class AMAWrapper(context: Context?) : ViewGroup(context) {
    private var rowsCount = 0
    private var columnsCount = 1

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    }
}
