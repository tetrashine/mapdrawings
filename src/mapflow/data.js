import Node from 'mapflow/node';

export default class Data extends Node {
    constructor(id, value) {
        super(id, value);
        this.value = value;
    }

    process() {
        return this.value;
    }

    hasOutput() {
        return true;
    }
}
