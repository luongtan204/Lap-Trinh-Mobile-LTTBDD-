// 17. Singleton Logger class
export class Logger {
    private static instance: Logger;
    private constructor() {}
    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(message: string): void {
        console.log(`Log: ${message}`);
    }
}
// Test
const logger1 = Logger.getInstance();
logger1.log("Hello");
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true
