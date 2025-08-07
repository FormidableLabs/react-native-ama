package expo.modules.ama

import android.graphics.Color
import android.graphics.Rect
import android.graphics.drawable.ColorDrawable
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import expo.modules.kotlin.AppContext
import java.util.Collections
import kotlin.collections.mutableListOf
import kotlin.synchronized

data class A11yIssue(
        val type: RuleAction,
        val rule: Rule,
        val label: String? = null,
        val reason: String? = null,
        val viewId: Int? = null,
)

enum class RuleAction {
    MUST,
    MUST_NOT,
    SHOULD,
    SHOULD_NOT,
    IGNORE
}

enum class Rule {
    CONTRAST_FAILED,
    CONTRAST_FAILED_AAA,
    FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE,
    FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE,
    MINIMUM_SIZE,
    NO_ACCESSIBILITY_LABEL,
    NO_ACCESSIBILITY_ROLE,
    NO_FORM_LABEL,
    NO_FORM_ERROR,
    NO_KEYBOARD_TRAP,
    NO_UNDEFINED,
    UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL,
    NO_UPPERCASE_TEXT,
    BOTTOM_SHEET_CLOSE_ACTION,
    INCOMPATIBLE_ACCESSIBILITY_STATE,
    NO_FORM_LABEL_ENDING_WITH_ASTERISK,
    INCOMPATIBLE_ACCESSIBILITY_ROLE
}

val LOGGER_RULES: Map<Rule, RuleAction> =
        mapOf(
                Rule.CONTRAST_FAILED to RuleAction.MUST,
                Rule.CONTRAST_FAILED_AAA to RuleAction.SHOULD,
                Rule.FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE to RuleAction.SHOULD,
                Rule.FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE to RuleAction.MUST,
                Rule.MINIMUM_SIZE to RuleAction.MUST,
                Rule.NO_ACCESSIBILITY_LABEL to RuleAction.MUST,
                Rule.NO_ACCESSIBILITY_ROLE to RuleAction.MUST,
                Rule.NO_FORM_LABEL to RuleAction.MUST,
                Rule.NO_FORM_ERROR to RuleAction.MUST,
                Rule.NO_KEYBOARD_TRAP to RuleAction.MUST_NOT,
                Rule.NO_UNDEFINED to RuleAction.MUST_NOT,
                Rule.UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL to RuleAction.MUST_NOT,
                Rule.NO_UPPERCASE_TEXT to RuleAction.MUST_NOT,
                Rule.BOTTOM_SHEET_CLOSE_ACTION to RuleAction.MUST,
                Rule.INCOMPATIBLE_ACCESSIBILITY_STATE to RuleAction.MUST,
                Rule.NO_FORM_LABEL_ENDING_WITH_ASTERISK to RuleAction.MUST_NOT,
                Rule.INCOMPATIBLE_ACCESSIBILITY_ROLE to RuleAction.MUST_NOT
        )

class A11yChecker(private val appContext: AppContext, private val config: AMAConfig) {
    val activity = appContext.activityProvider?.currentActivity

    private val issues = Collections.synchronizedList(mutableListOf<A11yIssue>())
    private val highlighter = Highlight(appContext)
    private lateinit var rootView: View

    public fun performA11yChecks(rootView: View): List<Map<String, Any?>> {
        Logger.info("performA11yChecks", "Performing a11y checks")

        this.rootView = rootView

        rootView.let { root ->
            val oldIssues = synchronized(issues) { issues.toList() }

            synchronized(issues) { issues.clear() }

            traverseAndCheck(root)

            clearFixedIssues(oldIssues)

            if (issues.isNotEmpty()) {
                Logger.debug("performA11yChecks", issues.toString())

                val issuesPayload =
                        issues.map { issue ->
                            mapOf(
                                    "type" to issue.type,
                                    "rule" to issue.rule,
                                    "label" to (issue.label ?: ""),
                                    "reason" to (issue.reason ?: ""),
                                    "viewId" to issue.viewId
                            )
                        }

                return issuesPayload
            }
        }

        return emptyList()
    }

    public fun clearAllIssues() {
        issues.forEach { issue -> issue.viewId?.let { highlighter.clearHighlight(it) } }
    }

    private fun clearFixedIssues(oldIssues: List<A11yIssue>) {
        val fixed = oldIssues.filter { it !in issues }

        fixed.forEach { issue -> issue.viewId?.let { highlighter.clearHighlight(it) } }
    }

