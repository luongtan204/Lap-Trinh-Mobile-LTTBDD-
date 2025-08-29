"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Developer = exports.Manager = exports.Employee = void 0;
// 14. Employee, Manager, Developer classes
class Employee {
    constructor(name) {
        this.name = name;
    }
    work() {
        console.log(`${this.name} is working.`);
    }
}
exports.Employee = Employee;
class Manager extends Employee {
    manage() {
        console.log(`${this.name} is managing.`);
    }
}
exports.Manager = Manager;
class Developer extends Employee {
    code() {
        console.log(`${this.name} is coding.`);
    }
}
exports.Developer = Developer;
// Test
const manager = new Manager("Alice");
manager.work();
manager.manage();
const dev = new Developer("Bob");
dev.work();
dev.code();
