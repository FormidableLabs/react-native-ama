package expo.modules.ama

import android.app.Activity
import android.graphics.*
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RectShape
import android.view.View
import expo.modules.kotlin.AppContext
import java.util.concurrent.ConcurrentHashMap

val ruleColors: Map<RuleAction, Int> =
        mapOf(
                RuleAction.MUST to Color.RED,
                RuleAction.MUST_NOT to Color.RED,
                RuleAction.SHOULD to Color.YELLOW
        )

class Highlight(private val appContext: AppContext) {
    private val originalBackgrounds = ConcurrentHashMap<Int, Drawable?>()

    /**
     * Highlight the view with the given ID.
     * @param viewId the Android view ID
     * @param mode "background" | "border" | "both"
     */
    fun highlight(viewId: Int, mode: String, action: RuleAction) {
        val activity: Activity = appContext.currentActivity ?: return
        val color = ruleColors[action]

        activity.runOnUiThread {
            val target = activity.findViewById<View>(viewId) ?: return@runOnUiThread

            val view = activity.findViewById<View>(viewId) ?: return@runOnUiThread

            view.background?.let { bg -> originalBackgrounds.putIfAbsent(viewId, bg) }

            when (mode) {
                "background" -> applyStripyBackground(target, color)
                "border" -> applyRedBorderOverlay(target, color)
                else -> {
                    Logger.info("highlight", "3")
                    applyRedBorderOverlay(target, color)
                    Logger.info("highlight", "4")
                    applyStripyBackground(target, color)
                }
            }
        }
    }

    fun clearHighlight(viewId: Int) {
        val activity: Activity = appContext.currentActivity ?: return
        activity.runOnUiThread {
            val view = activity.findViewById<View>(viewId) ?: return@runOnUiThread

            val original = originalBackgrounds.remove(viewId)
            view.background = original

            view.overlay.clear()
        }
    }

    private fun applyStripyBackground(view: View, color: Int?) {
        val originalBackground = view.background

        val stripeWidth = 5f
        val gapWidth = 25f
        val bmpWidth = 150
        val bmpHeight = bmpWidth

        val bmp = Bitmap.createBitmap(bmpWidth, bmpHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)

        val stripePaint =
                Paint().apply {
                    this.color = color ?: Color.RED
                    isAntiAlias = true
                }

        val canvasCenter = bmpWidth / 2f
        canvas.save()
        canvas.rotate(-45f, canvasCenter, canvasCenter)

        val extendedSize = (bmpWidth * 1.5f)
        var y = -extendedSize
        while (y < extendedSize) {
            canvas.drawRect(-extendedSize, y, extendedSize, y + stripeWidth, stripePaint)
            y += stripeWidth + gapWidth
        }

        canvas.restore()

        val shader = BitmapShader(bmp, Shader.TileMode.MIRROR, Shader.TileMode.REPEAT)

        val backgroundPaint = Paint().apply { this.shader = shader }

        val stripedDrawable =
                object : Drawable() {
                    override fun draw(c: Canvas) = c.drawRect(bounds, backgroundPaint)

                    override fun setAlpha(alpha: Int) {
                        backgroundPaint.alpha = alpha
                    }

                    override fun setColorFilter(cf: ColorFilter?) {
                        backgroundPaint.colorFilter = cf
                    }

                    @Deprecated(
                            "Deprecated in Java",
                            ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
                    )
                    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
                }

        if (originalBackground == null) {
            view.background = stripedDrawable
        } else {
            val layers = arrayOf(originalBackground, stripedDrawable)
            view.background = LayerDrawable(layers)
        }
    }

    private fun applyRedBorderOverlay(view: View, color: Int?) {
        view.overlay.clear()

        val stroke = 6f
        val half = (stroke / 2).toInt()
        val shape =
                ShapeDrawable(RectShape()).apply {
                    paint.apply {
                        this.color = color ?: Color.RED
                        style = Paint.Style.STROKE
                        strokeWidth = stroke
                    }
                }

        shape.setBounds(0, 0, view.width - half, view.height - half)
        view.overlay.add(shape)
    }
}
