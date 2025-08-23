"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const person_1 = require("./person");
class Student extends person_1.Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    displayAllInfo() {
        console.log(`Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`);
    }
}
const student = new Student("Bob", 20, "A");
student.displayAllInfo(); // Output: Name: Bob, Age:
