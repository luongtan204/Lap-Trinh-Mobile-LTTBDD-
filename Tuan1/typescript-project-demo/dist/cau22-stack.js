"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
// 22. Stack class
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
}
exports.Stack = Stack;
// Test for Stack
const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.peek()); // 2
console.log(stack.pop()); // 2
console.log(stack.isEmpty()); // false
