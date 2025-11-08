import ExpoModulesCore
import UIKit

public struct NodePayload: Equatable {
    let type: String
    let viewId: Int
    let bounds: [Double]?
    let ariaLabel: String?
    let content: String?
    let ariaRole: String?
    let traits: [String]?
    let fg: String?
    let bg: String?
    let fontSize: CGFloat?
    let isBold: Bool?
    let isEnabled: Bool

    func toDictionary() -> [String: Any?] {
        return [
            "type": self.type,
            "viewId": self.viewId,
            "bounds": self.bounds,
            "ariaLabel": self.ariaLabel,
            "content": self.content,
            "ariaRole": self.ariaRole,
            "traits": self.traits,
            "fg": self.fg,
            "bg": self.bg,
            "fontSize": self.fontSize,
            "isBold": self.isBold,
            "isEnabled": self.isEnabled
        ]
    }
}

public class NodesGrabber {
    private let appContext: AppContext
    private var nodesToCheck: [Int: NodePayload] = [:]

    public init(appContext: AppContext) {
        self.appContext = appContext
    }

    public func getNodesToCheck(on rootView: UIView?) -> (nodes: [Int: NodePayload], send: Bool) {
        guard let root = rootView else { return (nodesToCheck, false) }

        nodesToCheck.removeAll()

        traverseAndCheck(view: root)

        return (nodesToCheck, true)
    }

    private func traverseAndCheck(view: UIView) {
        checkView(view)

        if (view.isAccessibilityElement) {
            return
        }

        for subview in view.subviews {
            traverseAndCheck(view: subview)
        }
    }

    private func checkView(_ view: UIView) {
        if view.isPressable {
            let font = view.contentFont

            addNode(
                node: NodePayload(
                    type: "Pressable",
                    viewId: view.tag,
                    bounds: getTargetArea(view),
                    ariaLabel: view.accessibilityLabel,
                    content: view.content,
                    ariaRole: getDefaultAriaRole(view),
                    traits: view.accessibilityTraits.names,
                    fg: view.contentColor?.hexString,
                    bg: view.contentBackgroundColor?.hexString,
                    fontSize: font?.pointSize,
                    isBold: font?.fontDescriptor.symbolicTraits.contains(.traitBold),
                    isEnabled: !view.isDisabled()
                ))
        } else if view.isText(), let info = view.extractRNTextInfo() {
            addNode(
                node: NodePayload(
                    type: "Text",
                    viewId: view.tag,
                    bounds: nil,
                    ariaLabel: view.accessibilityLabel,
                    content: info.text,
                    ariaRole: getDefaultAriaRole(view),
                    traits: view.accessibilityTraits.names,
                    fg: info.fg?.hexString ?? view.contentColor?.hexString,
                    bg: view.textBackgroundColor?.hexString ?? info.bg?.hexString,
                    fontSize: info.font.map { CGFloat($0.pointSize) },
                    isBold: info.font?.fontDescriptor.symbolicTraits.contains(.traitBold),
                    isEnabled: !view.isDisabled()
                )
            )
        }
    }

    private func getDefaultAriaRole(_ view: UIView) -> String? {
        let defaultRole: String? = {
            switch view {
            case is UIButton:
                return "button"
            case is UISwitch:
                return "switch"
            case is UITextField:
                return "text field"
            case let iv as UIImageView where iv.isUserInteractionEnabled:
                return "image button"
            default:
                return nil
            }
        }()

        return defaultRole
    }

    private func getTargetArea(_ view: UIView) -> [Double] {
        let baseSize: CGRect = view.frame
        let insets = view.getHitSlopRect()
        let pressableWidth = baseSize.width - insets.left - insets.right
        let pressableHeight = baseSize.height - insets.top - insets.bottom

        return [pressableWidth, pressableHeight]
    }

    private func addNode(node: NodePayload) {
        guard node.viewId > 0 else { return }

        nodesToCheck[node.viewId] = node
    }
}

private struct RNTextInfo {
    let text: String?
    let fg: UIColor?
    let bg: UIColor?
    let font: UIFont?
}

