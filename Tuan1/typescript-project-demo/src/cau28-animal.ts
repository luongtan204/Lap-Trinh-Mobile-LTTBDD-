// 28. Animal with protected makeSound, Dog and Cat override
export class Animal {
    protected makeSound(): void {
        console.log("Animal makes a sound.");
    }
}
export class Dog extends Animal {
    protected makeSound(): void {
        console.log("Dog barks.");
    }
    public sound(): void {
        this.makeSound();
    }
}
export class Cat extends Animal {
    protected makeSound(): void {
        console.log("Cat meows.");
    }
    public sound(): void {
        this.makeSound();
    }
}

// Test for Animal, Dog, Cat
const dog = new Dog();
dog.sound();
const cat = new Cat();
cat.sound();