    private fun traverseAndCheck(view: View) {
        val className = view.javaClass.name

        // Ignores the debug overlay
        if (className.startsWith("com.facebook.react.views.debuggingoverlay")) {
            return
        }

        checkView(view)

        if (view is ViewGroup) {
            for (i in 0 until view.childCount) {
                traverseAndCheck(view.getChildAt(i))
            }
        }
    }

    private fun addIssue(rule: Rule, label: String, reason: String, view: View) {
        val action = getRuleAction(rule)

        if (action == RuleAction.IGNORE) {
            return
        }

        val existingIssue = issues.find { it.rule == rule && it.viewId == view.id }

        if (existingIssue == null) {
            view.id.let { id -> highlighter.highlight(id, config.highlight, action) }

            issues.add(
                    A11yIssue(
                            type = action,
                            rule = rule,
                            label = label,
                            reason = reason,
                            viewId = view.id
                    )
            )
        }
    }

    private fun checkView(view: View) {
        val info = view.createAccessibilityNodeInfo()
        val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

        if (view.isPressable(a11yInfo)) {
            checkForA11yLabel(view, a11yInfo)
            checkForA11yRole(view, a11yInfo)
            checkForMinimumTargetSize(view)
        }

        // if (view is TextView) {
        //     Logger.debug("checkView", "Check for color contrast")
        //
        //     checkColorContrast(view)
        // }
    }

    private fun checkForA11yLabel(view: View, a11yInfo: AccessibilityNodeInfoCompat) {
        val a11yLabel: String? = a11yInfo.contentDescription?.toString()

        if (a11yLabel.isNullOrEmpty()) {
            Logger.error("checkForA11yLabel", view.toString())
            Logger.error("checkForA11yLabel", view.getTextOrContent())

            addIssue(
                    rule = Rule.NO_ACCESSIBILITY_LABEL,
                    label = view.getTextOrContent(),
                    reason = "",
                    view = view
            )
        }
    }

    private fun checkForA11yRole(view: View, a11yInfo: AccessibilityNodeInfoCompat) {
        val className = a11yInfo.className?.toString() ?: view.javaClass.simpleName
        val roleDescription: String? = a11yInfo.roleDescription?.toString()
        val defaultRole =
                when {
                    className.endsWith(".Button") -> "button"
                    className.endsWith(".CheckBox") -> "checkbox"
                    className.endsWith(".EditText") -> "text field"
                    className.endsWith(".ImageView") && view.isClickable -> "image button"
                    else -> null
                }

        val role = roleDescription ?: defaultRole

        if (role.isNullOrEmpty()) {
            Logger.error("checkForA11yRole", view.getTextOrContent())

            addIssue(
                    rule = Rule.NO_ACCESSIBILITY_ROLE,
                    label = view.getTextOrContent(),
                    reason = "",
                    view = view
            )
        }
    }

    private val density: Float
        get() = activity?.resources?.displayMetrics?.density ?: 1f

    /** dp → px */
    private fun dpToPx(dp: Float): Int = (dp * density + 0.5f).toInt()

    /** px → dp */
    private fun pxToDp(px: Int): Float = px / density

    private fun checkForMinimumTargetSize(view: View) {
        val absBounds = Rect().also { view.createAccessibilityNodeInfo().getBoundsInScreen(it) }

        getHitSlopRect(view)?.let { hitSlop ->
            absBounds.left -= hitSlop.left
            absBounds.top -= hitSlop.top
            absBounds.right += hitSlop.right
            absBounds.bottom += hitSlop.bottom
        }

        val widthPx = absBounds.width()
        val heightPx = absBounds.height()
        val widthDp = widthPx / view.resources.displayMetrics.density
        val heightDp = heightPx / view.resources.displayMetrics.density

        // 4) check vs 48dp
        if (widthDp < 48 || heightDp < 48) {
            addIssue(
                    rule = Rule.MINIMUM_SIZE,
                    label = view.toString(),
                    reason = String.format("%.1f×%.1f dp (< 48 dp)", widthDp, heightDp),
                    view = view
            )
        }
    }

