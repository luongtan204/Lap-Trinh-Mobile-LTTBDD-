class Rectangle{
    height: number;
    width: number;
    constructor(height:number, width:number){
        this.height = height;
        this.width = width;
    }
    area():number{
        return this.height * this.width;
    }

}
const rect = new Rectangle(10, 5);
console.log(`Area of rectangle: ${rect.area()}`); // Output: Area of rectangle