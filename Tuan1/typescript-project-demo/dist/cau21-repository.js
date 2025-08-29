"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
// 21. Generic Repository class
class Repository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
}
exports.Repository = Repository;
// Test for Repository
const repo = new Repository();
repo.add("item1");
repo.add("item2");
console.log(repo.getAll());
