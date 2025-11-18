package expo.modules.ama

import android.R
import android.app.Activity
import android.content.Context
import android.content.res.Resources
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
import android.widget.Checkable
import android.widget.ScrollView
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.max

object Constants {
    const val DEBOUNCE: Long = 100
    var uiCheckDelay: Long = 1000
}

class ReactNativeAmaModule : Module() {
    private var isMonitoring = false
    private var currentDecorView: View? = null
    private val drawListener = ViewTreeObserver.OnDrawListener { scheduleA11yCheck() }

    private val checkHandler = Handler(Looper.getMainLooper())
    private var checkRunnable: Runnable? = null
    private lateinit var a11yChecker: NodesGrabber
    private var highlighter: Highlight? = null

    override fun definition() = ModuleDefinition {
        Name("ReactNativeAma")

        Events("onAmaNodes", "onUIInteraction")

        Function("start") { args: Map<String, Any?>? ->
            val uiCheck = args?.get("ui") as? Boolean ?: false
            Constants.uiCheckDelay = args?.get("delay") as? Long ?: Constants.uiCheckDelay
//            val groupingCheck = checks?.get("grouping") as? Boolean ?: false

            if (highlighter == null) {
                highlighter = Highlight(appContext)
            }

            if (!isMonitoring) {
                Logger.info("start", "👀 Start Monitoring 👀" + args.toString())

                a11yChecker = NodesGrabber(appContext)

                val activity = getCurrentActivity()

                if (uiCheck) {
                    attachWindowTapProbe(activity)
                }

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
                            val isTap = (Math.abs(event.x - downX) < TAP_THRESHOLD) &&
                                    (Math.abs(event.y - downY) < TAP_THRESHOLD)

                            if (isTap) {
                                val tappedView =
                                    findViewAt(rootView, event.rawX.toInt(), event.rawY.toInt())

                                val info = tappedView?.createAccessibilityNodeInfo()
                                val a11yInfo = info?.let { AccessibilityNodeInfoCompat.wrap(it) }
                                val isAccessible = a11yInfo?.let { tappedView.isAccessible(it) }

                                if (tappedView != null && tappedView.isClickable && isAccessible == true) {
                                    runMyChecks(tappedView, rootView)
                                }
                            }
                        }
                    }
                }

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
            getNodesToCheck()
        }

        checkHandler.postDelayed(checkRunnable!!, Constants.DEBOUNCE)
    }

    private fun getNodesToCheck(send: Boolean = true): Map<String, Any?> {
        val issues = a11yChecker.getNodesToCheck(currentDecorView!!)
        val nodesWithStringKeys = issues.mapKeys { it.key.toString() }.mapValues { it.value }

        if (send) {
            sendEvent("onAmaNodes", nodesWithStringKeys)
        }

        return nodesWithStringKeys
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

            child.getGlobalVisibleRect(hitRect)

            if (hitRect.contains(x, y)) {
                bestFit = child

                val info = child.createAccessibilityNodeInfo()
                val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

                // If is a button then we can stop there
                if (child.isPressable(a11yInfo)) {
                    break
                }

                if (child is ViewGroup) {
                    for (j in 0 until child.childCount) {
                        viewsToVisit.add(child.getChildAt(j))
                    }
                }
            }
        }

        return bestFit
    }

    private fun runMyChecks(tappedView: View, rootView: View) {
        val beforeSnapshot = takeSnapshotOfTappedView(tappedView, rootView)

        Handler(Looper.getMainLooper()).postDelayed({
            if (tappedView.isAttachedToWindow && rootView.isAttachedToWindow) {
                val afterSnapshot = takeSnapshotOfTappedView(tappedView, rootView)

                val event = Bundle().apply {
                    putInt("rootTag", tappedView.id)
                    putBundle("before", convertSnapshotMapToBundle(beforeSnapshot))
                    putBundle("after", convertSnapshotMapToBundle(afterSnapshot))
                }

                getNodesToCheck()
                sendEvent("onUIInteraction", event)
            }
        }, Constants.uiCheckDelay)
    }
}

data class Snapshot(
    val fgColor: String?,
    val bgColor: String?,
    val x: Int,
    val y: Int,
    val width: Int,
    val height: Int,
    val parentId: Int,
    val isPressable: Boolean,
    val isChecked: Boolean,
    val isBusy: Boolean,
    val isSelected: Boolean,
    val isDisabled: Boolean,
    val isExpanded: Boolean
)

