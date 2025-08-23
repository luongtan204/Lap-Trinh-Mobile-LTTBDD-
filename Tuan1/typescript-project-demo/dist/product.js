"use strict";
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    filterByPrice(products, minPrice) {
        return products.filter(product => product.price > minPrice);
    }
}
const products = [
    new Product("Laptop", 1200),
    new Product("Mouse", 25),
    new Product("Keyboard", 150),
    new Product("Monitor", 300),
    new Product("Pen", 10)
];
const filteredProducts = products.filter(product => product.price > 100);
console.log(filteredProducts);
