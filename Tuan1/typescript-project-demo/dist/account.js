"use strict";
class Account {
    constructor(accountNumber, owner, initialBalance) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = initialBalance;
    }
    get getBalance() {
        return this.balance;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}
// Example usage:
const acc = new Account("123456", "Alice", 500);
console.log(acc.accountNumber); // public
console.log(acc.owner); // readonly
console.log(acc.getBalance); // private via getter
acc.deposit(100);
console.log(acc.getBalance);
