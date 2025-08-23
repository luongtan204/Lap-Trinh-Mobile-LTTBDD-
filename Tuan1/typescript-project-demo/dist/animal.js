"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animal {
    constructor(name) {
        this.name = name;
    }
    sound() {
        console.log(`${this.name} makes a sound.`);
    }
}
class Dog extends Animal {
    sound() {
        this.bark();
    }
    bark() {
        console.log(`${this.name} says: Woof!`);
    }
}
class Cat extends Animal {
    sound() {
        this.meow();
    }
    meow() {
        console.log(`${this.name} says: Meow!`);
    }
}
// Example usage:
const dog = new Dog("Rex");
dog.sound(); // Rex says: Woof!
const cat = new Cat("Mimi");
cat.sound(); // Mimi says: Meow!
