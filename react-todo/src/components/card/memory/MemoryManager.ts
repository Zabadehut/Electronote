export class MemoryManager {
    private cardMemoryUsage: Map<string, number>;

    constructor() {
        this.cardMemoryUsage = new Map();
    }

    allocateCard(id: string, memoryUsage: number) {
        this.cardMemoryUsage.set(id, memoryUsage);
    }

    deallocateCard(id: string) {
        this.cardMemoryUsage.delete(id);
    }

    getMemoryUsage(id: string): number {
        return this.cardMemoryUsage.get(id) || 0;
    }

    getTotalMemoryUsage(): number {
        let totalMemory = 0;
        this.cardMemoryUsage.forEach(memory => {
            totalMemory += memory;
        });
        return totalMemory;
    }
}
