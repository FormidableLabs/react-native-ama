import ExpoModulesCore
import UIKit

struct Constants {
    static let debounce: TimeInterval = 2.0
}

struct Snapshot: Codable {
    let fgColor: String?
    let bgColor: String?
    let x: Int
    let y: Int
    let width: Int
    let height: Int
    let parentId: Int
    let isPressable: Bool
    let isChecked: Bool
    
    enum CodingKeys: String, CodingKey {
        case fgColor, bgColor, x, y, width, height, parentId, isPressable, isChecked
    }
}

public class ReactNativeAmaModule: Module {
    private var isMonitoring = false
    private var currentDecorView: UIView?
    private var displayLink: CADisplayLink?

    private var a11yChecker: NodesGrabber?
    private var highlighter: Highlight?
    private var isCheckScheduled = false
    private var uiCheckDelay = 250
    private var tapProbeGesture: GlobalTapProbeGestureRecognizer?

    public func definition() -> ModuleDefinition {
        Name("ReactNativeAma")

        Events("onAmaNodes")

        Function("start") { (arguments: [Any]) in
            let options = arguments.first as? [String: Any]
            let uiCheck = options?["ui"] as? Bool ?? false
            uiCheckDelay = options?["delay"] as? Int ?? uiCheckDelay
        
            guard !isMonitoring else { return }

            Logger.info("start", "👀 Start Monitoring 👀")

            self.a11yChecker = NodesGrabber(appContext: self.appContext!)
            self.highlighter = Highlight()

            isMonitoring = true

            DispatchQueue.main.async {
                guard let viewController = self.appContext?.utilities?.currentViewController(),
                    let decorView = viewController.view,
                    let currentView = viewController.view,
                    let window = currentView.window
                else {
                    return
                }

                self.currentDecorView = decorView
                self.setupDisplayLink()
                
                if (uiCheck) {
                    if let oldProbe = self.tapProbeGesture {
                        window.removeGestureRecognizer(oldProbe)
                    }
                    
                    let probe = GlobalTapProbeGestureRecognizer(target: self, action: nil)
                    
                    probe.onTapDetected = { [weak self] (tappedView, rootView) in
                        self?.runMyChecks(tappedView: tappedView, rootView: rootView)
                    }
                    
                    window.addGestureRecognizer(probe)

                    self.tapProbeGesture = probe
                }
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

    /**
     * The Swift equivalent of `runMyChecks`.
     */
    private func runMyChecks(tappedView: UIView, rootView: UIView) {
        let beforeSnapshot = takeSnapshot(view: tappedView, root: rootView)

        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(uiCheckDelay)) {
            
            // 3. Equivalent of .isAttachedToWindow
            // In iOS, we check if the view still has a window.
            guard tappedView.window != nil, rootView.window != nil else {
                return
            }

            // 4. Take the 'after' snapshot
            let afterSnapshot = takeSnapshot(view: tappedView, root: rootView)

            // 5. Equivalent of a Bundle
            // We build a [String: Any] dictionary.
            let event: [String: Any] = [
                // Use .hash as the equivalent for Android's integer .id
                "rootTag": tappedView.hash,
                
                // Use our Swift dictionary conversion functions
                "before": convertMapToDictionary(snapshotMap: beforeSnapshot),
                "after": convertMapToDictionary(snapshotMap: afterSnapshot)
            ]

            self.sendEvent("onUIInteraction", event)
        }
    }
}

private func takeSnapshot(view: UIView, root: UIView) -> [Int: Snapshot] {
    var snapshots: [Int: Snapshot] = [:]
    return _takeSnapshot(view: view, root: root, snapshots: &snapshots, includeChildren: true)
}

private func _takeSnapshot(
    view: UIView,
    root: UIView,
    snapshots: inout [Int: Snapshot],
    includeChildren: Bool
) -> [Int: Snapshot] {

    if view.isPressable || view.isText() || includeChildren {
        // `getGlobalBounds` is the iOS equivalent of `getGlobalDpBounds`
        let position = view.getGlobalBounds(relativeTo: root)
        
        // iOS doesn't have integer IDs like Android.
        // We use `hashValue` as a unique identifier for this snapshot.
        let viewId = view.hash
        let parentId = view.superview?.hash ?? 0

        snapshots[viewId] = Snapshot(
            fgColor: view.contentColor?.hexString,
            bgColor: view.contentBackgroundColor?.hexString,
            x: Int(position.origin.x),
            y: Int(position.origin.y),
            width: Int(position.width),
            height: Int(position.height),
            parentId: parentId,
            isPressable: view.isPressable,
            isChecked: view.isChecked()
        )
    }

    // Recurse through subviews (equivalent to Android's child views)
    for subview in view.subviews {
        _takeSnapshot(view: subview, root: root, snapshots: &snapshots, includeChildren: includeChildren)
    }

    return snapshots
}

private func convertMapToDictionary(snapshotMap: [Int: Snapshot]) -> [String: Any] {
    var outputDict: [String: Any] = [:]
    
    snapshotMap.forEach { (key, snapshot) in
        // Convert Int key to String and convert Snapshot value to dictionary
        if let snapshotDict = convertSnapshotToDictionary(snapshot: snapshot) {
            outputDict[String(key)] = snapshotDict
        }
    }
    return outputDict
}

private func convertSnapshotToDictionary(snapshot: Snapshot) -> [String: Any]? {
    do {
        let encoder = JSONEncoder()
        let data = try encoder.encode(snapshot)
        let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments)
        return dictionary as? [String: Any]
    } catch {
        print("Error encoding snapshot: \(error)")
        return nil
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
}
