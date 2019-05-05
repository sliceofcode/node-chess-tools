export class Logger {

    // Adjust the native console.debug() function to consider the debug setting
    public static init() {
        const _debug = console.debug;

        console.debug = function (...args) {
            if (global.myConfig.debug) {
                return _debug(...args);
            }
        };
    }

}