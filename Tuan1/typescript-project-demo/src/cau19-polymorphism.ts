// 19. Polymorphism with Animal and subclasses
export class Animal {
    makeSound(): void {
        console.log("Animal makes a sound.");
    }
}
export class Dog extends Animal {
    makeSound(): void {
        console.log("Dog barks.");
    }
}
export class Cat extends Animal {
    makeSound(): void {
        console.log("Cat meows.");
    }
}
// Test
const animals: Animal[] = [new Animal(), new Dog(), new Cat()];
animals.forEach(a => a.makeSound());
