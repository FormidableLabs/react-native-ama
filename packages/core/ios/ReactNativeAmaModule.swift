#if DEBUG
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

    /**
     * We need to wait for the navigation transition to complete!
     */
    private var uiCheckDelay = 1000

    private var windowTapRecognizer: UITapGestureRecognizer?
    private var tapDelegate: AmaTapGestureDelegate?
    private var gap: CGFloat = 0
    private var borderWidth: CGFloat = 3

    public func definition() -> ModuleDefinition {
        Name("ReactNativeAma")

        Events("onAmaNodes", "onUIInteraction")

        Function("start") { (arguments: [Any]) in
            let options = arguments.first as? [String: Any]
            let uiCheck = options?["ui"] as? Bool ?? false
            uiCheckDelay = options?["delay"] as? Int ?? uiCheckDelay
            gap = options?["gap"] as? CGFloat ?? gap
            borderWidth = options?["borderWidth"] as? CGFloat ?? borderWidth

            guard !isMonitoring else { return }

            Logger.info("start", "👀 Start Monitoring 👀")

            self.a11yChecker = NodesGrabber(appContext: self.appContext!)
            self.highlighter = Highlight()

            isMonitoring = true

            DispatchQueue.main.async {
                guard
                    let viewController = self.appContext?.utilities?
                        .currentViewController(),
                    let decorView = viewController.view,
                    let currentView = viewController.view,
                    let window = currentView.window
                else {
                    return
                }

                self.currentDecorView = decorView
                self.setupDisplayLink()

                if uiCheck {
                    self.attachWindowTapProbe()
                }
            }
        }

        Function("stop") {
            guard isMonitoring else { return }

            if let recognizer = self.windowTapRecognizer,
                let window = UIApplication.shared.currentKeyWindow
            {
                window.removeGestureRecognizer(recognizer)
            }

            self.windowTapRecognizer = nil
            self.isMonitoring = false

            DispatchQueue.main.async {
                self.displayLink?.invalidate()
                self.displayLink = nil
            }
        }

        AsyncFunction("highlight") {
            (viewId: Int, mode: String, hexColor: String, issueCount: Int) async -> [Double]? in
            guard
                let root = self.currentDecorView,
                let target = await root.viewWithTag(viewId)
            else {
                return nil
            }

            await MainActor.run {
                if let scroll = target.enclosingScrollView {
                    var frameInScroll = target.convert(
                        target.bounds,
                        to: scroll
                    )
                    let m = CGFloat(10)

                    frameInScroll.origin.y = max(0, frameInScroll.origin.y - m)
                    scroll.scrollRectToVisible(frameInScroll, animated: false)
                }

                self.highlighter?.highlight(
                    view: target,
                    mode: mode,
                    hexColor: hexColor,
                    gap: gap ?? 0,
                    lineWidth: borderWidth ?? 3,
                    issueCount: issueCount
                )
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
        displayLink = CADisplayLink(
            target: self,
            selector: #selector(scheduleA11yCheck)
        )
        displayLink?.add(to: .main, forMode: .default)
    }

    @objc private func scheduleA11yCheck() {
        guard isMonitoring, !isCheckScheduled else { return }

        isCheckScheduled = true

        DispatchQueue.main.asyncAfter(deadline: .now() + Constants.debounce) {
            [weak self] in
            guard let self = self, self.currentDecorView != nil else {
                self?.isCheckScheduled = false

                return
            }

            self.displayLink?.isPaused = true
            
            // Clean up any orphaned highlights (for unmounted views)
            self.highlighter?.cleanupOrphanedHighlights()
            
            self.getNodesToCheck()

            DispatchQueue.main.async {
                self.displayLink?.isPaused = false
                self.isCheckScheduled = false
            }
        }
    }

    private func getNodesToCheck() {
        guard isMonitoring else { return }
        guard let result = a11yChecker?.getNodesToCheck(on: currentDecorView)
        else { return }

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

    func getGlobalBounds(relativeTo rootView: UIView) -> CGRect {
        return self.convert(self.bounds, to: rootView)
    }

    func isChecked() -> Bool {
        if let control = self as? UIControl {
            if let uiSwitch = control as? UISwitch {
                return uiSwitch.isOn
            }

            return control.isSelected
        }

        return self.accessibilityTraits.contains(.selected)
    }

    func isModal() -> Bool {
        let names = [
            "RCTModalHostView",
            "RCTModalHostViewComponentView",
        ]
        for name in names {
            if let cls = NSClassFromString(name), self.isKind(of: cls) {
                return true
            }
        }

        return false
    }
}

extension UIApplication {
    var currentKeyWindow: UIWindow? {
        connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap { $0.windows }
            .first { $0.isKeyWindow }
    }
}

class AmaTapGestureDelegate: NSObject, UIGestureRecognizerDelegate {
    weak var module: ReactNativeAmaModule?

    init(module: ReactNativeAmaModule) {
        self.module = module
    }

    func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldRecognizeSimultaneouslyWith otherGestureRecognizer:
            UIGestureRecognizer
    )
        -> Bool
    {
        return true
    }
}

extension ReactNativeAmaModule {
    func attachWindowTapProbe() {
        guard let window = UIApplication.shared.currentKeyWindow else { return }
        if windowTapRecognizer != nil { return }

        let delegate = AmaTapGestureDelegate(module: self)
        tapDelegate = delegate  // keep it alive

        let recognizer = UITapGestureRecognizer(
            target: self,
            action: #selector(handleWindowTap(_:))
        )
        recognizer.cancelsTouchesInView = false
        recognizer.delaysTouchesBegan = false
        recognizer.delaysTouchesEnded = false
        recognizer.delegate = delegate

        window.addGestureRecognizer(recognizer)
        windowTapRecognizer = recognizer
    }

    public func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldRecognizeSimultaneouslyWith otherGestureRecognizer:
            UIGestureRecognizer
    ) -> Bool {
        return true
    }
}

