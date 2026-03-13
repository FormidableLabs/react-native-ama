package expo.modules.ama

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Rect
import android.graphics.drawable.*
import android.graphics.drawable.ColorDrawable
import android.os.Build
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
        val isEnabled: Boolean?,
        val isAccessible: Boolean? = null
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
                "isEnabled" to this.isEnabled,
                "isAccessible" to this.isAccessible
        )
    }
}

enum class NodeType {
    Pressable,
    Text,
    TextInput
}

class NodesGrabber(private val appContext: AppContext) {
    val activity = appContext.activityProvider?.currentActivity

    private var nodesToCheck = mutableMapOf<Int, NodePayload>()
    private lateinit var rootView: View

    fun getNodesToCheck(rootView: View): Map<Int, Any?> {
        this.rootView = rootView

        nodesToCheck.clear()

        rootView.let { root -> traverseAndCheck(root) }

        return nodesToCheck.mapValues { it.value.toMap() }
    }

    private fun traverseAndCheck(view: View) {
        val className = view.javaClass.name

        // Ignores the debug overlay
        if (className.startsWith("com.facebook.react.views.debuggingoverlay")) {
            return
        }

        if (view.hidesAccessibilityDescendants()) {
            return
        }

        val info = view.createAccessibilityNodeInfo()
        val a11yInfo = AccessibilityNodeInfoCompat.wrap(info)

        checkView(view, a11yInfo)

        if (view.isPressable(a11yInfo)) {
            return
        }

        if (view is ViewGroup) {
            for (i in 0 until view.childCount) {
                traverseAndCheck(view.getChildAt(i))
            }
        }
    }

    private fun addNode(node: NodePayload) {
        if (node.viewId <= 0) {
            return
        }

        nodesToCheck[node.viewId] = node
    }

