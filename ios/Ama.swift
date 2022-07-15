@objc(Ama)
class Ama: NSObject {

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