extension ReactNativeAmaModule {
    private func findPressableAncestor(
        from view: UIView,
        root: UIView? = nil,
        maxLevels: Int = 8
    ) -> UIView? {
        var current: UIView? = view
        var level = 0

        while let v = current, level <= maxLevels {
            if let root = root, v === root {
                break
            }

            if v.isPressable {
                return v
            }

            level += 1
            current = v.superview
        }

        return nil
    }

    @objc
    func handleWindowTap(_ recognizer: UITapGestureRecognizer) {
        guard recognizer.state == .ended else { return }
        guard let window = UIApplication.shared.currentKeyWindow else {
            return
        }

        let location = recognizer.location(in: window)

        guard let hitView = window.hitTest(location, with: nil) else {
            return
        }

        // Find the closest pressable ancestor
        let pressable = findPressableAncestor(
            from: hitView,
            root: window,
            maxLevels: 8
        )

        guard let targetView = pressable else {
            return
        }

        runMyChecks(tappedView: targetView, rootView: currentDecorView!)
    }
}

extension ReactNativeAmaModule {
    private func runMyChecks(tappedView: UIView, rootView: UIView) {
        let beforeSnapshot = takeSnapshotOfTappedView(
            view: tappedView,
            root: rootView
        )
        let beforeModalVisible = isModalVisible(in: rootView)

        let delay = DispatchTime.now() + .milliseconds(60)
        DispatchQueue.main.asyncAfter(deadline: delay) {
            [weak self, weak tappedView, weak rootView] in
            guard let self = self,
                let tappedView = tappedView,
                let rootView = rootView,
                tappedView.window != nil,
                rootView.window != nil
            else {
                return
            }

            let afterSnapshot = self.takeSnapshotOfTappedView(
                view: tappedView,
                root: rootView
            )
            let afterModalVisible = self.isModalVisible(in: rootView)

            isCheckScheduled = true
            self.getNodesToCheck()

            let settleDelay = DispatchTime.now() + .milliseconds(Int(uiCheckDelay))
            DispatchQueue.main.asyncAfter(deadline: settleDelay) {
                [weak self, weak tappedView, weak rootView] in
                guard let self = self else { return }
                guard let tappedView = tappedView,
                    let rootView = rootView,
                    tappedView.window != nil,
                    rootView.window != nil
                else {
                    isCheckScheduled = false
                    return
                }

                let settledSnapshot = self.takeSnapshotOfTappedView(
                    view: tappedView,
                    root: rootView
                )

                let payload: [String: Any] = [
                    "rootTag": tappedView.tag,
                    "before": self.convertSnapshotMapToDict(
                        snapshotMap: beforeSnapshot
                    ),
                    "after": self.convertSnapshotMapToDict(
                        snapshotMap: afterSnapshot
                    ),
                    "afterSettled": self.convertSnapshotMapToDict(
                        snapshotMap: settledSnapshot
                    ),
                    "beforeModalVisible": beforeModalVisible,
                    "afterModalVisible": afterModalVisible,
                ]

                isCheckScheduled = false
                self.sendEvent("onUIInteraction", payload)
            }
        }
    }

