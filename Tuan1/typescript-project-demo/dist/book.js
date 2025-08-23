"use strict";
class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
}
// Example usage:
const book = new Book("The Great Gatsby", "F. Scott Fitzgerald", 1925);
console.log(`Title: ${book.title}, Author: ${book.author}, Year: ${book.year}`); // Output: Title: The Great Gatsby, Author: F. Scott Fitzgerald, Year: 1925