private fun takeSnapshotOfTappedView(view: View, root: View, snapshots: MutableMap<Int, Snapshot> = mutableMapOf()): MutableMap<Int, Snapshot> {
    val info = view.createAccessibilityNodeInfo()
    val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

    val position = view.getGlobalDpBounds(root)
    val a11yStates = view.a11yStates()

    snapshots[view.id] = Snapshot(
        fgColor = view.getTextColorHex(),
        bgColor = view.getBackgroundColorHex(),
        x = position[0],
        y = position[1],
        width = position[2],
        height = position[3],
        parentId = (view.parent as? View)?.id ?: View.NO_ID,
        isPressable = view.isPressable(a11yInfo),
        isChecked = a11yInfo.isChecked,
        isBusy = view.isBusy(),
        isDisabled = a11yStates.isDisabled,
        isExpanded = a11yStates.isExpanded,
        isSelected = a11yStates.isSelected,
    )


    if (view is ViewGroup) {
        for (i in 0 until view.childCount) {
            takeSnapshotOfTappedView(view.getChildAt(i), root, snapshots)
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

private fun convertSnapshotMapToBundle(snapshotMap: Map<Int, Snapshot>): Bundle {
    return Bundle().apply {
        snapshotMap.forEach { (key, snapshot) ->
            putBundle(key.toString(), convertSnapshotToBundle(snapshot))
        }
    }
}

private fun convertSnapshotToBundle(snapshot: Snapshot): Bundle {
    return Bundle().apply {
        snapshot.fgColor?.let { putString("fgColor", it) }
        snapshot.bgColor?.let { putString("bgColor", it) }

        putInt("x", snapshot.x)
        putInt("y", snapshot.y)
        putInt("width", snapshot.width)
        putInt("height", snapshot.height)
        putInt("parentId", snapshot.parentId)

        putBoolean("isPressable", snapshot.isPressable)
        putBoolean("isChecked", snapshot.isChecked)
        putBoolean("isBusy", snapshot.isBusy)
        putBoolean("isExpanded", snapshot.isExpanded)
        putBoolean("isDisabled", snapshot.isDisabled)
        putBoolean("isSelected", snapshot.isSelected)
    }
}

fun View.isBusy(): Boolean {
    val info = AccessibilityNodeInfoCompat.wrap(this.createAccessibilityNodeInfo())

    val combined = buildString {
        info.contentDescription?.let { append(it).append(' ') }
        info.text?.let { append(it) }
    }

    if (matchesBusyToken(this, combined)) {
        return true
    }

    return false
}

data class A11yStates(
    val isExpanded: Boolean,
    val isDisabled: Boolean,
    val isSelected: Boolean
)

fun View.a11yStates(): A11yStates {
    val info = AccessibilityNodeInfoCompat.wrap(createAccessibilityNodeInfo())

    val isDisabled = !info.isEnabled || !isEnabled || !isActuallyInteractable()
    val isSelected = info.isSelected || isSelected || (this as? Checkable)?.isChecked == true

    val isExpanded: Boolean? = when {
        hasAction(info, AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_COLLAPSE) &&
                !hasAction(info, AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_EXPAND) -> true
        hasAction(info, AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_EXPAND) &&
                !hasAction(info, AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_COLLAPSE) -> false
        else -> {
            val haystack = buildString {
                info.contentDescription?.let { append(it).append(' ') }
                info.text?.let { append(it).append(' ') }
                info.stateDescription?.let { append(it) }
                ViewCompat.getStateDescription(this@a11yStates)?.let { append(' ').append(it) }
            }.trim()
            parseExpandedFromText(haystack, context)
        }
    }

    return A11yStates(isExpanded ?: false, isDisabled, isSelected)
}

private fun hasAction(
    info: AccessibilityNodeInfoCompat,
    action: AccessibilityNodeInfoCompat.AccessibilityActionCompat
): Boolean = info.actionList.any { it.id == action.id }

/** Treat hidden/transparent/non-interactive as effectively disabled for interaction checks. */
private fun View.isActuallyInteractable(): Boolean =
    visibility == View.VISIBLE && alpha > 0.01f && isClickableOrFocusable()

private fun View.isClickableOrFocusable(): Boolean =
    isClickable || isLongClickable || isFocusable

private fun parseExpandedFromText(s: String, ctx: Context): Boolean? {
    if (s.isBlank()) return null
    val expandedTokens = rnTokens(ctx, "state_expanded_description", listOf("expanded"))
    val collapsedTokens = rnTokens(ctx, "state_collapsed_description", listOf("collapsed"))
    val low = s.lowercase()
    return when {
        expandedTokens.any { low.contains(it) } -> true
        collapsedTokens.any { low.contains(it) } -> false
        else -> null
    }
}

private fun rnTokens(ctx: Context, key: String, fallbacks: List<String>): List<String> {
    val res = ctx.resources
    val out = mutableListOf<String>()

    fun addIfExists(pkg: String) {
        val id = res.getIdentifier(key, "string", pkg)
        if (id != 0) out += res.getString(id).lowercase()
    }

    addIfExists(ctx.packageName)       // app bundle
    addIfExists("com.facebook.react")  // RN bundle (older merges)
    out += fallbacks.map { it.lowercase() }

    return out.distinct()
}

private fun matchesBusyToken(view: View, s: String): Boolean {
    busyStrings(view).forEach { token ->
        if (token.isNotEmpty() && s.contains(token, ignoreCase = true)) return true
    }

    return s.contains("busy", ignoreCase = true) || s.contains("loading", ignoreCase = true)
}

private fun busyStrings(view: View): List<String> {
    val res = view.resources
    val pkg = view.context.packageName
    return listOfNotNull(
        res.getIdentifier("state_busy_description", "string", pkg).takeIf { it != 0 }?.let(res::getString),
        res.getIdentifier("state_busy_description", "string", "com.facebook.react").takeIf { it != 0 }?.let(res::getString)
    )
}