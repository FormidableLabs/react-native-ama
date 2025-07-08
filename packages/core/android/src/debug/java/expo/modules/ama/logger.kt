package expo.modules.ama

import android.util.Log

object Logger {
    public fun info(fn: String, message: String, extra: String? = null) {
        if (extra.isNullOrEmpty()) {
            Log.i("[ReactNative AMA]: ", fn + " " + message)
        } else {
            Log.i("[ReactNative AMA]: ", fn + " " + message + "  >>> " + extra)
        }
    }

    public fun info2(fn: String, message: String) {
        Logger.info("  " + fn, message)
    }

    public fun debug(fn: String, message: String) {
        // Log.d("[ReactNative AMA]: ", fn + " " + message)
    }

    public fun error(fn: String, message: String) {
        Log.e("[ReactNative AMA - Error]: ", fn + " " + message)
    }
}
