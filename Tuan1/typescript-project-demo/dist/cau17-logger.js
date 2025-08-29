"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// 17. Singleton Logger class
class Logger {
    constructor() { }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(message) {
        console.log(`Log: ${message}`);
    }
}
exports.Logger = Logger;
// Test
const logger1 = Logger.getInstance();
logger1.log("Hello");
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true
