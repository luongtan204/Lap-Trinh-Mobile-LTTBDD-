"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtil = void 0;
// 18. Static MathUtil class
class MathUtil {
    static add(a, b) {
        return a + b;
    }
    static subtract(a, b) {
        return a - b;
    }
    static multiply(a, b) {
        return a * b;
    }
    static divide(a, b) {
        return a / b;
    }
}
exports.MathUtil = MathUtil;
// Test
console.log(MathUtil.add(2, 3));
console.log(MathUtil.subtract(5, 2));
console.log(MathUtil.multiply(3, 4));
console.log(MathUtil.divide(10, 2));
