// 14. Employee, Manager, Developer classes
export class Employee {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    work(): void {
        console.log(`${this.name} is working.`);
    }
}
export class Manager extends Employee {
    manage(): void {
        console.log(`${this.name} is managing.`);
    }
}
export class Developer extends Employee {
    code(): void {
        console.log(`${this.name} is coding.`);
    }
}
// Test
const manager = new Manager("Alice");
manager.work();
manager.manage();
const dev = new Developer("Bob");
dev.work();
dev.code();
