package expo.modules.ama

import android.graphics.Rect
import android.graphics.drawable.ColorDrawable
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
        val isBold: Boolean?
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
                "isBold" to this.isBold
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
                                    isBold = view.isTextBold()
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

fun View.getTextColor(): String? {
    if (this is TextView) {
        return this.currentTextColor.toHex()
    }

    if (this is ViewGroup) {
        for (i in 0 until this.childCount) {
            val childView = this.getChildAt(i)
            val textColor = childView.getTextColor()

            if (textColor != null) {
                return textColor
            }
        }
    }

    return null
}

fun View.getBackgroundColor(): String? {
    val background = this.background
    if (background is ColorDrawable) {
        return background.color.toHex()
    }

    var parent = this.parent
    while (parent is View) {
        val parentView = parent as View
        val parentBackground = parentView.background

        if (parentBackground is ColorDrawable) {
            return parentBackground.color.toHex()
        }

        parent = parentView.parent
    }

    return null
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
