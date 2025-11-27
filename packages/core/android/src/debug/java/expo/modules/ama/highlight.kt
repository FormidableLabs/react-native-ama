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

class Highlight(private val appContext: AppContext) {
    private val originalBackgrounds = ConcurrentHashMap<Int, Drawable?>()

    /**
     * Highlight the view with the given ID.
     * @param viewId the Android view ID
     * @param mode "background" | "border" | "both"
     */
    fun highlight(viewId: Int, mode: String, hexColor: String, gap: Int = 0) {
        val activity: Activity = appContext.currentActivity ?: return
        val color = hexColor.toColor()

        activity.runOnUiThread {
            val target = activity.findViewById<View>(viewId) ?: return@runOnUiThread

            val view = activity.findViewById<View>(viewId) ?: return@runOnUiThread

            view.background?.let { bg -> originalBackgrounds.putIfAbsent(viewId, bg) }

            when (mode) {
                "background" -> applyStripyBackground(target, color)
                "border" -> applyRedBorderOverlay(target, color, gap)
                else -> {
                    applyRedBorderOverlay(target, color, gap)
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

    private fun applyRedBorderOverlay(view: View, color: Int?, gap: Int) {
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

        val left = -gap
        val top = -gap
        val right = view.width - half + gap
        val bottom = view.height - half + gap

        shape.setBounds(left, top, right, bottom)
        view.overlay.add(shape)

        val textDrawable = object : Drawable() {
            val textPaint = Paint().apply {
                this.color = Color.BLACK // Emoji color might be handled by text rendering, but let's set a base
                textSize = 40f
                isAntiAlias = true
                textAlign = Paint.Align.CENTER
            }
            val text = "⚠️"

            override fun draw(canvas: Canvas) {
                // Position at top right
                // The bounds of this drawable will be the same as the view's overlay bounds (which are the view's bounds)
                // But we want to position relative to the border we just drew.
                // The border top-right is at (right, top)
                canvas.drawText(text, right.toFloat(), top.toFloat(), textPaint)
            }

            override fun setAlpha(alpha: Int) {}
            override fun setColorFilter(colorFilter: ColorFilter?) {}
            override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
        }
        
        // We need to set bounds for the text drawable too, usually view bounds is fine as we draw relative to coordinates
        textDrawable.setBounds(0, 0, view.width, view.height)
        view.overlay.add(textDrawable)
    }
}

fun String.toColor(): Int {
    if (this.length == 4 && this.startsWith("#")) {
        val expandedHex = "#" + this[1] + this[1] + this[2] + this[2] + this[3] + this[3]
        return Color.parseColor(expandedHex)
    }
    return Color.parseColor(this)
}
