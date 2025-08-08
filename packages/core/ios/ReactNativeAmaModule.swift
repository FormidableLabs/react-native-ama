import ExpoModulesCore
import UIKit

struct Constants {
    static let debounce: TimeInterval = 0.5
}

public struct AMAConfig: CustomDebugStringConvertible {
    public let rules: [String: String]
    public let accessibilityLabelExceptions: [String]
    public let highlight: String

    public init(from dictionary: [String: Any?]) {
        self.rules = dictionary["rules"] as? [String: String] ?? [:]
        self.accessibilityLabelExceptions =
            dictionary["accessibilityLabelExceptions"] as? [String] ?? []
        self.highlight = dictionary["highlight"] as? String ?? "both"
    }

    public var debugDescription: String {
        return """
            AMAConfig(
                rules: \(rules),
                accessibilityLabelExceptions: \(accessibilityLabelExceptions),
                highlight: "\(highlight)"
            )
            """
    }
}

public class ReactNativeAmaModule: Module {
    private var isMonitoring = false
    private var currentDecorView: UIView?
    private var displayLink: CADisplayLink?

    private var a11yChecker: A11yChecker?
    private var isCheckScheduled = false

    public func definition() -> ModuleDefinition {
        Name("ReactNativeAma")

        Events("onA11yIssues")

        Function("start") { (configMap: [String: Any?]) in
            guard !isMonitoring else { return }

            let config = AMAConfig(from: configMap)

            Logger.info("start", "👀 Start Monitoring 👀", extra: config.debugDescription)

            self.a11yChecker = A11yChecker(appContext: self.appContext!, config: config)

            isMonitoring = true

            DispatchQueue.main.async {
                guard let viewController = self.appContext?.utilities?.currentViewController(),
                    let decorView = viewController.view
                else {
                    return
                }

                self.currentDecorView = decorView
                self.setupDisplayLink()
            }
        }

        Function("stop") {
            guard isMonitoring else { return }

            isMonitoring = false

            DispatchQueue.main.async {
                self.displayLink?.invalidate()
                self.displayLink = nil

                self.a11yChecker?.clearAllHighlights()
            }
        }

        AsyncFunction("highlightComponent") { (viewId: Int) async -> [Double]? in
            guard
                let root = self.currentDecorView,
                let target = root.viewWithTag(viewId)
            else { return nil }

            await MainActor.run {
                if let scroll = target.enclosingScrollView {
                    var frameInScroll = target.convert(target.bounds, to: scroll)
                    let m = CGFloat(10)

                    frameInScroll.origin.y = max(0, frameInScroll.origin.y - m)
                    scroll.scrollRectToVisible(frameInScroll, animated: false)

                    a11yChecker?.highlight(view: target)
                }
            }

            let bounds: CGRect = await MainActor.run {
                target.convert(target.bounds, to: nil)
            }

            return [
                bounds.origin.x,
                bounds.origin.y,
                bounds.width,
                bounds.height,
            ]
        }

        AsyncFunction("clearHighlight") { (viewId: Int) in
            guard
                let root = self.currentDecorView,
                let target = root.viewWithTag(viewId)
            else { return  }

            await MainActor.run {
                a11yChecker?.clearHighlight(view: target)
            }
        }
    }

    private func setupDisplayLink() {
        displayLink = CADisplayLink(target: self, selector: #selector(scheduleA11yCheck))
        displayLink?.add(to: .main, forMode: .default)
    }

    @objc private func scheduleA11yCheck() {
        guard isMonitoring, !isCheckScheduled else { return }

        isCheckScheduled = true

        DispatchQueue.main.asyncAfter(deadline: .now() + Constants.debounce) { [weak self] in
            guard let self = self, let decorView = self.currentDecorView else {
                self?.isCheckScheduled = false

                return
            }

            self.displayLink?.isPaused = true
            self.performA11yChecks()

            DispatchQueue.main.async {
                self.displayLink?.isPaused = false
                self.isCheckScheduled = false
            }
        }
    }

    private func performA11yChecks() {
        guard isMonitoring else { return }
        guard let result = a11yChecker?.performA11yChecks(on: currentDecorView) else { return }

        if let shouldSend = result["sendEvent"] as? Bool, shouldSend {
            if let issueList = result["issues"] {
                sendEvent(
                    "onA11yIssues",
                    ["timestamp": Date().timeIntervalSince1970 * 1000, "issues": issueList]
                )
            }
        }
    }
}

extension UIView {
    fileprivate var enclosingScrollView: UIScrollView? {
        var v: UIView? = self
        while let view = v {
            if let scroll = view as? UIScrollView {
                return scroll
            }
            v = view.superview
        }
        return nil
    }
}
