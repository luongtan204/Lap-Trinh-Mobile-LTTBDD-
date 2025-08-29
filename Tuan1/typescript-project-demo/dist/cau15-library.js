"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = exports.User = exports.Book = void 0;
// 15. Library class for Book and User
class Book {
    constructor(title) {
        this.title = title;
    }
}
exports.Book = Book;
class User {
    constructor(name) {
        this.name = name;
    }
}
exports.User = User;
class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }
    addBook(book) {
        this.books.push(book);
    }
}
exports.Library = Library;
// Test
const library = new Library();
library.addBook(new Book("TypeScript Basics"));
console.log(library.books);
