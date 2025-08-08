import ExpoModulesCore
import UIKit

public struct A11yIssue: Equatable {
    public let type: RuleAction
    public let rule: Rule
    public let label: String?
    public let reason: String?
    public let viewId: Int
    public var sent: Bool

    public static func == (lhs: A11yIssue, rhs: A11yIssue) -> Bool {
        return lhs.viewId == rhs.viewId && lhs.rule == rhs.rule
    }
}

public enum RuleAction: String {
    case must = "MUST"
    case mustNot = "MUST_NOT"
    case should = "SHOULD"
    case shouldNot = "SHOULD_NOT"
    case ignore = "IGNORE"
}

public enum Rule: String {
    case contrastFailed = "CONTRAST_FAILED"
    case contrastFailedAAA = "CONTRAST_FAILED_AAA"
    case flatlistNoCountInSingularMessage = "FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE"
    case flatlistNoCountInPluralMessage = "FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE"
    case minimumSize = "MINIMUM_SIZE"
    case noAccessibilityLabel = "NO_ACCESSIBILITY_LABEL"
    case noAccessibilityRole = "NO_ACCESSIBILITY_ROLE"
    case noFormLabel = "NO_FORM_LABEL"
    case noFormError = "NO_FORM_ERROR"
    case noKeyboardTrap = "NO_KEYBOARD_TRAP"
    case noUndefined = "NO_UNDEFINED"
    case uppercaseTextNoAccessibilityLabel = "UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL"
    case noUppercaseText = "NO_UPPERCASE_TEXT"
    case bottomSheetCloseAction = "BOTTOM_SHEET_CLOSE_ACTION"
    case incompatibleAccessibilityState = "INCOMPATIBLE_ACCESSIBILITY_STATE"
    case noFormLabelEndingWithAsterisk = "NO_FORM_LABEL_ENDING_WITH_ASTERISK"
    case incompatibleAccessibilityRole = "INCOMPATIBLE_ACCESSIBILITY_ROLE"
}

private let loggerRules: [Rule: RuleAction] = [
    .contrastFailed: .must,
    .contrastFailedAAA: .should,
    .flatlistNoCountInSingularMessage: .should,
    .flatlistNoCountInPluralMessage: .must,
    .minimumSize: .must,
    .noAccessibilityLabel: .must,
    .noAccessibilityRole: .must,
    .noFormLabel: .must,
    .noFormError: .must,
    .noKeyboardTrap: .mustNot,
    .noUndefined: .mustNot,
    .uppercaseTextNoAccessibilityLabel: .mustNot,
    .noUppercaseText: .mustNot,
    .bottomSheetCloseAction: .must,
    .incompatibleAccessibilityState: .must,
    .noFormLabelEndingWithAsterisk: .mustNot,
    .incompatibleAccessibilityRole: .mustNot,
]

public class A11yChecker {
    private let appContext: AppContext
    private let config: AMAConfig
    private var issues = [A11yIssue]()
    private let highlighter: Highlight
    private var newIssues = false

    public init(appContext: AppContext, config: AMAConfig) {
        self.appContext = appContext
        self.config = config
        self.highlighter = Highlight()
    }

    public func performA11yChecks(on rootView: UIView?) -> [String: Any] {
        guard let root = rootView else { return [:] }

        let oldIssues = issues.map { $0 }

        issues.removeAll()

        traverseAndCheck(view: root)
        let shouldSendEvent = clearFixedIssues(oldIssues)

        let newIssuesToSend = issues.filter { !$0.sent }

        if !newIssuesToSend.isEmpty {
            for newIssue in newIssuesToSend {
                if let index = issues.firstIndex(of: newIssue) {
                    issues[index].sent = true
                }
            }

            return [
                "issues": newIssuesToSend.map { issue in
                    [
                        "type": issue.type.rawValue,
                        "rule": issue.rule.rawValue,
                        "reason": issue.reason ?? "",
                        "label": issue.label ?? "",
                        "viewId": issue.viewId,
                    ]
                },
                "sendEvent": true,
            ]
        }

        return [
            "issues": [],
            "sendEvent": shouldSendEvent,
        ]
    }

    public func clearAllHighlights() {
        issues.forEach { issue in
            highlighter.clearHighlight(viewId: issue.viewId)
        }

        issues.removeAll()
    }

    private func clearFixedIssues(_ oldIssues: [A11yIssue]) -> Bool {
        let fixed = oldIssues.filter {
            old in !issues.contains(old)
        }

        fixed.forEach { issue in
            highlighter.clearHighlight(viewId: issue.viewId)
        }

        for idx in issues.indices {
            if oldIssues.contains(issues[idx]) {
                issues[idx].sent = true
            }
        }

        return !fixed.isEmpty
    }

    private func traverseAndCheck(view: UIView) {
        checkView(view)

        for subview in view.subviews {
            traverseAndCheck(view: subview)
        }
    }

    private func checkView(_ view: UIView) {
        if view.isPressable {
            checkForA11yLabel(view)
            checkForA11yRole(view)
            checkForMinimumTargetArea(view)
            checkColorContrast(on: view)
        }

        // if let label = view as? UILabel {
        //   Logger.debug("checkView", "Check for color contrast")
        //
        //   checkColorContrast(label)
        // }
    }

