import UIKit

private let ruleColors: [RuleAction: UIColor] = [
    .must: .red,
    .mustNot: .red,
    .should: .yellow,
]

public class Highlight {
    private let stripeOverlayTag = 0xA11
    private let borderLayerName = "ama_border"
    private var stripeOverlays = [Int: UIView]()
    private var borderLayers = [Int: CAShapeLayer]()

    public init() {}

    public func highlight(view: UIView, mode: String, action: RuleAction) {
        let color = ruleColors[action] ?? .red

        DispatchQueue.main.async {
            switch mode {
            case "background":
                self.applyStripyBackground(to: view, color: color)
            case "border":
                self.applyBorderOverlay(to: view, color: color)
            default:
                self.applyBorderOverlay(to: view, color: color)
                self.applyStripyBackground(to: view, color: color)
            }
        }
    }

    public func clearHighlight(viewId: Int) {
        clearStripeOverlay(viewId: viewId)
        clearBorderOverlay(viewId: viewId)
    }

    private func clearStripeOverlay(viewId: Int) {
        if let overlay = stripeOverlays.removeValue(forKey: viewId) {
            overlay.removeFromSuperview()
        }
    }

    private func clearBorderOverlay(viewId: Int) {
        if let border = borderLayers.removeValue(forKey: viewId) {
            border.removeFromSuperlayer()
        }
    }

    /// Call this when you know the screen is going away
    public func clearAll() {
        stripeOverlays.values.forEach { $0.removeFromSuperview() }
        borderLayers.values.forEach { $0.removeFromSuperlayer() }
        stripeOverlays.removeAll()
        borderLayers.removeAll()
    }

    public func clearHighlight2(viewId: Int) {
        guard let root = UIApplication.shared.keyWindow,
            let target = root.viewWithTag(viewId)
        else { return }

        target.viewWithTag(stripeOverlayTag)?.removeFromSuperview()

        target.layer.sublayers?
            .filter { $0.name == borderLayerName }
            .forEach { $0.removeFromSuperlayer() }
    }

    private func applyStripyBackground(to view: UIView, color: UIColor) {
        view.viewWithTag(stripeOverlayTag)?.removeFromSuperview()

        let stripeImage = makeStripyPatternImage(color: color)
        let overlay = UIView(frame: view.bounds)
        overlay.tag = stripeOverlayTag
        overlay.isUserInteractionEnabled = false
        overlay.backgroundColor = UIColor(patternImage: stripeImage)
        overlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(overlay)

        stripeOverlays[view.tag] = overlay
    }

    private func applyBorderOverlay(to view: UIView, color: UIColor) {
        view.layer.sublayers?
            .filter { $0.name == borderLayerName }
            .forEach { $0.removeFromSuperlayer() }

        let stroke: CGFloat = 3
        let border = CAShapeLayer()
        border.name = borderLayerName
        border.frame = view.bounds
        border.lineWidth = stroke
        border.strokeColor = color.cgColor
        border.fillColor = UIColor.clear.cgColor
        let inset = stroke / 2
        let rect = view.bounds.insetBy(dx: inset, dy: inset)
        border.path = UIBezierPath(rect: rect).cgPath
        view.layer.addSublayer(border)

        borderLayers[view.tag] = border
    }

    func makeStripyPatternImage(
        stripeWidth: CGFloat = 2,
        gapWidth: CGFloat = 10,
        tileSize: CGFloat = 150,
        color: UIColor = .red
    ) -> UIImage {
        let size = CGSize(width: tileSize, height: tileSize)
        let extended = tileSize * 1.5

        let base = UIGraphicsImageRenderer(size: size).image { ctx in
            let c = ctx.cgContext
            c.setFillColor(color.cgColor)

            c.translateBy(x: size.width / 2, y: size.height / 2)
            c.rotate(by: -.pi / 4)
            c.translateBy(x: -size.width / 2, y: -size.height / 2)

            var y: CGFloat = -extended
            while y < extended {
                c.fill(
                    CGRect(
                        x: -extended,
                        y: y,
                        width: extended * 2,
                        height: stripeWidth))
                y += stripeWidth + gapWidth
            }
        }

        return base.resizableImage(withCapInsets: .zero, resizingMode: .tile)
    }
}
