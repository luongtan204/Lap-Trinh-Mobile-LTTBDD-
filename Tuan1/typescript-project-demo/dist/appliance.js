"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirConditioner = exports.Fan = exports.Appliance = void 0;
// 24. Abstract Appliance class and implementations
class Appliance {
}
exports.Appliance = Appliance;
class Fan extends Appliance {
    turnOn() {
        console.log("Fan is turned on.");
    }
}
exports.Fan = Fan;
class AirConditioner extends Appliance {
    turnOn() {
        console.log("Air Conditioner is turned on.");
    }
}
exports.AirConditioner = AirConditioner;
