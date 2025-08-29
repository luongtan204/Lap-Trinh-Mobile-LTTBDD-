// 16. Generic Box class
export class Box<T> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }
    getValue(): T {
        return this.value;
    }
}
// Test
const numberBox = new Box<number>(123);
console.log(numberBox.getValue());
const stringBox = new Box<string>("Hello");
console.log(stringBox.getValue());
