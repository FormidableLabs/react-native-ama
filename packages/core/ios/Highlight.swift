import UIKit

public class Highlight {
    private let stripeOverlayTag = 0xA11
    private let borderLayerName = "ama_border"
    private var stripeOverlays = [Int: UIView]()
    private var borderLayers = [Int: CAShapeLayer]()

    public init() {}

    public func highlight(view: UIView, mode: String, hexColor: String, gap: CGFloat = 0) {
        let color = UIColor(hex: hexColor) ?? .red

        DispatchQueue.main.async {
            switch mode {
            case "background":
                self.applyStripyBackground(to: view, color: color)
            case "border":
                self.applyBorderOverlay(to: view, color: color, gap: gap)
            default:
                self.applyBorderOverlay(to: view, color: color, gap: gap)
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

    private func applyBorderOverlay(to view: UIView, color: UIColor, gap: CGFloat) {
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
        let inset = (stroke / 2) + gap
        let rect = view.bounds.insetBy(dx: -inset, dy: -inset)
        border.path = UIBezierPath(rect: rect).cgPath
        
        // Create warning triangle icon
        let iconSize: CGFloat = 24
        let iconLayer = CAShapeLayer()
        iconLayer.frame = CGRect(
            x: rect.maxX - iconSize / 2,
            y: rect.minY - iconSize / 2,
            width: iconSize,
            height: iconSize
        )
        
        // Draw warning triangle path
        let trianglePath = UIBezierPath()
        trianglePath.move(to: CGPoint(x: iconSize / 2, y: 2))
        trianglePath.addLine(to: CGPoint(x: iconSize - 2, y: iconSize - 2))
        trianglePath.addLine(to: CGPoint(x: 2, y: iconSize - 2))
        trianglePath.close()
        
        iconLayer.path = trianglePath.cgPath
        iconLayer.fillColor = color.cgColor
        iconLayer.strokeColor = UIColor.white.cgColor
        iconLayer.lineWidth = 1.5
        
        // Add exclamation mark
        let exclamationLayer = CAShapeLayer()
        exclamationLayer.frame = iconLayer.bounds
        
        let exclamationPath = UIBezierPath()
        // Exclamation line
        exclamationPath.move(to: CGPoint(x: iconSize / 2, y: iconSize * 0.35))
        exclamationPath.addLine(to: CGPoint(x: iconSize / 2, y: iconSize * 0.6))
        // Exclamation dot
        exclamationPath.move(to: CGPoint(x: iconSize / 2, y: iconSize * 0.7))
        exclamationPath.addLine(to: CGPoint(x: iconSize / 2, y: iconSize * 0.71))
        
        exclamationLayer.path = exclamationPath.cgPath
        exclamationLayer.strokeColor = UIColor.white.cgColor
        exclamationLayer.lineWidth = 2
        exclamationLayer.lineCap = .round
        
        iconLayer.addSublayer(exclamationLayer)
        border.addSublayer(iconLayer)
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

extension UIColor {
    convenience init?(hex: String) {
      var s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
                   .replacingOccurrences(of: "0x", with: "")
                   .replacingOccurrences(of: "#",  with: "")
                   .uppercased()

      if s.count == 3 || s.count == 4 {
        s = s.map { "\($0)\($0)" }.joined()
      }

      guard s.count == 6 || s.count == 8,
            let value = UInt64(s, radix: 16) else { return nil }

      let r, g, b, a: CGFloat
      if s.count == 6 {
        r = CGFloat((value & 0xFF0000) >> 16) / 255.0
        g = CGFloat((value & 0x00FF00) >> 8)  / 255.0
        b = CGFloat( value & 0x0000FF)        / 255.0
        a = 1.0
      } else {
        r = CGFloat((value & 0xFF000000) >> 24) / 255.0
        g = CGFloat((value & 0x00FF0000) >> 16) / 255.0
        b = CGFloat((value & 0x0000FF00) >> 8)  / 255.0
        a = CGFloat( value & 0x000000FF)        / 255.0
      }

      self.init(red: r, green: g, blue: b, alpha: a)
    }
}
