package expo.modules.ama

import android.app.Activity
import android.graphics.Rect
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.DisplayMetrics
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.Window
import android.widget.ScrollView
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.max

object Constants {
    const val DEBOUNCE: Long = 100
}

class ReactNativeAmaModule : Module() {
    private var isMonitoring = false
    private var currentDecorView: View? = null
    private val drawListener = ViewTreeObserver.OnDrawListener { scheduleA11yCheck() }

    private val checkHandler = Handler(Looper.getMainLooper())
    private var checkRunnable: Runnable? = null
    private lateinit var a11yChecker: NodesGrabber
    private var highlighter: Highlight? = null
    private var isHighlighting = false

    override fun definition() = ModuleDefinition {
        Name("ReactNativeAma")

        Events("onAmaNodes", "onUIInteraction")

        Function("start") { ->
            if (highlighter == null) {
                highlighter = Highlight(appContext)
            }

            if (!isMonitoring) {
                Logger.info("start", "👀 Start Monitoring 👀")

                a11yChecker = NodesGrabber(appContext)

                val activity = getCurrentActivity()
                attachWindowTapProbe(activity)

                activity?.window?.decorView?.let {
                    currentDecorView = it
                    it.viewTreeObserver.addOnDrawListener(drawListener)
                }

                isMonitoring = true
            }
        }

        Function("stop") {
            if (isMonitoring) {
                currentDecorView?.let { it.viewTreeObserver.removeOnDrawListener(drawListener) }

                isMonitoring = false
            }
        }

        AsyncFunction("highlight") { viewId: Int, mode: String, hexColor: String ->
            val activity = appContext.activityProvider?.currentActivity ?: return@AsyncFunction null
            val root = activity.window.decorView as? ViewGroup ?: return@AsyncFunction null
            val target = root.findViewById<View>(viewId) ?: return@AsyncFunction null

            val scroll =
                    generateSequence(target.parent) { (it as? View)?.parent }
                            .filterIsInstance<ScrollView>()
                            .firstOrNull()
            scroll?.let { sv ->
                val frame = Rect().apply { target.getDrawingRect(this) }
                sv.offsetDescendantRectToMyCoords(target, frame)

                val topVisible = frame.top >= 0
                val bottomVisible = frame.bottom <= sv.height

                if (!topVisible || !bottomVisible) {
                    val mPx = (10 * activity.resources.displayMetrics.density).toInt()
                    val scrollToY =
                            when {
                                frame.top < 0 -> max(0, frame.top - mPx)
                                frame.bottom > sv.height -> frame.bottom - sv.height + mPx
                                else -> sv.scrollY
                            }
                    sv.scrollTo(sv.scrollX, scrollToY)
                }
            }

            highlighter?.highlight(viewId, mode, hexColor)

            target.getGlobalDpBounds(root)
        }

        AsyncFunction("clearHighlight") { viewId: Int -> highlighter?.clearHighlight(viewId) }

        Function("highlightCompleted") { isHighlighting = false }
    }

    private fun attachWindowTapProbe(activity: Activity?) {
        if (activity == null) {
            return
        }

        val originalCallback = activity.window.callback
        val rootView = activity.window.decorView.rootView

        activity.window.callback = object : Window.Callback by originalCallback {

            // Simple tap detection state
            private var downX = 0f
            private var downY = 0f
            private val TAP_THRESHOLD = 20f // Max movement (in pixels) for a "tap"

            override fun dispatchTouchEvent(event: MotionEvent?): Boolean {
                if (event != null) {
                    when (event.action) {
                        MotionEvent.ACTION_DOWN -> {
                            // Store tap start location
                            downX = event.x
                            downY = event.y
                        }

                        MotionEvent.ACTION_UP -> {
                            // Check if it was a tap (not a scroll)
                            val isTap = (Math.abs(event.x - downX) < TAP_THRESHOLD) &&
                                    (Math.abs(event.y - downY) < TAP_THRESHOLD)

                            Logger.info("isTap", isTap.toString())

                            if (isTap) {
                                // We detected a tap!
                                // Now, find the view that was tapped
                                val tappedView =
                                    findViewAt(rootView, event.rawX.toInt(), event.rawY.toInt())

                                if (tappedView != null && tappedView.isClickable) {
                                    // This is the "hijack" point.
                                    // We found a tap on a clickable view.
                                    runMyChecks(tappedView, rootView)
                                }
                            }
                        }
                    }
                }

                // **CRITICAL:** Always call the original callback
                // This passes the event to React Native so the app works.
                return originalCallback.dispatchTouchEvent(event)
            }
        }
    }

    private fun getCurrentActivity(): Activity? {
        return appContext.activityProvider?.currentActivity
    }

    private fun scheduleA11yCheck() {
        checkRunnable?.let { checkHandler.removeCallbacks(it) }
        checkRunnable = Runnable {
            val decorView = currentDecorView ?: return@Runnable

            getNodesToCheck()
        }

        checkHandler.postDelayed(checkRunnable!!, Constants.DEBOUNCE)
    }

    private fun getNodesToCheck() {
        val issues = a11yChecker.getNodesToCheck(currentDecorView!!)
        val nodesWithStringKeys = issues.mapKeys { it.key.toString() }.mapValues { it.value }

        sendEvent("onAmaNodes", nodesWithStringKeys)
    }


