package expo.modules.ama

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Rect
import android.graphics.drawable.*
import android.graphics.drawable.ColorDrawable
import android.text.Spanned
import android.text.TextPaint
import android.text.style.CharacterStyle
import android.text.style.ForegroundColorSpan
import android.text.style.TextAppearanceSpan
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import expo.modules.kotlin.AppContext

data class NodePayload(
        val type: String,
        val viewId: Int,
        val bounds: Array<Float>?,
        val ariaLabel: String?,
        val content: String?,
        val ariaRole: String?,
        val fg: String?,
        val bg: String?,
        val fontSize: Float?,
        val isBold: Boolean?,
        val isEnabled: Boolean?
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
                "type" to this.type,
                "viewId" to this.viewId,
                "bounds" to this.bounds,
                "ariaLabel" to this.ariaLabel,
                "content" to this.content,
                "ariaRole" to this.ariaRole,
                "fg" to this.fg,
                "bg" to this.bg,
                "fontSize" to this.fontSize,
                "isBold" to this.isBold,
                "isEnabled" to this.isEnabled
        )
    }
}

enum class NodeType {
    Pressable,
    Text
}

class NodesGrabber(private val appContext: AppContext) {
    val activity = appContext.activityProvider?.currentActivity

    private var nodesToCheck = mutableMapOf<Int, NodePayload>()
    private lateinit var rootView: View

