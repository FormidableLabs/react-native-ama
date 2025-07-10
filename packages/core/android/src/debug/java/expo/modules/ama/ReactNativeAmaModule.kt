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
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.max

object Constants {
    const val DEBOUNCE: Long = 100
}

data class AMAConfig(
        val rules: Map<String, String> = emptyMap(),
        val accessibilityLabelExceptions: List<String> = emptyList(),
        val highlight: String = "both"
)

class ReactNativeAmaModule : Module() {
    private var isMonitoring = false
    private var currentDecorView: View? = null
    private val drawListener = ViewTreeObserver.OnDrawListener { scheduleA11yCheck() }

    private val checkHandler = Handler(Looper.getMainLooper())
    private var checkRunnable: Runnable? = null
    private lateinit var a11yChecker: A11yChecker

    override fun definition() = ModuleDefinition {
        Name("ReactNativeAma")

        Events("onA11yIssues")

        Function("start") { configMap: Map<String, Any?> ->
            if (!isMonitoring) {

                val config =
                        AMAConfig(
                                // Use safe casting and provide default values
                                rules = configMap["rules"] as? Map<String, String> ?: emptyMap(),
                                accessibilityLabelExceptions =
                                        configMap["accessibilityLabelExceptions"] as? List<String>
                                                ?: emptyList(),
                                highlight = configMap["highlight"] as? String ?: "both"
                        )

                Logger.info("start", "👀 Start Monitoring 👀", config.toString())

                a11yChecker = A11yChecker(appContext, config)

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

        AsyncFunction("getPosition") { viewId: Int ->
            val activity = appContext.activityProvider?.currentActivity ?: return@AsyncFunction null
            val root = activity.window.decorView as? ViewGroup ?: return@AsyncFunction null
            val target = root.findViewById<View>(viewId) ?: return@AsyncFunction null

            // 1) Scroll into view if in a ScrollView
            val scroll =
                    generateSequence(target.parent) { (it as? View)?.parent }
                            .filterIsInstance<ScrollView>()
                            .firstOrNull()
            scroll?.let { sv ->
                val frame = Rect().apply { target.getDrawingRect(this) }
                sv.offsetDescendantRectToMyCoords(target, frame)
                val mPx = (10 * activity.resources.displayMetrics.density).toInt()
                frame.top = max(0, frame.top - mPx)
                sv.scrollTo(frame.left, frame.top)
            }

            target.getGlobalDpBounds(root)
        }

        AsyncFunction("inspectViewAttributes") { viewId: Int ->
            val activity: Activity =
                    appContext.activityProvider?.currentActivity ?: return@AsyncFunction null

            val root = activity.window.decorView as? ViewGroup ?: return@AsyncFunction null

            // find the view
            val view = root.findViewById<View>(viewId) ?: return@AsyncFunction null

            // wrap its AccessibilityNodeInfo for compat APIs
            val info = AccessibilityNodeInfoCompat.wrap(view.createAccessibilityNodeInfo())

            // get raw screen bounds
            val loc = IntArray(2)
            view.getLocationOnScreen(loc)
            val bounds =
                    mapOf(
                            "left" to loc[0],
                            "top" to loc[1],
                            "right" to loc[0] + view.width,
                            "bottom" to loc[1] + view.height
                    )

            mapOf<String, Any?>(
                    "id" to view.id,
                    "className" to view.javaClass.name,
                    "visibility" to view.visibility, // 0=VISIBLE,4=INVISIBLE,8=GONE
                    "importantForAccessibility" to view.importantForAccessibility,
                    "clickable" to view.isClickable,
                    "focusable" to view.isFocusable,
                    "contentDescription" to view.contentDescription?.toString(),
                    "a11yText" to info.text?.toString(),
                    "a11yRoleDescription" to info.roleDescription?.toString(),
                    "isVisibleToUser" to info.isVisibleToUser,
                    "bounds" to bounds
            )
        }
    }

    private fun getCurrentActivity(): Activity? {
        return appContext.activityProvider?.currentActivity
    }

    private fun scheduleA11yCheck() {
        checkRunnable?.let { checkHandler.removeCallbacks(it) }
        checkRunnable = Runnable {
            Logger.info2("scheduleA11yCheck", "💨 Running a11y scheduler")

            val decorView = currentDecorView ?: return@Runnable

            // When a component fails an a11y check, we highlight that.
            // This causes the drawListener to being fired again, causing
            // an infinite loop. To avoid that we temporarily detach the listener
            // until all thecks have been performed.
            decorView.viewTreeObserver.removeOnDrawListener(drawListener)

            performA11yChecks()

            decorView.post {
                // Check if the observer is still alive before re-attaching
                if (decorView.viewTreeObserver.isAlive) {
                    decorView.viewTreeObserver.addOnDrawListener(drawListener)
                }
            }
        }
        checkHandler.postDelayed(checkRunnable!!, Constants.DEBOUNCE)
    }

    private fun performA11yChecks() {
        Logger.info("performA11yChecks", "doing the job")
        val issues = a11yChecker.performA11yChecks(currentDecorView!!)

        sendEvent(
                "onA11yIssues",
                mapOf("timestamp" to System.currentTimeMillis(), "issues" to issues)
        )
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
