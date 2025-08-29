"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
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
exports.Student = Student;
const student = new Student("Bob", 20, "A");
student.displayAllInfo(); // Output: Name: Bob, Age:
