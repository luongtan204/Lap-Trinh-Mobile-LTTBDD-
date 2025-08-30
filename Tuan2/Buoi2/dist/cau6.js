"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cau5_1 = require("./cau5");
Promise.all([
    (0, cau5_1.simulateTask)(1000).then((result) => {
        console.log("tsk1 tasks completed:", result);
    }),
    (0, cau5_1.simulateTask)(1500).then((result) => {
        console.log("tsk2 tasks completed:", result);
    }),
    (0, cau5_1.simulateTask)(2000).then((result) => {
        console.log("tsk3 tasks completed:", result);
    })
]).then((results) => {
    console.log("All tasks completed:");
});
