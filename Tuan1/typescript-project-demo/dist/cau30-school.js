"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
// 30. School class with Students and Teachers
const student_1 = require("./student");
const cau27_teacher_1 = require("./cau27-teacher");
class School {
    constructor(students, teachers) {
        this.students = students;
        this.teachers = teachers;
    }
    displayInfo() {
        console.log("School Info:");
        console.log("Students:");
        this.students.forEach(s => s.displayAllInfo());
        console.log("Teachers:");
        this.teachers.forEach(t => t.introduce());
    }
}
exports.School = School;
// Test for School
const students = [new student_1.Student("Bob", 20, "A")];
const teachers = [new cau27_teacher_1.Teacher("Alice", 30, "Math")];
const school = new School(students, teachers);
school.displayInfo();
