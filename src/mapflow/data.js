import Node from 'mapflow/node';

export default class Data extends Node {
    constructor(id, value) {
        super(id, value);
        this.value = value;
    }

    clearAll() {
        super.clearAll();
        this.linkInputs = {};

        this.linkOutputs = [];
    }

    process() {
        return this.value;
    }
}
