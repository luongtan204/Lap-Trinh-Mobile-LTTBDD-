"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Robot = void 0;
const cau20_vehicle_1 = require("./cau20-vehicle");
class Robot {
    move() {
        console.log("Robot moves.");
    }
}
exports.Robot = Robot;
cau20_vehicle_1.Car.prototype.move = function () {
    console.log("Car moves.");
};
// Test for Movable
const robot = new Robot();
robot.move();
const car = new cau20_vehicle_1.Car("Toyota", "Camry", 2020);
car.move();
