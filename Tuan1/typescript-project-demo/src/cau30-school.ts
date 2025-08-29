// 30. School class with Students and Teachers
import { Student } from "./student";
import { Teacher } from "./cau27-teacher";
export class School {
    students: Student[];
    teachers: Teacher[];
    constructor(students: Student[], teachers: Teacher[]) {
        this.students = students;
        this.teachers = teachers;
    }
    displayInfo(): void {
        console.log("School Info:");
        console.log("Students:");
        this.students.forEach(s => s.displayAllInfo());
        console.log("Teachers:");
        this.teachers.forEach(t => t.introduce());
    }
}

// Test for School
const students = [new Student("Bob", 20, "A")];
const teachers = [new Teacher("Alice", 30, "Math")];
const school = new School(students, teachers);
school.displayInfo();
