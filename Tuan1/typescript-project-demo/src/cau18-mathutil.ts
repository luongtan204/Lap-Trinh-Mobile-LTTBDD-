// 18. Static MathUtil class
export class MathUtil {
    static add(a: number, b: number): number {
        return a + b;
    }
    static subtract(a: number, b: number): number {
        return a - b;
    }
    static multiply(a: number, b: number): number {
        return a * b;
    }
    static divide(a: number, b: number): number {
        return a / b;
    }
}
// Test
console.log(MathUtil.add(2, 3));
console.log(MathUtil.subtract(5, 2));
console.log(MathUtil.multiply(3, 4));
console.log(MathUtil.divide(10, 2));
