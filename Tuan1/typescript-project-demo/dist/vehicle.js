"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = exports.Car = void 0;
class Car {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo() {
        console.log(`Car - Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}
exports.Car = Car;
class Bike {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo() {
        console.log(`Bike - Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}
exports.Bike = Bike;