    private fun checkColorContrast(textView: TextView) {
        try {
            // Get text color
            val textColor = textView.currentTextColor

            // Get background color
            val backgroundColor = getBackgroundColor(textView)

            // Calculate contrast ratio
            val contrastRatio = calculateContrastRatio(textColor, backgroundColor)

            // Check against WCAG standards
            val textSize =
                    textView.textSize / textView.context.resources.displayMetrics.scaledDensity
            val isLargeText = textSize >= 18f || (textSize >= 14f && isTextBold(textView))

            val minContrast = if (isLargeText) 3.0 else 4.5 // WCAG AA standards

            if (contrastRatio < minContrast) {
                addIssue(
                        rule = Rule.CONTRAST_FAILED,
                        label = textView.toString(),
                        reason = "Color contrast ratio ${String.format("%.2f", contrastRatio)}",
                        view = textView
                )
            }
        } catch (e: Exception) {
            // Handle cases where color extraction fails
            // Could add logging here if needed
        }
    }

    private fun getBackgroundColor(view: View): Int {
        // Try to get background color from the view itself
        val background = view.background
        if (background is ColorDrawable) {
            return background.color
        }

        // If no background, traverse up the view hierarchy
        var parent = view.parent
        while (parent is View) {
            val parentView = parent as View
            val parentBackground = parentView.background
            if (parentBackground is ColorDrawable) {
                return parentBackground.color
            }
            parent = parentView.parent
        }

        // Default to white if no background found
        return Color.WHITE
    }

    private fun isTextBold(textView: TextView): Boolean {
        val typeface = textView.typeface
        return typeface != null && typeface.isBold
    }

    private fun calculateContrastRatio(color1: Int, color2: Int): Double {
        val luminance1 = calculateLuminance(color1)
        val luminance2 = calculateLuminance(color2)

        val lighter = maxOf(luminance1, luminance2)
        val darker = minOf(luminance1, luminance2)

        return (lighter + 0.05) / (darker + 0.05)
    }

    private fun calculateLuminance(color: Int): Double {
        // Extract RGB components
        val red = Color.red(color) / 255.0
        val green = Color.green(color) / 255.0
        val blue = Color.blue(color) / 255.0

        // Apply gamma correction
        val r = if (red <= 0.03928) red / 12.92 else Math.pow((red + 0.055) / 1.055, 2.4)
        val g = if (green <= 0.03928) green / 12.92 else Math.pow((green + 0.055) / 1.055, 2.4)
        val b = if (blue <= 0.03928) blue / 12.92 else Math.pow((blue + 0.055) / 1.055, 2.4)

        // Calculate relative luminance
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    private fun getRuleAction(rule: Rule): RuleAction {
        val overrideAction = config.rules[rule.name]

        if (overrideAction != null) {
            return when (overrideAction.uppercase()) {
                "PLEASE_FORGIVE_ME" -> RuleAction.IGNORE
                "MUST" -> RuleAction.MUST
                "SHOULD" -> RuleAction.SHOULD
                "SHOULD_NOT" -> RuleAction.SHOULD_NOT
                "MUST_NOT" -> RuleAction.MUST_NOT
                else -> LOGGER_RULES[rule]!!
            }
        }

        return LOGGER_RULES[rule]!!
    }
}

fun View.isPressable(a11yInfo: AccessibilityNodeInfoCompat): Boolean {
    return this.isClickable && this.isAccessible(a11yInfo)
}

fun View.isAccessible(a11yInfo: AccessibilityNodeInfoCompat): Boolean {
    if (this.importantForAccessibility == View.IMPORTANT_FOR_ACCESSIBILITY_NO ||
                    !a11yInfo.isVisibleToUser
    ) {
        return false
    }

    return true
}

fun View.getTextOrContent(): String {
    if (!this.contentDescription.isNullOrEmpty()) {
        return this.contentDescription.toString()
    }

    if (this is TextView) {
        if (!this.text.isNullOrEmpty()) {
            return this.text.toString()
        }

        if (!this.hint.isNullOrEmpty()) {
            return this.hint.toString()
        }
    }

    val info = createAccessibilityNodeInfo()
    val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

    return a11yInfo.contentDescription?.toString().orEmpty()
}

fun getHitSlopRect(view: View): Rect? {
    return try {
        val rvClass = Class.forName("com.facebook.react.views.view.ReactViewGroup")

        if (!rvClass.isInstance(view)) {
            Logger.info("getHitSlopRect", "no class found")

            return null
        }

        val getter = rvClass.getMethod("getHitSlopRect")

        @Suppress("UNCHECKED_CAST") val rect = getter.invoke(view) as? Rect

        rect
    } catch (e: ClassNotFoundException) {
        null
    } catch (e: NoSuchMethodException) {
        null
    } catch (e: Exception) {
        null
    }
}
