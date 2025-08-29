"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = exports.Square = exports.Shape = void 0;
// 13. Abstract Shape class, Square and Circle
class Shape {
}
exports.Shape = Shape;
class Square extends Shape {
    constructor(side) {
        super();
        this.side = side;
    }
    area() {
        return this.side * this.side;
    }
}
exports.Square = Square;
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius * this.radius;
    }
}
exports.Circle = Circle;
// Test
const square = new Square(4);
console.log(square.area());
const circle = new Circle(3);
console.log(circle.area());
