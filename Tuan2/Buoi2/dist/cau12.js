"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// ...existing code...
const cau5_1 = require("./cau5");
function callSimulateTask() {
    return __awaiter(this, void 0, void 0, function* () {
        const result2 = yield (0, cau5_1.simulateTask)(1000);
        console.log(result2);
        const result = yield (0, cau5_1.simulateTask)(2000);
        console.log(result);
    });
}
callSimulateTask();
//
