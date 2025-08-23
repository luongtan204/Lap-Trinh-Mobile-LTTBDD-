
export interface IAnimal {
    name: string;
    sound(): void;
}
export interface IAnimal {
    name: string;
    sound(): void;
}


class Animal implements IAnimal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sound(): void {
        console.log(`${this.name} makes a sound.`);
    }
}

class Dog extends Animal implements IAnimal {
    sound(): void {
        this.bark();
    }
    bark(): void {
        console.log(`${this.name} says: Woof!`);
    }
}

class Cat extends Animal implements IAnimal {
    sound(): void {
        this.meow();
    }
    meow(): void {
        console.log(`${this.name} says: Meow!`);
    }
}

// Example usage:
const dog = new Dog("Rex");
dog.sound(); // Rex says: Woof!

const cat = new Cat("Mimi");
cat.sound(); // Mimi says: Meow!