private func previousSiblingsBackground(
    in parent: UIView, before view: UIView, covering rect: CGRect
) -> UIColor? {
    guard let idx = parent.subviews.firstIndex(of: view) else { return nil }
    if idx == 0 { return nil }

    for i in stride(from: idx - 1, through: 0, by: -1) {
        let sib = parent.subviews[i]
        if sib.isHidden || sib.alpha <= 0.01 { continue }

        // intersect with our area?
        let sibRect = sib.convert(sib.bounds, to: parent)
        if !sibRect.intersects(rect) { continue }

        // direct background on the sibling?
        if let c = ownBackground(of: sib, resolveFor: view) {
            return c
        }
    }
    return nil
}

/// Non-transparent background for a single view (either UIView.backgroundColor or layer.backgroundColor)
private func ownBackground(of v: UIView, resolveFor resolver: UITraitEnvironment) -> UIColor? {
    if let c = v.backgroundColor, c.cgColor.alpha > 0.01 {
        return c.resolvedColor(with: resolver.traitCollection)
    }
    if let cg = v.layer.backgroundColor, cg.alpha > 0.01 {
        return UIColor(cgColor: cg).resolvedColor(with: resolver.traitCollection)
    }
    return nil
}

extension UIView {
    private func findColorIn(view: UIView) -> UIColor? {
        if let imageView = view as? UIImageView, let bgColor = imageView.backgroundColor {
            return bgColor
        }

        if let bgColor = view.backgroundColor, bgColor.cgColor.alpha > 0 {
            return bgColor
        }

        for subview in view.subviews {
            if let color = findColorIn(view: subview) {
                return color
            }
        }

        return nil
    }

    var content: String? {
        let className = String(describing: type(of: self))

        if className.contains("RCTParagraphComponentView") {
            if let attrText = self.value(forKey: "attributedText") as? NSAttributedString {
                return attrText.string
            }
        }

        return subviews.compactMap { $0.content }.first
    }

    var textBackgroundColor: UIColor? {
        var current: UIView? = self

        while let superview = current?.superview {
            for subview in superview.subviews {
                let className = String(describing: type(of: subview))
                if className.contains("_UIBarBackground") {
                    if let color = findColorIn(view: subview) {
                        return color
                    }
                }
            }
            current = superview
        }

        if let parent = self.superview {
            let rectInParent = self.convert(self.bounds, to: parent)
            if let c = previousSiblingsBackground(in: parent, before: self, covering: rectInParent)
            {
                return c
            }
            if let c = ownBackground(of: parent, resolveFor: self) { return c }

            return parent.textBackgroundColor
        }
        return nil
    }

    var contentBackgroundColor: UIColor? {
        var current: UIView? = self

        while let superview = current?.superview {
            for subview in superview.subviews {
                let className = String(describing: type(of: subview))
                if className.contains("_UIBarBackground") {
                    if let color = findColorIn(view: subview) {
                        return color
                    }
                }
            }
            current = superview
        }

        if let bg = self.backgroundColor { return bg }

        var parent = self.superview
        while let p = parent {
            if let bg = p.backgroundColor, bg.cgColor.alpha > 0 {
                return bg
            }
            parent = p.superview
        }

        return nil
    }

    var contentColor: UIColor? {
        let className = String(describing: type(of: self))

        if className.contains("SVG") {
            return nil
        }

        if className.contains("RCTParagraphComponentView"),
            let anyObj = self as AnyObject?,
            let attrText = anyObj.value(forKey: "attributedText") as? NSAttributedString,
            attrText.length > 0,
            let fgColor = attrText.attribute(.foregroundColor, at: 0, effectiveRange: nil)
                as? UIColor
        {
            return fgColor
        }

        if let label = self as? UILabel {
            return label.textColor
        }
        if let button = self as? UIButton {
            if let tc = button.titleColor(for: .normal) { return tc }
            return button.tintColor
        }
        if let iv = self as? UIImageView {
            return iv.tintColor
        }

        for sub in subviews {
            if let cc = sub.contentColor {
                return cc
            }
        }

        return self.tintColor
    }

    var contentFont: UIFont? {
        if let label = self as? UILabel {
            return label.font
        }

        if let button = self as? UIButton,
            let f = button.titleLabel?.font
        {
            return f
        }

        let className = String(describing: type(of: self))

        if className.contains("RCTParagraphComponentView"),
            let anyObj = self as AnyObject?,
            let attrText = anyObj.value(forKey: "attributedText") as? NSAttributedString,
            attrText.length > 0,
            let font = attrText.attribute(.font, at: 0, effectiveRange: nil) as? UIFont
        {
            return font
        }

        for sub in subviews {
            if let f = sub.contentFont {
                return f
            }
        }

        return nil
    }

