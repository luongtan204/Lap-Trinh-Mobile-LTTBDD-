// 24. Abstract Appliance class and implementations
export abstract class Appliance {
    abstract turnOn(): void;
}

export class Fan extends Appliance {
    turnOn(): void {
        console.log("Fan is turned on.");
    }
}

export class AirConditioner extends Appliance {
    turnOn(): void {
        console.log("Air Conditioner is turned on.");
    }
}
