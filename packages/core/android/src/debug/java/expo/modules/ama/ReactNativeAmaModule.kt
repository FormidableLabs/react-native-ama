package expo.modules.ama

import android.app.Activity
import android.graphics.Rect
import android.os.Handler
import android.os.Looper
import android.util.DisplayMetrics
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.widget.ScrollView
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.max

object Constants {
    const val DEBOUNCE: Long = 2000
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

        Events("onAmaNodes")

        Function("start") { ->
            if (highlighter == null) {
                highlighter = Highlight(appContext)
            }

            if (!isMonitoring) {
                Logger.info("start", "👀 Start Monitoring 👀")

                a11yChecker = NodesGrabber(appContext)

                getCurrentActivity()?.window?.decorView?.let {
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
}

private fun View.getGlobalDpBounds(rootView: View): List<Int> {
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
