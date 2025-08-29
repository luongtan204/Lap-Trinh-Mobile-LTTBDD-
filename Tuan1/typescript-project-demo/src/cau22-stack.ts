// 22. Stack class
export class Stack<T> {
    private items: T[] = [];
    push(item: T): void {
        this.items.push(item);
    }
    pop(): T | undefined {
        return this.items.pop();
    }
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }
    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

// Test for Stack
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.peek()); // 2
console.log(stack.pop()); // 2
console.log(stack.isEmpty()); // false
