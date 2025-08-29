"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
// 27. Teacher class extends Person
const person_1 = require("./person");
class Teacher extends person_1.Person {
    constructor(name, age, subject) {
        super(name, age);
        this.subject = subject;
    }
    introduce() {
        console.log(`I am ${this.name}, I teach ${this.subject}.`);
    }
}
exports.Teacher = Teacher;
// Test for Teacher
const teacher = new Teacher("Alice", 30, "Math");
teacher.introduce();
