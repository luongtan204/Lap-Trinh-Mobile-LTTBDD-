// 25. Shape class with static method
type ShapeType = "Circle" | "Square" | "Rectangle";
export class Shape {
    static describe(type: ShapeType): void {
        console.log(`This is a ${type}.`);
    }
}

// Test for Shape
Shape.describe("Circle");
Shape.describe("Rectangle");