    fileprivate func getHitSlopRect() -> UIEdgeInsets {
        let selector = NSSelectorFromString("hitTestEdgeInsets")

        guard self.responds(to: selector) else {
            return .zero
        }

        let anyObj = self as AnyObject
        guard
            let edgeValue = anyObj.value(forKey: "hitTestEdgeInsets") as? UIEdgeInsets
        else {
            return .zero
        }

        return edgeValue
    }

    /**
     * Returns true if the user can tap on the element
     */
    var isPressable: Bool {
        return isUserInteractionEnabled && isAccessibilityElement
    }

    func isDisabled() -> Bool {
        if accessibilityTraits.contains(.notEnabled) { return true }

        if let control = self as? UIControl, control.isEnabled == false { return true }

        if hasActivationRole && (isHidden || alpha <= 0.01 || isUserInteractionEnabled == false) {
            return true
        }

        return false
    }

    private var hasActivationRole: Bool {
        let t = accessibilityTraits
        if t.contains(.button) || t.contains(.link) { return true }
        if responds(to: NSSelectorFromString("accessibilityActivate")) { return true }
        if let actions = accessibilityCustomActions, !actions.isEmpty { return true }

        return false
    }

    func isText() -> Bool {
        let names = [
            "RCTParagraphComponentView",
            "RCTParagraphTextView",
            "RCTTextView",
            "RCTText",
        ]
        for name in names {
            if let cls = NSClassFromString(name), self.isKind(of: cls) { return true }
        }

        return self.responds(to: NSSelectorFromString("attributedText"))
    }

    fileprivate func extractRNTextInfo() -> RNTextInfo? {
        let sel = NSSelectorFromString("attributedText")

        guard self.responds(to: sel),
            let obj = self as AnyObject?,
            let attr = obj.value(forKey: "attributedText") as? NSAttributedString,
            attr.length > 0
        else { return nil }

        let fg = attr.attribute(.foregroundColor, at: 0, effectiveRange: nil) as? UIColor
        let bg =
            (attr.attribute(.backgroundColor, at: 0, effectiveRange: nil) as? UIColor)
            ?? (attr.attribute(
                NSAttributedString.Key("NSBackgroundColor"), at: 0, effectiveRange: nil) as? UIColor)

        let font = attr.attribute(.font, at: 0, effectiveRange: nil) as? UIFont

        return RNTextInfo(text: attr.string, fg: fg, bg: bg, font: font)
    }
}

extension UIAccessibilityTraits {
    fileprivate var names: [String] {
        let all: [(UIAccessibilityTraits, String)] = [
            (.button, "button"),
            (.link, "link"),
            (.header, "header"),
            (.searchField, "searchField"),
            (.image, "image"),
            (.selected, "selected"),
            (.playsSound, "playsSound"),
            (.keyboardKey, "keyboardKey"),
            (.staticText, "staticText"),
            (.summaryElement, "summaryElement"),
            (.notEnabled, "notEnabled"),
            (.updatesFrequently, "updatesFrequently"),
            (.startsMediaSession, "startsMediaSession"),
            (.adjustable, "adjustable"),
            (.allowsDirectInteraction, "allowsDirectInteraction"),
            (.causesPageTurn, "causesPageTurn"),
        ]
        return all.compactMap { (trait, name) in
            (self.rawValue & trait.rawValue) != 0 ? name : nil
        }
    }
}

extension UIColor {
    var rgbaComponents: (r: CGFloat, g: CGFloat, b: CGFloat, a: CGFloat)? {
        var r: CGFloat = 0
        var g: CGFloat = 0
        var b: CGFloat = 0
        var a: CGFloat = 0
        guard self.getRed(&r, green: &g, blue: &b, alpha: &a) else { return nil }
        return (r, g, b, a)
    }

    var rgbaString: String {
        guard let c = rgbaComponents else { return self.description }
        let R = Int(c.r * 255)
        let G = Int(c.g * 255)
        let B = Int(c.b * 255)
        return String(format: "rgba(%d,%d,%d,%.2f)", R, G, B, c.a)
    }

    var hexString: String {
        guard let c = rgbaComponents else { return self.description }
        let R = Int(c.r * 255)
        let G = Int(c.g * 255)
        let B = Int(c.b * 255)
        return String(format: "#%02X%02X%02X", R, G, B)
    }
}
