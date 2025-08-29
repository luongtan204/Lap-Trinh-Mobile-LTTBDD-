// 27. Teacher class extends Person
import { Person } from "./person";
export class Teacher extends Person {
    subject: string;
    constructor(name: string, age: number, subject: string) {
        super(name, age);
        this.subject = subject;
    }
    introduce(): void {
        console.log(`I am ${this.name}, I teach ${this.subject}.`);
    }
}

// Test for Teacher
const teacher = new Teacher("Alice", 30, "Math");
teacher.introduce();
