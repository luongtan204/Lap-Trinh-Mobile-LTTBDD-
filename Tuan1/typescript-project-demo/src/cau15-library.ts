// 15. Library class for Book and User
export class Book {
    title: string;
    constructor(title: string) {
        this.title = title;
    }
}
export class User {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
export class Library {
    books: Book[] = [];
    users: User[] = [];
    addBook(book: Book): void {
        this.books.push(book);
    }
}
// Test
const library = new Library();
library.addBook(new Book("TypeScript Basics"));
console.log(library.books);
