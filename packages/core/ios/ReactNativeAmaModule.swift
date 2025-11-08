import ExpoModulesCore
import UIKit

struct Constants {
    static let debounce: TimeInterval = 2.0
}

public class ReactNativeAmaModule: Module {
    private var isMonitoring = false
    private var currentDecorView: UIView?
    private var displayLink: CADisplayLink?

    private var a11yChecker: NodesGrabber?
    private var highlighter: Highlight?
    private var isCheckScheduled = false

    public func definition() -> ModuleDefinition {
        Name("ReactNativeAma")

        Events("onAmaNodes")

        Function("start") {
            guard !isMonitoring else { return }

            Logger.info("start", "👀 Start Monitoring 👀")

            self.a11yChecker = NodesGrabber(appContext: self.appContext!)
            self.highlighter = Highlight()

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
            }
        }

        AsyncFunction("highlight") { (viewId: Int, mode: String, hexColor: String) async -> [Double]? in
            guard
                let root = self.currentDecorView,
                let target = root.viewWithTag(viewId)
            else {
                return nil
            }

            await MainActor.run {
                if let scroll = target.enclosingScrollView {
                    var frameInScroll = target.convert(target.bounds, to: scroll)
                    let m = CGFloat(10)
                    
                    frameInScroll.origin.y = max(0, frameInScroll.origin.y - m)
                    scroll.scrollRectToVisible(frameInScroll, animated: false)
                }
                
                self.highlighter?.highlight(view: target, mode: mode, hexColor: hexColor)
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
            await MainActor.run {
                self.highlighter?.clearHighlight(viewId: viewId)
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
            self.getNodesToCheck()

            DispatchQueue.main.async {
                self.displayLink?.isPaused = false
                self.isCheckScheduled = false
            }
        }
    }

    private func getNodesToCheck() {
        guard isMonitoring else { return }
        guard let result = a11yChecker?.getNodesToCheck(on: currentDecorView) else { return }

        if let shouldSend = result.send as? Bool, shouldSend {
            // Since result.nodes is not optional, we can access it directly here.
            let nodes = result.nodes
            let nodesWithStringKeys = Dictionary(
                uniqueKeysWithValues: nodes.map { (key, value) in
                    (String(key), value.toDictionary())
                }
            )


            sendEvent(
                "onAmaNodes",
                nodesWithStringKeys
            )
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
