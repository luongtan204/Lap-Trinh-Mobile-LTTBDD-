// 13. Abstract Shape class, Square and Circle
export abstract class Shape {
    abstract area(): number;
}
export class Square extends Shape {
    side: number;
    constructor(side: number) {
        super();
        this.side = side;
    }
    area(): number {
        return this.side * this.side;
    }
}
export class Circle extends Shape {
    radius: number;
    constructor(radius: number) {
        super();
        this.radius = radius;
    }
    area(): number {
        return Math.PI * this.radius * this.radius;
    }
}
// Test
const square = new Square(4);
console.log(square.area());
const circle = new Circle(3);
console.log(circle.area());
