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

            DispatchQueue.main.async {
                guard let viewController = self.appContext?.utilities?.currentViewController(),
                    let decorView = viewController.view
                else {
                    return
                }

                self.currentDecorView = decorView
                self.setupDisplayLink()
                self.isMonitoring = true
            }
        }

        Function("stop") {
            guard isMonitoring else { return }
            displayLink?.invalidate()
            displayLink = nil
            isMonitoring = false
        }
    }

    private func setupDisplayLink() {
        displayLink = CADisplayLink(target: self, selector: #selector(scheduleA11yCheck))
        displayLink?.add(to: .main, forMode: .default)
    }

    @objc private func scheduleA11yCheck() {
        guard !isCheckScheduled else { return }

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
        // Logger.info("performA11yChecks", "doing the job")

        guard let issues = a11yChecker?.performA11yChecks(on: currentDecorView) else { return }

        if !issues.isEmpty {
            sendEvent(
                "onA11yIssues",
                ["timestamp": Date().timeIntervalSince1970 * 1000, "issues": issues]
            )
        }
    }
}
