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
    let returnType: Int?
    let isAccessible: Bool?

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
            "isEnabled": self.isEnabled,
            "returnType": self.returnType,
            "isAccessible": self.isAccessible
        ]
    }
}

public class NodesGrabber {
    private let appContext: AppContext
    private var nodesToCheck: [Int: NodePayload] = [:]

    public init(appContext: AppContext) {
        self.appContext = appContext
    }

    public func getNodesToCheck(on rootView: UIView?) -> (
        nodes: [Int: NodePayload], send: Bool
    ) {
        guard let root = rootView else { return (nodesToCheck, false) }

        let previous = nodesToCheck

        nodesToCheck.removeAll()

        traverseAndCheck(view: root)

        let changed = previous != nodesToCheck

        return (nodesToCheck, changed)
    }

    private func traverseAndCheck(view: UIView) {
        checkView(view)

        if view.isAccessibilityElement {
            return
        }

        for subview in view.subviews {
            traverseAndCheck(view: subview)
        }
    }

    private func checkView(_ view: UIView) {
        let supported = view.isPressable || view.isText() || view.isTextInput() || view.isModal()

        if !supported {
            return
        }

        var font = view.contentFont
        var tag = view.tag
        var accessibilityLabel = view.accessibilityLabel
        let info = view.extractRNTextInfo()

        if info?.font != nil {
            font = info?.font
        }

        if view.isTextInput() {
            tag = view.superview?.tag ?? 0
            accessibilityLabel = view.superview?.accessibilityLabel
        }

        addNode(
            node: NodePayload(
                type: view.getType(),
                viewId: tag,
                bounds: view.getTargetArea(),
                ariaLabel: accessibilityLabel,
                content: info?.text ?? view.content,
                ariaRole: getDefaultAriaRole(view),
                traits: view.accessibilityTraits.names,
                fg: info?.fg?.hexString ?? view.contentColor?.hexString,
                bg: view.getBackground(info),
                fontSize: font?.pointSize,
                isBold: font?.fontDescriptor.symbolicTraits.contains(
                    .traitBold
                ),
                isEnabled: !view.isDisabled(),
                returnType: view.getReturnKeyType(),
                isAccessible: view.isText() ? !view.accessibilityElementsHidden : nil
            )
        )
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
    in parent: UIView,
    before view: UIView,
    covering rect: CGRect
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
private func ownBackground(
    of v: UIView,
    resolveFor resolver: UITraitEnvironment
) -> UIColor? {
    if let c = v.backgroundColor, c.cgColor.alpha > 0.01 {
        return c.resolvedColor(with: resolver.traitCollection)
    }
    if let cg = v.layer.backgroundColor, cg.alpha > 0.01 {
        return UIColor(cgColor: cg).resolvedColor(
            with: resolver.traitCollection
        )
    }
    return nil
}

extension UIView {
    struct A11yStates {
        let isExpanded: Bool
        let isDisabled: Bool
        let isSelected: Bool
    }

    func getType() -> String {
        if isTextInput() {
            return "TextInput"
        }

        if isPressable {
            return "Pressable"
        }

        if isText() {
            return "Text"
        }

        return ""
    }

    func getTargetArea() -> [Double]? {
        if !isPressable {
            return nil
        }

        let baseSize: CGRect = self.frame
        let insets = self.getHitSlopRect()
        let pressableWidth = baseSize.width - insets.left - insets.right
        let pressableHeight = baseSize.height - insets.top - insets.bottom

        return [pressableWidth, pressableHeight]
    }

    private func findColorIn(view: UIView) -> UIColor? {
        if let imageView = view as? UIImageView,
            let bgColor = imageView.backgroundColor
        {
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
            if let attrText = self.value(forKey: "attributedText")
                as? NSAttributedString
            {
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
            if let c = previousSiblingsBackground(
                in: parent,
                before: self,
                covering: rectInParent
            ) {
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
            let attrText = anyObj.value(forKey: "attributedText")
                as? NSAttributedString,
            attrText.length > 0,
            let fgColor = attrText.attribute(
                .foregroundColor,
                at: 0,
                effectiveRange: nil
            )
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
            let attrText = anyObj.value(forKey: "attributedText")
                as? NSAttributedString,
            attrText.length > 0,
            let font = attrText.attribute(.font, at: 0, effectiveRange: nil)
                as? UIFont
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
            let edgeValue = anyObj.value(forKey: "hitTestEdgeInsets")
                as? UIEdgeInsets
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

        if let control = self as? UIControl, control.isEnabled == false {
            return true
        }

        if hasActivationRole
            && (isHidden || alpha <= 0.01 || isUserInteractionEnabled == false)
        {
            return true
        }

        return false
    }

    private var hasActivationRole: Bool {
        let t = accessibilityTraits
        if t.contains(.button) || t.contains(.link) { return true }
        if responds(to: NSSelectorFromString("accessibilityActivate")) {
            return true
        }
        if let actions = accessibilityCustomActions, !actions.isEmpty {
            return true
        }

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
            if let cls = NSClassFromString(name), self.isKind(of: cls) {
                return true
            }
        }

        return self.responds(to: NSSelectorFromString("attributedText"))
    }

    func isTextInput() -> Bool {
        if self is UITextField || self is UITextView {
            return true
        }

        return false
    }

    fileprivate func extractRNTextInfo() -> RNTextInfo? {
        if !isText() {
            return nil
        }

        let sel = NSSelectorFromString("attributedText")

        guard self.responds(to: sel),
            let obj = self as AnyObject?,
            let attr = obj.value(forKey: "attributedText")
                as? NSAttributedString,
            attr.length > 0
        else { return nil }

        let fg =
            attr.attribute(.foregroundColor, at: 0, effectiveRange: nil)
            as? UIColor
        let bg =
            (attr.attribute(.backgroundColor, at: 0, effectiveRange: nil)
                as? UIColor)
            ?? (attr.attribute(
                NSAttributedString.Key("NSBackgroundColor"),
                at: 0,
                effectiveRange: nil
            ) as? UIColor)

        let font = attr.attribute(.font, at: 0, effectiveRange: nil) as? UIFont

        return RNTextInfo(text: attr.string, fg: fg, bg: bg, font: font)
    }

    func isBusy() -> Bool {
        if matchesBusyToken(accessibilityValue) { return true }
        if matchesBusyToken(accessibilityLabel) { return true }
        if matchesBusyToken(accessibilityHint) { return true }

        if let spinner = self as? UIActivityIndicatorView,
            !isHidden, alpha > 0.01, spinner.isAnimating
        {
            return true
        }

        return false
    }

    private func matchesBusyToken(_ s: String?) -> Bool {
        guard let s = s, !s.isEmpty else { return false }

        if let rnBusy = localizedStringIfExists(key: "state_busy_description") {
            if s.range(
                of: rnBusy,
                options: [.caseInsensitive, .diacriticInsensitive]
            ) != nil {
                return true
            }
        }

        let fallbacks = ["busy", "loading", "in progress"]
        return fallbacks.contains { token in
            s.range(
                of: token,
                options: [.caseInsensitive, .diacriticInsensitive]
            ) != nil
        }
    }

    private func localizedStringIfExists(key: String, table: String? = nil)
        -> String?
    {
        // Check main bundle first (RN often merges strings here)
        let main = NSLocalizedString(
            key,
            tableName: table,
            bundle: .main,
            value: key,
            comment: ""
        )
        if main != key { return main }

        for b in Bundle.allBundles where b != .main {
            let v = NSLocalizedString(
                key,
                tableName: table,
                bundle: b,
                value: key,
                comment: ""
            )
            if v != key { return v }
        }
        return nil
    }

    func a11yStates() -> A11yStates {
        let disabledByTrait = accessibilityTraits.contains(.notEnabled)
        let disabledByControl = (self as? UIControl)?.isEnabled == false
        let interactionBlocked =
            isHidden || alpha <= 0.01 || isUserInteractionEnabled == false
        let isDisabled =
            disabledByTrait || disabledByControl || interactionBlocked

        let selectedByTrait = accessibilityTraits.contains(.selected)
        let selectedByControl = (self as? UIControl)?.isSelected == true
        let isSelected = selectedByTrait || selectedByControl

        let haystacks = [
            accessibilityValue?.lowercased(),
            accessibilityLabel?.lowercased(),
            accessibilityHint?.lowercased(),
        ].compactMap { $0 }

        let expandedTokens = rnLocalizedTokens(
            key: "state_expanded_description",
            fallbacks: ["expanded"]
        )
        let collapsedTokens = rnLocalizedTokens(
            key: "state_collapsed_description",
            fallbacks: ["collapsed"]
        )

        let isExpanded: Bool? = {
            if haystacks.contains(where: { s in
                expandedTokens.contains(where: { s.contains($0) })
            }) {
                return true
            }
            if haystacks.contains(where: { s in
                collapsedTokens.contains(where: { s.contains($0) })
            }) {
                return false
            }
            return nil  // unknown
        }()

        return A11yStates(
            isExpanded: isExpanded ?? false,
            isDisabled: isDisabled,
            isSelected: isSelected
        )
    }

    private func rnLocalizedTokens(key: String, fallbacks: [String]) -> [String]
    {
        var out = [String]()
        let vMain = NSLocalizedString(
            key,
            tableName: nil,
            bundle: .main,
            value: key,
            comment: ""
        )
        if vMain != key { out.append(vMain.lowercased()) }

        for b in Bundle.allBundles where b != .main {
            let v = NSLocalizedString(
                key,
                tableName: nil,
                bundle: b,
                value: key,
                comment: ""
            )
            if v != key { out.append(v.lowercased()) }
        }
        return (out + fallbacks.map { $0.lowercased() }).uniqued()
    }

    func getReturnKeyType() -> Int? {
        if !isTextInput() {
            return nil
        }

        if let field = self as? UITextField {
            return field.returnKeyType.rawValue
        }

        if let view = self as? UITextView {
            return view.returnKeyType.rawValue
        }

        return nil
    }

    fileprivate func getBackground(_ info: RNTextInfo?) -> String? {
        if isText() {
            return self.textBackgroundColor?.hexString ?? info?.bg?.hexString
        }

        return self.contentBackgroundColor?.hexString
    }
}

extension Array where Element: Hashable {
    fileprivate func uniqued() -> [Element] {
        var seen = Set<Element>()
        return filter { seen.insert($0).inserted }
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
        guard self.getRed(&r, green: &g, blue: &b, alpha: &a) else {
            return nil
        }
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
