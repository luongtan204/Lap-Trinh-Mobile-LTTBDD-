// 29. Movable interface, Car and Robot implement
export interface Movable {
    move(): void;
}
import { Car } from "./cau20-vehicle";
export class Robot implements Movable {
    move(): void {
        console.log("Robot moves.");
    }
}
(Car.prototype as any).move = function() {
    console.log("Car moves.");
};

// Test for Movable
const robot = new Robot();
robot.move();
const car = new Car("Toyota", "Camry", 2020);
(car as any).move();
