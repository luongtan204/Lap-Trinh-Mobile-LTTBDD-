"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cau5_1 = require("./cau5");
Promise.race([
    (0, cau5_1.simulateTask)(1000),
    (0, cau5_1.simulateTask)(500),
    (0, cau5_1.simulateTask)(2000)
]).then((result) => {
    console.log("First completed:", result);
});
