/**
 * LIFO.
 */
export default class Stack {
    #items = [];

    constructor() {}

    push(item) {
        this.#items.push(item);
    }

    pop() {
        return this.#items.pop();
    }

    peek() {
        return this.#items[this.#items.length - 1];
    }

    get items() {
        return this.#items;
    }

}