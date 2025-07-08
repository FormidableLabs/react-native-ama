import os

public struct Logger {
    // Replace with your own bundle identifier or subsystem
    private static let subsystem = Bundle.main.bundleIdentifier ?? "com.your.app"
    private static let log = os.Logger(subsystem: subsystem, category: "ReactNative AMA")

    public static func info(_ fn: String, _ message: String, extra: String? = nil) {
        if let extra = extra, !extra.isEmpty {
            log.info("[INFO]: \(fn) \(message)  >>> \(extra, privacy: .public)")
        } else {
            log.info("[INFO]: \(fn) \(message, privacy: .public)")
        }
    }

    public static func info2(_ fn: String, _ message: String) {
        info("  \(fn)", message)
    }

    public static func debug(_ fn: String, _ message: String, extra: String? = nil) {
        if let extra = extra, !extra.isEmpty {
            log.debug("[DEBUG]: \(fn) \(message)  >>> \(extra, privacy: .public)")
        } else {
            log.debug("[DEBUG]: \(fn) \(message, privacy: .public)")
        }
    }

    public static func error(_ fn: String, _ message: String) {
        log.error("[ERROR]: \(fn) \(message, privacy: .public)")
    }
}
