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

        val iconDrawable = object : Drawable() {
            val fillPaint = Paint().apply {
                this.color = color ?: Color.RED
                style = Paint.Style.FILL
                isAntiAlias = true
            }
            val strokePaint = Paint().apply {
                this.color = Color.WHITE
                style = Paint.Style.STROKE
                strokeWidth = 3f
                isAntiAlias = true
            }
            val exclamationPaint = Paint().apply {
                this.color = Color.WHITE
                style = Paint.Style.STROKE
                strokeWidth = 4f
                strokeCap = Paint.Cap.ROUND
                isAntiAlias = true
            }

            override fun draw(canvas: Canvas) {
                val iconSize = 48f
                val centerX = right.toFloat()
                val centerY = top.toFloat()
                
                // Draw warning triangle
                val trianglePath = Path().apply {
                    moveTo(centerX, centerY - iconSize / 2 + 4)
                    lineTo(centerX + iconSize / 2 - 4, centerY + iconSize / 2 - 4)
                    lineTo(centerX - iconSize / 2 + 4, centerY + iconSize / 2 - 4)
                    close()
                }
                
                canvas.drawPath(trianglePath, fillPaint)
                canvas.drawPath(trianglePath, strokePaint)
                
                // Draw exclamation mark
                // Line
                canvas.drawLine(
                    centerX, 
                    centerY - iconSize * 0.15f,
                    centerX,
                    centerY + iconSize * 0.1f,
                    exclamationPaint
                )
                // Dot
                canvas.drawCircle(centerX, centerY + iconSize * 0.25f, 2f, exclamationPaint)
            }

            override fun setAlpha(alpha: Int) {}
            override fun setColorFilter(colorFilter: ColorFilter?) {}
            override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
        }
        
        // We need to set bounds for the icon drawable too, usually view bounds is fine as we draw relative to coordinates
        iconDrawable.setBounds(0, 0, view.width, view.height)
        view.overlay.add(iconDrawable)
    }
}

fun String.toColor(): Int {
    if (this.length == 4 && this.startsWith("#")) {
        val expandedHex = "#" + this[1] + this[1] + this[2] + this[2] + this[3] + this[3]
        return Color.parseColor(expandedHex)
    }
    return Color.parseColor(this)
}
