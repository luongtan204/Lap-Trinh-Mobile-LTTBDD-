// 26. Order class with list of products
import { Product } from "./product";
export class Order {
    products: Product[];
    constructor(products: Product[]) {
        this.products = products;
    }
    calculateTotal(): number {
        return this.products.reduce((sum, p) => sum + p.price, 0);
    }
}

// Test for Order
const products = [new Product("Laptop", 1200), new Product("Mouse", 25)];
const order = new Order(products);
console.log(order.calculateTotal());
