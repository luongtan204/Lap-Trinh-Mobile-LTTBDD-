"use strict";
class BankAccount {
    constructor(initialBalance) {
        this.balance = 0;
        this.balance = initialBalance;
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
const account = new BankAccount(100);
account.deposit(100);
console.log(`Balance after deposit: ${account.balance}`); // Output: Balance after deposit: 100
const success = account.withdraw(50);
console.log(`Withdrawal successful: ${success}, New Balance: ${account.balance}`); // Output: Withdrawal successful: true, New Balance: 50
