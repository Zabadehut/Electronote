export class MemoryManager {
    private cards: Map<string, { data: any, memoryUsage: number }>;

    constructor() {
        this.cards = new Map();
    }

    allocateCard(uuid: string, cardData: any, memoryUsage: number) {
        if (this.cards.has(uuid)) {
            throw new Error(`Card with UUID ${uuid} already exists.`);
        }
        this.cards.set(uuid, { data: cardData, memoryUsage });
    }

    getCard(uuid: string) {
        const card = this.cards.get(uuid);
        if (!card) {
            throw new Error(`Card with UUID ${uuid} does not exist.`);
        }
        return card;
    }

    releaseCard(uuid: string) {
        if (!this.cards.has(uuid)) {
            throw new Error(`Card with UUID ${uuid} does not exist.`);
        }
        this.cards.delete(uuid);
    }

    getMemoryUsage(uuid: string): number {
        const card = this.getCard(uuid);
        return card.memoryUsage;
    }

    getTotalMemoryUsage(): number {
        let total = 0;
        this.cards.forEach(card => {
            total += card.memoryUsage;
        });
        return total;
    }
}
