class User {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }
}

// Example usage:
const user = new User("Charlie");
console.log(user.name); // Output: Charlie
user.name = "Dave";
console.log(user.name); // Output: Dave
