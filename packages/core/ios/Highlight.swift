import UIKit

private let ruleColors: [RuleAction: UIColor] = [
  .must:    .red,
  .mustNot: .red,
  .should:  .yellow
]

public class Highlight {
  // Unique tag to identify/remove stripe views
  private let stripeOverlayTag = 0xA11
  // Layer name to identify/remove border layers
  private let borderLayerName  = "ama_border"

  public init() {}

  /// mode = "background" | "border" | "both"
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

  private func applyStripyBackground(to view: UIView, color: UIColor) {
    // remove old overlay
    view.viewWithTag(stripeOverlayTag)?.removeFromSuperview()

    // make a repeating stripe image
    let stripeImage = makeStripePatternImage(color: color)
    // overlay it as a UIView so gaps let the original background show
    let overlay = UIView(frame: view.bounds)
    overlay.tag = stripeOverlayTag
    overlay.isUserInteractionEnabled = false
    overlay.backgroundColor = UIColor(patternImage: stripeImage)
    overlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    view.addSubview(overlay)
  }

  private func applyBorderOverlay(to view: UIView, color: UIColor) {
    // remove any existing border
    view.layer.sublayers?
      .filter { $0.name == borderLayerName }
      .forEach { $0.removeFromSuperlayer() }

    let stroke: CGFloat = 6
    let border = CAShapeLayer()
    border.name       = borderLayerName
    border.frame      = view.bounds
    border.lineWidth  = stroke
    border.strokeColor = color.cgColor
    border.fillColor  = UIColor.clear.cgColor
    let inset = stroke / 2
    let rect = view.bounds.insetBy(dx: inset, dy: inset)
    border.path = UIBezierPath(rect: rect).cgPath
    view.layer.addSublayer(border)
  }

  private func makeStripePatternImage(color: UIColor) -> UIImage {
    let stripeWidth: CGFloat = 25
    let gapWidth:    CGFloat = 25
    let bmpSize:     CGFloat = 150
    let size = CGSize(width: bmpSize, height: bmpSize * 2)

    let renderer = UIGraphicsImageRenderer(size: size)
    let img = renderer.image { ctx in
      let cgctx = ctx.cgContext
      // rotate canvas by –45°
      cgctx.translateBy(x: size.width/2, y: size.height/2)
      cgctx.rotate(by: -.pi/4)
      cgctx.translateBy(x: -size.width/2, y: -size.height/2)

      cgctx.setFillColor(color.cgColor)
      var y: CGFloat = -size.height
      while y < size.height {
        cgctx.fill(CGRect(x: -size.width,
                          y: y,
                          width: size.width * 3,
                          height: stripeWidth))
        y += stripeWidth + gapWidth
      }
    }
    // make it tile seamlessly
    return img.resizableImage(withCapInsets: .zero, resizingMode: .tile)
  }
}

