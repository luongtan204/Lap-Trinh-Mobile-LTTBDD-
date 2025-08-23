class BankAccount{
    balance: number = 0;
    constructor(initialBalance:number){
        this.balance = initialBalance;
    }
    deposit(amount:number):void{
        this.balance += amount;
    }
    withdraw(amount:number):boolean{
        if(this.balance >= amount){
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