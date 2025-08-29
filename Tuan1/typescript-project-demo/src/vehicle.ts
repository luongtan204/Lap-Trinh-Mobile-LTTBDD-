// 20. Vehicle interface and Car, Bike classes
export interface Vehicle {
    brand: string;
    model: string;
    year: number;
    displayInfo(): void;
}

export class Car implements Vehicle {
    brand: string;
    model: string;
    year: number;
    constructor(brand: string, model: string, year: number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo(): void {
        console.log(`Car - Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}

export class Bike implements Vehicle {
    brand: string;
    model: string;
    year: number;
    constructor(brand: string, model: string, year: number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo(): void {
        console.log(`Bike - Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}
