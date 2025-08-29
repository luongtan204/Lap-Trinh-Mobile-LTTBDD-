// 23. Payment interface and implementations
export interface Payment {
    pay(amount: number): void;
}

export class CashPayment implements Payment {
    pay(amount: number): void {
        console.log(`Paid ${amount} in cash.`);
    }
}

export class CardPayment implements Payment {
    pay(amount: number): void {
        console.log(`Paid ${amount} by card.`);
    }
}
