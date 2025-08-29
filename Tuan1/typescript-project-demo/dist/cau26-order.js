"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
// 26. Order class with list of products
const product_1 = require("./product");
class Order {
    constructor(products) {
        this.products = products;
    }
    calculateTotal() {
        return this.products.reduce((sum, p) => sum + p.price, 0);
    }
}
exports.Order = Order;
// Test for Order
const products = [new product_1.Product("Laptop", 1200), new product_1.Product("Mouse", 25)];
const order = new Order(products);
console.log(order.calculateTotal());