    /**
     * Finds the deepest child view at a given screen coordinate.
     */
    private fun findViewAt(root: View, x: Int, y: Int): View? {
        val viewsToVisit = arrayListOf<View>()
        viewsToVisit.add(root)

        var bestFit: View? = null
        val hitRect = Rect()

        var i = 0
        while (i < viewsToVisit.size) {
            val child = viewsToVisit[i++]

            // Get view's location on screen
            child.getGlobalVisibleRect(hitRect)

            if (hitRect.contains(x, y)) {
                bestFit = child

                val info = child.createAccessibilityNodeInfo()
                val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

                // If is a button then we can stop there
                if (child.isPressable(a11yInfo)) {
                    break
                }

                if (child is android.view.ViewGroup) {
                    for (j in 0 until child.childCount) {
                        viewsToVisit.add(child.getChildAt(j))
                    }
                }
            }
        }

        return bestFit
    }

    private fun runMyChecks(tappedView: View, rootView: View) {
        val beforeFocus = rootView.findFocus()
        val beforeSnapshot = takeSnapshot(tappedView, rootView)

        Handler(Looper.getMainLooper()).postDelayed({
            val afterFocus = rootView.findFocus()
            val afterSnapshot = takeSnapshot(tappedView, rootView)
//        val afterState = ViewState(
//            fgColor = tappedView.getTextColor(),
//            bgColor = tappedView.getBackgroundColor()
//        )
//
//        val focusMoved = (beforeFocus != afterFocus)
//
//        // "Does the original button have new state...?"
//        val stateChanged = !(beforeStates.bgColor?.equals(afterState.bgColor) ?: true) || !(beforeStates.fgColor?.equals(afterState.fgColor) ?: true)
//        Logger.info("state", beforeStates.toString(), afterState.toString())
////
////        // ... Your logic here ...
////
////        if (focusMoved) {
////            Logger.info("focus moved", afterFocus.toString())
////        }
//
//        if (stateChanged) {
//            Logger.info("state changed", beforeStates.fgColor?.toString() ?: "", afterState.fgColor?.toString() ?: "")
//        }

            val event = Bundle().apply {
                putBundle("before", convertMapToBundle(beforeSnapshot))
                putBundle("after", convertMapToBundle(afterSnapshot))
            }

            // Logger.info("onUIInteraction", event.toString())

            sendEvent("onUIInteraction", event)

        }, 1000) // 250ms is a starting point. Tune this delay.
    }
}

data class UiChanged (
    val before: Map<Int, Snapshot>,
    val after: Map<Int, Snapshot>,
)

data class Snapshot(
    val fgColor: Int?,
    val bgColor: Int?,
    val position: List<Int>,
    val isEnabled: Boolean
)

private fun takeSnapshot(view: View, root: View, snapshots: MutableMap<Int, Snapshot> = mutableMapOf()): MutableMap<Int, Snapshot> {
    snapshots[view.id] = Snapshot(
        fgColor = view.getTextColor(),
        bgColor = view.getBackgroundColor(),
        position = view.getGlobalDpBounds(root),
        isEnabled = view.isEnabled
    )

    if (view is ViewGroup) {
        for (i in 0 until view.childCount) {
            takeSnapshot(view.getChildAt(i), root, snapshots)
        }
    }

    return snapshots
}

fun View.getGlobalDpBounds(rootView: View): List<Int> {
    val abs = Rect().also { createAccessibilityNodeInfo().getBoundsInScreen(it) }

    val origin = IntArray(2).also { rootView.getLocationOnScreen(it) }
    val relLeftPx = abs.left - origin[0]
    val relTopPx = abs.top - origin[1]
    val widthPx = abs.width()
    val heightPx = abs.height()

    val metrics: DisplayMetrics = resources.displayMetrics
    val d = metrics.density
    val leftDp = (relLeftPx / d).toInt()
    val topDp = (relTopPx / d).toInt()
    val widthDp = (widthPx / d).toInt()
    val heightDp = (heightPx / d).toInt()

    return listOf(leftDp, topDp, widthDp, heightDp)
}

/**
 * Helper 1: Converts a Map<Int, Snapshot> to a Bundle.
 * JS objects must have String keys, so we convert the Int key to a String.
 */
private fun convertMapToBundle(snapshotMap: Map<Int, Snapshot>): Bundle {
    return Bundle().apply {
        snapshotMap.forEach { (key, snapshot) ->
            // Convert Int key to String and Snapshot to Bundle
            putBundle(key.toString(), convertSnapshotToBundle(snapshot))
        }
    }
}

/**
 * Helper 2: Converts a single Snapshot data class to a Bundle.
 */
private fun convertSnapshotToBundle(snapshot: Snapshot): Bundle {
    return Bundle().apply {
        // Only put colors if they are not null
        snapshot.fgColor?.let { putInt("fgColor", it) }
        snapshot.bgColor?.let { putInt("bgColor", it) }

        // Convert List<Int> to ArrayList<Int> for the Bundle
        putIntegerArrayList("position", ArrayList(snapshot.position))

        putBoolean("isEnabled", snapshot.isEnabled)
    }
}