    private func checkForA11yLabel(_ view: UIView) {
        if view.accessibilityLabel?.isEmpty ?? true {
            addIssue(
                rule: .noAccessibilityLabel,
                label: view.getTextOrContent(),
                reason: "",
                view: view
            )
        }
    }

    private func checkForA11yRole(_ view: UIView) {
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

        let traits = view.accessibilityTraits
        let hasRoleTrait =
            traits.contains(.button)
            || traits.contains(.link)
            || traits.contains(.searchField)
            || traits.contains(.image)

        if !(hasRoleTrait || defaultRole != nil) {
            let label = view.getTextOrContent()
            let traitNames = view.accessibilityTraits.names

            addIssue(
                rule: .noAccessibilityRole,
                label: label,
                reason: "",
                view: view
            )
        }
    }

    private func checkForMinimumTargetArea(_ view: UIView) {
        let baseSize: CGRect = view.frame
        let insets = view.getHitSlopRect()
        let pressableWidth = baseSize.width - insets.left - insets.right
        let pressableHeight = baseSize.height - insets.top - insets.bottom

        if view.isPressable && (pressableWidth < 44 || pressableHeight < 44) {
            addIssue(
                rule: .minimumSize,
                label: view.getTextOrContent(),
                reason:
                    "\(Int(pressableWidth))x\(Int(pressableHeight))",
                view: view
            )
        }
    }

    private func checkColorContrast(on view: UIView) {
        guard
            let fg = view.contentColor
        else {
            return
        }
        let bg = getBackgroundColor(for: view)
        let contrastRatio = calculateContrastRatio(color1: fg, color2: bg)
        var minContrast = 3.0

        if let font = view.contentFont {
            let textSize = font.pointSize
            let isBold = font.fontDescriptor.symbolicTraits.contains(.traitBold)
            let isLargeText = textSize >= 18 || (textSize >= 14 && isBold)

            minContrast = isLargeText ? 3.0 : 4.5
        }

        if contrastRatio < minContrast {
            addIssue(
                rule: .contrastFailed,
                label: view.getTextOrContent(),
                reason: String(
                    format:
                        "Color contrast ratio %.2f is below minimum %.1f (WCAG AA).\nForeground %@ (%@) on background color %@ (%@)",
                    contrastRatio, minContrast,
                    fg.hexString, fg.rgbaString,
                    bg.hexString, bg.rgbaString
                ),
                view: view
            )
        }
    }

    private func getBackgroundColor(for view: UIView) -> UIColor {
        if let bg = view.backgroundColor { return bg }
        var parent = view.superview
        while let p = parent {
            if let bg = p.backgroundColor { return bg }
            parent = p.superview
        }
        return .white
    }

    private func calculateContrastRatio(color1: UIColor, color2: UIColor) -> Double {
        let l1 = calculateLuminance(color1)
        let l2 = calculateLuminance(color2)
        let lighter = max(l1, l2)
        let darker = min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
    }

    private func calculateLuminance(_ color: UIColor) -> Double {
        guard let comps = color.cgColor.components, comps.count >= 3 else { return 1.0 }
        let red = Double(comps[0])
        let green = Double(comps[1])
        let blue = Double(comps[2])
        func adjust(_ c: Double) -> Double {
            return c <= 0.03928 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4)
        }
        let r = adjust(red)
        let g = adjust(green)
        let b = adjust(blue)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    private func getRuleAction(_ rule: Rule) -> RuleAction {
        if let override = config.rules[rule.rawValue]?.uppercased() {
            switch override {
            case "PLEASE_FORGIVE_ME": return .ignore
            case "MUST": return .must
            case "SHOULD": return .should
            case "SHOULD_NOT": return .shouldNot
            case "MUST_NOT": return .mustNot
            default: return loggerRules[rule]!
            }
        }
        return loggerRules[rule]!
    }

    private func addIssue(rule: Rule, label: String, reason: String, view: UIView) {
        let action = getRuleAction(rule)
        let viewId = view.tag
        guard action != .ignore, viewId > 0 else { return }

        if !issues.contains(where: { $0.rule == rule && $0.viewId == viewId }) {
            self.newIssues = true

            issues.append(
                A11yIssue(
                    type: action,
                    rule: rule,
                    label: label,
                    reason: reason,
                    viewId: viewId,
                    sent: false
                ))
        }
    }

    public func clearHighlight(view: UIView) {
        let viewId = view.tag

        highlighter.clearHighlight(viewId: viewId)
    }

    public func highlight(view: UIView) {
        let viewId = view.tag
        if let issue = issues.first(where: { $0.viewId == viewId }) {
            let rule = issue.rule
            let action = getRuleAction(rule)

            highlighter.highlight(view: view, mode: config.highlight, action: action)
        }
    }
}

extension UIView {
    fileprivate func getTextOrContent() -> String {
        if let label = accessibilityLabel, !label.isEmpty {
            return label
        }
        if let lbl = self as? UILabel, let t = lbl.text, !t.isEmpty {
            return t
        }
        if let tf = self as? UITextField, let ph = tf.placeholder, !ph.isEmpty {
            return ph
        }
        return ""
    }

    var contentColor: UIColor? {
        let className = String(describing: type(of: self))

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
        // Recurse into children
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
}

extension UIAccessibilityTraits {
    /// Returns the names of all traits present in this bitmask.
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
