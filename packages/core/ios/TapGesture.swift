import UIKit
import UIKit.UIGestureRecognizerSubclass


class GlobalTapProbeGestureRecognizer: UIGestureRecognizer, UIGestureRecognizerDelegate {
    private var downPoint: CGPoint = .zero
    private let tapThreshold: CGFloat = 20.0 // Max movement (in points) for a "tap"

    var onTapDetected: ((UIView, UIView) -> Void)?

    override init(target: Any?, action: Selector?) {
        super.init(target: target, action: action)

        cancelsTouchesInView = false
        delaysTouchesBegan = false
        delaysTouchesEnded = false
        
        self.delegate = self
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesBegan(touches, with: event)

        if let touch = touches.first {
            downPoint = touch.location(in: self.view)
            self.state = .began // Move to "began" state
        }
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesMoved(touches, with: event)

        if let touch = touches.first {
            let currentPoint = touch.location(in: self.view)
            let distance = hypot(currentPoint.x - downPoint.x, currentPoint.y - downPoint.y)
            if distance > tapThreshold {
                self.state = .failed
            }
        }
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesEnded(touches, with: event)

        guard self.state != .failed,
              let touch = touches.first,
              let window = self.view as? UIWindow else {
            
            self.state = (self.state == .began) ? .ended : .failed
            return
        }

        let upPoint = touch.location(in: window)
        
        let distance = hypot(upPoint.x - downPoint.x, upPoint.y - downPoint.y)
        
        if distance < tapThreshold {
            self.state = .recognized // Mark as recognized
            
            if let tappedView = window.hitTest(upPoint, with: event) {
                
                let isPressable = tappedView.isPressable
                let isAccessible = tappedView.isAccessibilityElement
                
                if isPressable && isAccessible {
                    if let rootView = window.rootViewController?.view {
                        onTapDetected?(tappedView, rootView)
                    }
                }
            }
            self.state = .ended
        } else {
            self.state = .failed
        }
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesCancelled(touches, with: event)
        self.state = .failed
    }

    public func gestureRecognizer(
            _ gestureRecognizer: UIGestureRecognizer,
            shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
        ) -> Bool {
            return true
        }
}
