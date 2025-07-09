package expo.modules.ama

import android.app.Activity
import android.graphics.*
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RectShape
import android.view.View
import expo.modules.kotlin.AppContext

val ruleColors: Map<RuleAction, Int> =
        mapOf(
                RuleAction.MUST to Color.RED,
                RuleAction.MUST_NOT to Color.RED,
                RuleAction.SHOULD to Color.YELLOW
        )

class Highlight(private val appContext: AppContext) {
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

            when (mode) {
                "background" -> applyStripyBackground(target, color)
                "border" -> applyRedBorderOverlay(target, color)
                else -> {
                    applyRedBorderOverlay(target, color)
                    applyStripyBackground(target, color)
                }
            }
        }
    }

    private fun applyGridBackground(view: View, color: Int?) {
        val stripeSize = 40
        val bmp = Bitmap.createBitmap(stripeSize * 2, stripeSize * 2, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        val paint =
                Paint().apply {
                    style = Paint.Style.FILL
                }
        canvas.drawRect(0f, 0f, stripeSize.toFloat(), stripeSize.toFloat(), paint)
        canvas.drawRect(
                stripeSize.toFloat(),
                stripeSize.toFloat(),
                stripeSize * 2f,
                stripeSize * 2f,
                paint
        )

        val shader = BitmapShader(bmp, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
        val bgPaint = Paint().apply { this.shader = shader }
        val drawable =
                object : Drawable() {
                    override fun draw(c: Canvas) = c.drawRect(bounds, bgPaint)
                    override fun setAlpha(alpha: Int) {
                        bgPaint.alpha = alpha
                    }
                    override fun setColorFilter(cf: ColorFilter?) {
                        bgPaint.colorFilter = cf
                    }
                    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
                }

        view.background = drawable
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
