class Account {
    public accountNumber: string;
    private balance: number;
    readonly owner: string;

    constructor(accountNumber: string, owner: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = initialBalance;
    }

    get getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): boolean {
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