    public fun getNodesToCheck(rootView: View): Map<Int, Any?> {
        this.rootView = rootView

        rootView.let { root -> traverseAndCheck(root) }

        return nodesToCheck.mapValues { it.value.toMap() }
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

    private fun addNode(node: NodePayload) {
        // Kotlin doesn't have 'guard let'. An 'if' statement with an
        // early return is the common equivalent.
        if (node.viewId <= 0) {
            return
        }

        nodesToCheck[node.viewId] = node
    }

    private fun checkView(view: View) {
        val info = view.createAccessibilityNodeInfo()
        val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

        if (view.isPressable(a11yInfo)) {
            addNode(
                    node =
                            NodePayload(
                                    type = "Pressable",
                                    viewId = view.id,
                                    bounds = getTargetArea(view),
                                    ariaLabel = a11yInfo.contentDescription?.toString(),
                                    content = view.getTextOrContent(),
                                    ariaRole = view.getAriaRole(a11yInfo),
                                    fg = view.getTextColor(),
                                    bg = view.getBackgroundColor(),
                                    fontSize = view.getFontSize(),
                                    isBold = view.isTextBold(),
                                    isEnabled = !view.isDisabled(),
                            )
            )
        }
    }

    private val density: Float
        get() = activity?.resources?.displayMetrics?.density ?: 1f

    /** dp → px */
    private fun dpToPx(dp: Float): Int = (dp * density + 0.5f).toInt()

    /** px → dp */
    private fun pxToDp(px: Int): Float = px / density

    private fun getTargetArea(view: View): Array<Float> {
        val absBounds = Rect().also { view.createAccessibilityNodeInfo().getBoundsInScreen(it) }

        view.getHitSlopRect()?.let { hitSlop ->
            absBounds.left -= hitSlop.left
            absBounds.top -= hitSlop.top
            absBounds.right += hitSlop.right
            absBounds.bottom += hitSlop.bottom
        }

        val widthPx = absBounds.width()
        val heightPx = absBounds.height()
        val widthDp: Float = widthPx / view.resources.displayMetrics.density
        val heightDp: Float = heightPx / view.resources.displayMetrics.density

        return arrayOf(widthDp, heightDp)
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

fun Int.toHex(): String {
    return String.format("#%06X", 0xFFFFFF and this)
}

fun View.getTextColor(): String? = getEffectiveTextColorInt()?.toHex()

fun View.getEffectiveTextColorInt(): Int? {
    return when (this) {
        is TextView -> extractColorFromTextView(this)
        is ViewGroup -> {
            for (i in 0 until childCount) {
                getChildAt(i).getEffectiveTextColorInt()?.let {
                    return it
                }
            }
            null
        }
        else -> null
    }
}

private fun extractColorFromTextView(tv: TextView): Int {
    val cs = tv.text
    // Try spans at the first non-whitespace character
    if (cs is Spanned && cs.isNotEmpty()) {
        val idx = cs.toString().indexOfFirst { !it.isWhitespace() }.let { if (it < 0) 0 else it }

        // 1) Standard ForegroundColorSpan
        cs.getSpans(idx, idx + 1, ForegroundColorSpan::class.java).lastOrNull()?.let {
            return it.foregroundColor
        }

        // 2) React Native span: ReactForegroundColorSpan (class name is stable across versions)
        val spans = cs.getSpans(idx, idx + 1, CharacterStyle::class.java)
        spans.asList().asReversed().forEach { span ->
            runCatching {
                val m = span.javaClass.getMethod("getForegroundColor")
                (m.invoke(span) as? Int)
            }
                    .getOrNull()
                    ?.let {
                        return it
                    }

            // …then fall back to a common private field name
            runCatching {
                val f = span.javaClass.getDeclaredField("mColor").apply { isAccessible = true }
                f.getInt(span)
            }
                    .getOrNull()
                    ?.let {
                        return it
                    }
        }

        // 3) Some styles come via TextAppearanceSpan
        cs.getSpans(idx, idx + 1, TextAppearanceSpan::class.java).lastOrNull()?.let { ta ->
            val tp = TextPaint()
            ta.updateDrawState(tp)
            return tp.color
        }
    }

    // 4) Fallback to TextView’s (stateful) ColorStateList
    return tv.textColors?.getColorForState(tv.drawableState, tv.currentTextColor)
            ?: tv.currentTextColor
}

fun View.getBackgroundColor(): String? {
    extractSolidColor(background)?.let {
        return it.toHex()
    }

    var p = parent
    while (p is View) {
        extractSolidColor(p.background)?.let {
            return it.toHex()
        }
        p = p.parent
    }

    return null
}

private fun extractSolidColor(d: Drawable?): Int? =
        when (d) {
            null -> null
            is ColorDrawable -> d.color
            is GradientDrawable -> d.color?.defaultColor
            is StateListDrawable -> extractSolidColor(d.current)
            is InsetDrawable -> extractSolidColor(d.drawable)
            is LayerDrawable -> {
                for (i in 0 until d.numberOfLayers) {
                    extractSolidColor(d.getDrawable(i))?.let {
                        return it
                    }
                }
                null
            }
            is RippleDrawable -> {
                runCatching { extractSolidColor(d.getDrawable(0)) }.getOrNull()
            }
            else ->
                    extractRNBackgroundDrawableColor(
                            d
                    ) // 👈 handle RN BackgroundDrawable/ReactViewBackgroundDrawable
        }

/** Works with RN ≥0.7x `BackgroundDrawable` and legacy `ReactViewBackgroundDrawable`. */
private fun extractRNBackgroundDrawableColor(d: Drawable): Int? {
    val cls = d.javaClass
    val name = cls.name
    if (!name.endsWith("BackgroundDrawable")) return null

    // Try public getters first (some versions expose these)
    runCatching { cls.getMethod("getColor").invoke(d) }.getOrNull()?.let {
        return asColorInt(it)
    }
    runCatching { cls.getMethod("getBackgroundColor").invoke(d) }.getOrNull()?.let {
        return asColorInt(it)
    }

    // Fall back to common private fields across versions
    val candidateFields = arrayOf("mColor", "mBackgroundColor")
    for (fName in candidateFields) {
        val v =
                runCatching { cls.getDeclaredField(fName).apply { isAccessible = true }.get(d) }
                        .getOrNull()
        asColorInt(v)?.let {
            return it
        }
    }

    return null
}

private fun asColorInt(value: Any?): Int? =
        when (value) {
            is Int -> value.takeIf { Color.alpha(it) != 0 }
            is ColorStateList -> value.defaultColor.takeIf { Color.alpha(it) != 0 }
            else -> null
        }

fun View.getFontSize(): Float? {
    if (this is TextView) {
        return this.textSize / this.context.resources.displayMetrics.scaledDensity
    }

    return null
}

fun View.getHitSlopRect(): Rect? {
    return try {
        val rvClass = Class.forName("com.facebook.react.views.view.ReactViewGroup")

        if (!rvClass.isInstance(this)) {
            return null
        }

        val getter = rvClass.getMethod("getHitSlopRect")

        @Suppress("UNCHECKED_CAST") val rect = getter.invoke(this) as? Rect

        rect
    } catch (e: ClassNotFoundException) {
        null
    } catch (e: NoSuchMethodException) {
        null
    } catch (e: Exception) {
        null
    }
}

fun View.getAriaRole(a11yInfo: AccessibilityNodeInfoCompat): String? {
    val className = a11yInfo.className?.toString() ?: this.javaClass.simpleName
    val roleDescription: String? = a11yInfo.roleDescription?.toString()
    val defaultRole =
            when {
                className.endsWith(".Button") -> "button"
                className.endsWith(".CheckBox") -> "checkbox"
                className.endsWith(".EditText") -> "text field"
                className.endsWith(".ImageView") && this.isClickable -> "image button"
                else -> null
            }

    return roleDescription ?: defaultRole
}

fun View.isTextBold(): Boolean {
    if (this is TextView) {
        val typeface = this.typeface
        return typeface != null && typeface.isBold
    }

    return false
}

fun View.isDisabled(): Boolean {
    val info = AccessibilityNodeInfoCompat.wrap(this.createAccessibilityNodeInfo())

    val disabledByA11y = !info.isEnabled
    val disabledByView = !this.isEnabled

    val hasClickAction = info.isClickable

    val pointerEventsDisabled =
            getRNPointerEvents(this)?.let { it == "NONE" || it == "BOX_NONE" } == true

    val interactionBlocked = (this.isClickable && !hasClickAction) || pointerEventsDisabled

    return disabledByA11y || disabledByView || interactionBlocked
}

private fun getRNPointerEvents(view: View): String? {
    try {
        val cls = Class.forName("com.facebook.react.views.view.ReactViewGroup")
        if (!cls.isInstance(view)) return null
        val m = cls.getMethod("getPointerEvents")
        m.invoke(view)?.toString()
    } catch (_: Throwable) {
        null
    }

    return null
}

