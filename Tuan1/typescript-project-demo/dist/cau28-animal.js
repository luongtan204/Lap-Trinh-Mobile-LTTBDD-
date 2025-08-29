"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cat = exports.Dog = exports.Animal = void 0;
// 28. Animal with protected makeSound, Dog and Cat override
class Animal {
    makeSound() {
        console.log("Animal makes a sound.");
    }
}
exports.Animal = Animal;
class Dog extends Animal {
    makeSound() {
        console.log("Dog barks.");
    }
    sound() {
        this.makeSound();
    }
}
exports.Dog = Dog;
class Cat extends Animal {
    makeSound() {
        console.log("Cat meows.");
    }
    sound() {
        this.makeSound();
    }
}
exports.Cat = Cat;
// Test for Animal, Dog, Cat
const dog = new Dog();
dog.sound();
const cat = new Cat();
cat.sound();
