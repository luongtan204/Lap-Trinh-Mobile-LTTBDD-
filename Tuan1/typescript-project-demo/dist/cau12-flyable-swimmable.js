"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fish = exports.Bird = void 0;
class Bird {
    fly() {
        console.log("Bird is flying.");
    }
}
exports.Bird = Bird;
class Fish {
    swim() {
        console.log("Fish is swimming.");
    }
}
exports.Fish = Fish;
// Test
const bird = new Bird();
bird.fly();
const fish = new Fish();
fish.swim();
