// 21. Generic Repository class
export class Repository<T> {
    private items: T[] = [];
    add(item: T): void {
        this.items.push(item);
    }
    getAll(): T[] {
        return this.items;
    }
}

// Test for Repository
const repo = new Repository<string>();
repo.add("item1");
repo.add("item2");
console.log(repo.getAll());
