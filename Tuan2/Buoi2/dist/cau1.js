"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHello = void 0;
const asyncHello = new Promise((resolve) => {
    setTimeout(() => {
        resolve("Hello Async");
    }, 2000);
});
exports.asyncHello = asyncHello;
