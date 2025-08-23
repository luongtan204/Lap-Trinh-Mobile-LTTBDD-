class Car {
    brand : string;
    model : string;
    year : number;
    constructor(brand:string, model:string, year:number){
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo():void{
        console.log(`Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}
// const person = new Person("Alice", 30);
// person.displayInfo(); // Output:
const car = new Car("Toyota", "Camry", 2020);
car.displayInfo(); // Output: Brand: Toyota, Model: Camry, Year: