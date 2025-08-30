"use strict";
//Write a Promise that reads an array after 1 second and filters even numbers.
function filterEvenNumbers(arr) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = arr.filter((num) => num % 2 === 0);
            resolve(filtered);
        }, 1000);
    });
}
filterEvenNumbers([1, 2, 3, 4, 5, 6]).then((evenNumbers) => {
    console.log("Even numbers:", evenNumbers);
});
