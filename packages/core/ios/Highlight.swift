import UIKit

/// Helper class to observe when a view is deallocated and trigger cleanup
private class ViewLifecycleObserver {
    weak var view: UIView?
    let viewTag: Int
    weak var highlight: Highlight?
    
    init(view: UIView, highlight: Highlight) {
        self.view = view
        self.viewTag = view.tag
        self.highlight = highlight
    }
    
    deinit {
        // View is being deallocated, clean up the highlight
        highlight?.clearHighlight(viewId: viewTag)
    }
}

/// Simple wrapper that holds a weak reference to a view
private class WeakViewBox {
    weak var view: UIView?
    
    init(_ view: UIView) {
        self.view = view
    }
}

public class Highlight {
    private let stripeOverlayTag = 0xA11
    private let borderLayerName = "ama_border"
    private var stripeOverlays = [Int: UIView]()
    private var borderLayers = [Int: CAShapeLayer]()
    
    /// Maps view tag to a weak reference of the actual view for orphan detection
    private var trackedViews = [Int: WeakViewBox]()

    public init() {}

    public func highlight(view: UIView, mode: String, hexColor: String, gap: CGFloat = 0, lineWidth: CGFloat = 3, issueCount: Int = 1) {
        let color = UIColor(hex: hexColor) ?? .red

        DispatchQueue.main.async {
            // Clean up any orphaned highlights before adding new ones
            self.cleanupOrphanedHighlights()
            
            // Track this view
            self.trackedViews[view.tag] = WeakViewBox(view)
            
            switch mode {
            case "background":
                self.applyStripyBackground(to: view, color: color)
            case "border":
                self.applyBorderOverlay(to: view, color: color, gap: gap, lineWidth: lineWidth, issueCount: issueCount)
            default:
                self.applyBorderOverlay(to: view, color: color, gap: gap, lineWidth: lineWidth, issueCount: issueCount)
                self.applyStripyBackground(to: view, color: color)
            }
        }
    }

    public func clearHighlight(viewId: Int) {
        DispatchQueue.main.async {
            self.trackedViews.removeValue(forKey: viewId)
            self.clearStripeOverlay(viewId: viewId)
            self.clearBorderOverlay(viewId: viewId)
            self.cleanupOrphanedHighlights()
        }
    }
    
    /// Cleans up highlights for views that are no longer in the view hierarchy
    /// This handles the case where a component/screen is unmounted
    public func cleanupOrphanedHighlights() {
        // Find all viewIds where the tracked view is nil (deallocated) or has no window (removed from hierarchy)
        let orphanedViewIds = trackedViews.compactMap { (viewId, box) -> Int? in
            // View is nil (deallocated) or not in any window (removed from hierarchy)
            if box.view == nil || box.view?.window == nil {
                return viewId
            }
            return nil
        }
        
        // Clear highlights for orphaned views
        for viewId in orphanedViewIds {
            trackedViews.removeValue(forKey: viewId)
            clearStripeOverlay(viewId: viewId)
            clearBorderOverlay(viewId: viewId)
        }
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
        trackedViews.removeAll()
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

    private func applyBorderOverlay(to view: UIView, color: UIColor, gap: CGFloat, lineWidth: CGFloat = 3, issueCount: Int = 1) {
        view.layer.sublayers?
            .filter { $0.name == borderLayerName }
            .forEach { $0.removeFromSuperlayer() }

        let stroke: CGFloat = lineWidth
        let border = CAShapeLayer()
        border.name = borderLayerName
        border.frame = view.bounds
        border.lineWidth = stroke
        border.strokeColor = color.cgColor
        border.fillColor = UIColor.clear.cgColor
        
        // Make the border dotted
        let dashLength: NSNumber = NSNumber(value: Double(stroke * 2))
        let gapLength: NSNumber = NSNumber(value: Double(stroke * 2))
        border.lineDashPattern = [dashLength, gapLength]
        
        let inset = (stroke / 2) + gap
        let rect = view.bounds.insetBy(dx: -inset, dy: -inset)
        border.path = UIBezierPath(rect: rect).cgPath
        
        // Create circle badge with issue count
        let badgeSize: CGFloat = 24
        let badgeLayer = CAShapeLayer()
        badgeLayer.frame = CGRect(
            x: rect.maxX - badgeSize / 2,
            y: rect.minY - badgeSize / 2,
            width: badgeSize,
            height: badgeSize
        )
        
        // Draw circle
        let circlePath = UIBezierPath(ovalIn: CGRect(x: 0, y: 0, width: badgeSize, height: badgeSize))
        badgeLayer.path = circlePath.cgPath
        badgeLayer.fillColor = color.cgColor
        
        // Add issue count text
        let textLayer = CATextLayer()
        textLayer.frame = badgeLayer.bounds
        textLayer.string = "\(issueCount)"
        textLayer.fontSize = badgeSize * 0.55
        textLayer.foregroundColor = UIColor.white.cgColor
        textLayer.alignmentMode = .center
        textLayer.contentsScale = UIScreen.main.scale
        
        // Center text vertically
        let font = UIFont.boldSystemFont(ofSize: badgeSize * 0.55)
        let textHeight = font.lineHeight
        textLayer.frame = CGRect(
            x: 0,
            y: (badgeSize - textHeight) / 2,
            width: badgeSize,
            height: textHeight
        )
        
        badgeLayer.addSublayer(textLayer)
        border.addSublayer(badgeLayer)
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
