"use strict";
const asyncHello = new Promise((resolve) => {
    setTimeout(() => {
        resolve("Hello Async");
    }, 2000);
});
asyncHello.then((message) => {
    console.log(message);
});
