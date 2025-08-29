"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
// 16. Generic Box class
class Box {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
exports.Box = Box;
// Test
const numberBox = new Box(123);
console.log(numberBox.getValue());
const stringBox = new Box("Hello");
console.log(stringBox.getValue());
