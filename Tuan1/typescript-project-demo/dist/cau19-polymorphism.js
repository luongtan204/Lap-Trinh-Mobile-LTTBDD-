"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cat = exports.Dog = exports.Animal = void 0;
// 19. Polymorphism with Animal and subclasses
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
}
exports.Dog = Dog;
class Cat extends Animal {
    makeSound() {
        console.log("Cat meows.");
    }
}
exports.Cat = Cat;
// Test
const animals = [new Animal(), new Dog(), new Cat()];
animals.forEach(a => a.makeSound());