    private fun checkView(view: View, a11yInfo: AccessibilityNodeInfoCompat) {
        val isPressable = view.isPressable(a11yInfo)
        val isTextLike = view.isTextLike()

        if (!isPressable && !isTextLike) {
            return
        }

        val ariaRole = view.getAriaRole(a11yInfo)
        val nodeType = view.getNodeType(
                a11yInfo = a11yInfo,
                ariaRole = ariaRole,
                isPressable = isPressable,
                isTextLike = isTextLike
        )
        val textInfo = if (nodeType != NodeType.Pressable) view.extractRNTextInfo() else null
        val isAccessible =
                if (nodeType == NodeType.Pressable) {
                    null
                } else {
                    !view.hidesAccessibilityDescendants() && a11yInfo.isVisibleToUser
                }

        addNode(
                NodePayload(
                        type = nodeType.name,
                        viewId = view.id,
                        bounds = getTargetArea(view),
                        ariaLabel = a11yInfo.contentDescription?.toString(),
                        content =
                                if (nodeType == NodeType.Pressable) {
                                    view.getTextOrContent()
                                } else {
                                    textInfo?.text.orEmpty()
                                },
                        ariaRole = ariaRole,
                        fg = if (nodeType == NodeType.Pressable) view.getTextColorHex() else textInfo?.fg,
                        bg = if (nodeType == NodeType.Pressable) view.getBackgroundColorHex() else textInfo?.bg,
                        fontSize =
                                if (nodeType == NodeType.Pressable) {
                                    view.getFontSize()
                                } else {
                                    textInfo?.fontSizeSp
                                },
                        isBold =
                                if (nodeType == NodeType.Pressable) {
                                    view.isTextBold()
                                } else {
                                    textInfo?.isBold == true
                                },
                        isEnabled = if (nodeType == NodeType.Pressable) !view.isDisabled() else view.isEnabled,
                        isAccessible = isAccessible
                )
        )
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

private fun View.getNodeType(
        a11yInfo: AccessibilityNodeInfoCompat,
        ariaRole: String?,
        isPressable: Boolean,
        isTextLike: Boolean
): NodeType {
    if (isTextInput(a11yInfo, ariaRole)) {
        return NodeType.TextInput
    }

    if (isPressable) {
        return NodeType.Pressable
    }

    if (isTextLike) {
        return NodeType.Text
    }

    throw IllegalStateException("Unsupported node type for viewId=$id")
}

private fun View.isTextInput(
        a11yInfo: AccessibilityNodeInfoCompat,
        ariaRole: String?
): Boolean {
    val normalizedRole = ariaRole?.trim()?.lowercase()
    val className = a11yInfo.className?.toString() ?: javaClass.name

    return normalizedRole == "text input" ||
            normalizedRole == "text field" ||
            this is android.widget.EditText ||
            className.endsWith(".EditText") ||
            className.endsWith("ReactEditText")
}

private fun View.hidesAccessibilityDescendants(): Boolean {
    return importantForAccessibility == View.IMPORTANT_FOR_ACCESSIBILITY_NO ||
            importantForAccessibility == View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
}

fun View.isPressable(a11yInfo: AccessibilityNodeInfoCompat): Boolean {
    return this.isClickable && this.isAccessible(a11yInfo)
}

fun View.isAccessible(a11yInfo: AccessibilityNodeInfoCompat): Boolean {
    if (this.hidesAccessibilityDescendants() || !a11yInfo.isVisibleToUser) {
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

fun View.getTextColorHex(): String? = getTextColor()?.toHex()

fun View.getTextColor(): Int? {
    return when (this) {
        is TextView -> extractColorFromTextView(this)
        is ViewGroup -> {
            for (i in 0 until childCount) {
                getChildAt(i).getTextColor()?.let {
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

fun View.getBackgroundColorHex(): String? = getBackgroundColor()?.toHex()

fun View.getBackgroundColor(): Int? {
    extractSolidColor(background)?.let {
        return it
    }

    /**
     * <View bgcolor="xxx">
     *     <Text>Text goes here</Text>
     * </View>
     *
     * Becomes:
     *
     * Container:
     *    ReactViewGroup <-- This has the bg colour
     *    ReactTextView
     */
    var p = parent
    val vg = (parent as? ViewGroup)
    vg?.let {
        if (it.childCount > 0 && it.getChildAt(0) is ViewGroup) {
            extractSolidColor(it.getChildAt(0).background)?.let {
                return it
            }
        }
    }

    while (p is View) {
        extractSolidColor(p.background)?.let {
            return it
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
    if (a11yInfo.isHeading) return "header"
    if (a11yInfo.collectionItemInfo?.isHeading == true) return "header"
    if (Build.VERSION.SDK_INT >= 28 && this is TextView && this.isAccessibilityHeading) return "header"

    val roleDescription: String? = a11yInfo.roleDescription?.toString()
    val className = a11yInfo.className?.toString() ?: this.javaClass.name
    val defaultRole = when {
        className.endsWith(".Button") -> "button"
        className.endsWith(".CheckBox") -> "checkbox"
        className.endsWith(".Switch") -> "switch"
        className.endsWith(".EditText") -> "text field"
        className.endsWith(".ImageView") && isClickable -> "image button"
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

data class TextInfo(
        val text: String,
        val fg: String?,
        val bg: String?,
        val fontSizeSp: Float?,
        val isBold: Boolean
)

fun View.isTextLike(): Boolean {
    // Common Android + RN text classes
    val candidateClassNames =
            listOf(
                    "android.widget.TextView",
                    "androidx.appcompat.widget.AppCompatTextView",
                    "com.google.android.material.textview.MaterialTextView",
                    "com.facebook.react.views.text.ReactTextView",
                    "com.facebook.react.views.text.ReactVirtualTextView",
                    "com.facebook.react.views.textinput.ReactEditText"
            )
    // 1) class match
    for (name in candidateClassNames) {
        runCatching { Class.forName(name) }.getOrNull()?.let { cls ->
            if (cls.isInstance(this)) return true
        }
    }
    // 2) “duck typing”: has a getText(): CharSequence?
    return this.javaClass.methods.any { m ->
        m.name == "getText" &&
                m.parameterCount == 0 &&
                (m.returnType == CharSequence::class.java ||
                        CharSequence::class.java.isAssignableFrom(m.returnType))
    }
}

fun View.extractRNTextInfo(): TextInfo? {
    if (this is android.widget.TextView) {
        val density = resources.displayMetrics.scaledDensity
        val fg = getTextColorHex()
        val bg = getBackgroundColorHex()
        val isBold = typeface?.isBold == true
        val sp = textSize / density // textSize is px

        return TextInfo(
                text = text?.toString().orEmpty(),
                fg = fg,
                bg = bg,
                fontSizeSp = sp,
                isBold = isBold
        )
    }

    if (this is ViewGroup) {
        for (i in 0 until childCount) {
            val t = getChildAt(i).extractRNTextInfo()
            if (t != null) return t
        }
    }

    val txt =
            runCatching { this.javaClass.getMethod("getText").invoke(this) as? CharSequence }
                    .getOrNull()
    return txt?.let {
        TextInfo(
                text = it.toString(),
                fg = getTextColorHex(),
                bg = getBackgroundColorHex(),
                fontSizeSp = null,
                isBold = false
        )
    }
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