    private func isModalVisible(in rootView: UIView) -> Bool {
        return findModalView(in: rootView) != nil
    }

    private func findModalView(in view: UIView) -> UIView? {
        if view.isModal() {
            return view
        }

        for subview in view.subviews {
            if let modal = findModalView(in: subview) {
                return modal
            }
        }

        return nil
    }
}

struct Snapshot {
    let fgColor: String?
    let bgColor: String?
    let x: Int
    let y: Int
    let width: Int
    let height: Int
    let parentId: Int
    let isPressable: Bool
    let isChecked: Bool
    let isBusy: Bool
    let isExpanded: Bool
    let isDisabled: Bool
    let isSelected: Bool
}

extension ReactNativeAmaModule {
    func takeSnapshotOfTappedView(
        view: UIView,
        root: UIView,
        snapshots: inout [Int: Snapshot]
    ) {
        let id = view.tag
        let frame = view.convert(view.bounds, to: root)
        let position = globalDpBounds(rect: frame, root: root)

        let fgColor = view.contentColor?.hexString
        let bgColor = view.contentBackgroundColor?.hexString

        let a11yIsPressable = view.isPressable
        let isChecked = view.accessibilityTraits.contains(.selected)
        let isBusy = view.isBusy()
        let a11yStates = view.a11yStates()

        let parentId = (view.superview?.tag).map { $0 } ?? -1

        snapshots[id] = Snapshot(
            fgColor: fgColor,
            bgColor: bgColor,
            x: position[0],
            y: position[1],
            width: position[2],
            height: position[3],
            parentId: parentId,
            isPressable: a11yIsPressable,
            isChecked: isChecked,
            isBusy: isBusy,
            isExpanded: a11yStates.isExpanded,
            isDisabled: a11yStates.isDisabled,
            isSelected: a11yStates.isSelected,
        )

        if let group = view as? UIStackView {
            for sub in group.arrangedSubviews {
                takeSnapshotOfTappedView(
                    view: sub,
                    root: root,
                    snapshots: &snapshots
                )
            }
        } else {
            for sub in view.subviews {
                takeSnapshotOfTappedView(
                    view: sub,
                    root: root,
                    snapshots: &snapshots
                )
            }
        }
    }

    func takeSnapshotOfTappedView(view: UIView, root: UIView) -> [Int: Snapshot]
    {
        var map: [Int: Snapshot] = [:]
        takeSnapshotOfTappedView(view: view, root: root, snapshots: &map)
        return map
    }

    func globalDpBounds(rect: CGRect, root: UIView) -> [Int] {
        let scale = UIScreen.main.scale
        let leftDp = Int(rect.origin.x * scale / scale)
        let topDp = Int(rect.origin.y * scale / scale)
        let widthDp = Int(rect.size.width * scale / scale)
        let heightDp = Int(rect.size.height * scale / scale)
        return [leftDp, topDp, widthDp, heightDp]
    }

    func convertSnapshotMapToDict(snapshotMap: [Int: Snapshot]) -> [String: Any]
    {
        var dict: [String: Any] = [:]

        for (key, snap) in snapshotMap {
            dict["\(key)"] = convertSnapshotToDict(snapshot: snap)
        }

        return dict
    }

    func convertSnapshotToDict(snapshot: Snapshot) -> [String: Any] {
        var result: [String: Any] = [:]

        if let fg = snapshot.fgColor { result["fgColor"] = fg }
        if let bg = snapshot.bgColor { result["bgColor"] = bg }

        result["x"] = snapshot.x
        result["y"] = snapshot.y
        result["width"] = snapshot.width
        result["height"] = snapshot.height
        result["parentId"] = snapshot.parentId
        result["isPressable"] = snapshot.isPressable
        result["isChecked"] = snapshot.isChecked
        result["isBusy"] = snapshot.isBusy
        result["isDisabled"] = snapshot.isDisabled
        result["isExpanded"] = snapshot.isExpanded
        result["isSelected"] = snapshot.isSelected

        return result
    }
}
#else
import ExpoModulesCore

public class ReactNativeAmaModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeAma")
  }
}
#endif
