"use strict";
class User {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
}
// Example usage:
const user = new User("Charlie");
console.log(user.name); // Output: Charlie
user.name = "Dave";
console.log(user.name); // Output: Dave
