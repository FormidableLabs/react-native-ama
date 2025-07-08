package expo.modules.ama

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.ViewTreeObserver
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

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
        val issues = a11yChecker.performA11yChecks(currentDecorView)

        sendEvent(
                "onA11yIssues",
                mapOf("timestamp" to System.currentTimeMillis(), "issues" to issues)
        )
    }
}
