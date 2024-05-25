export class MemoryManager {
    private cards: Map<string, any>;

    constructor() {
        this.cards = new Map();
    }

    allocateCard(uuid: string, cardData: any) {
        if (this.cards.has(uuid)) {
            throw new Error(`Card with UUID ${uuid} already exists.`);
        }
        this.cards.set(uuid, cardData);
    }

    getCard(uuid: string) {
        if (!this.cards.has(uuid)) {
            throw new Error(`Card with UUID ${uuid} does not exist.`);
        }
        return this.cards.get(uuid);
    }

    releaseCard(uuid: string) {
        if (!this.cards.has(uuid)) {
            throw new Error(`Card with UUID ${uuid} does not exist.`);
        }
        this.cards.delete(uuid);
    }
}
