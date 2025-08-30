"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumberPromise = void 0;
exports.randomNumberPromise = new Promise((resolve, reject) => {
    const num = Math.random();
    if (!isNaN(num)) {
        resolve(num);
    }
    else {
        reject(new Error("Failed to generate a random number"));
    }
});
exports.randomNumberPromise
    .then((number) => {
    console.log("Random number:", number);
})
    .catch((error) => {
    console.error("Error:", error.message);
});
