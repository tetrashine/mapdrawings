import Node from 'mapflow/node';

export default class Sum extends Node {
    constructor(id) {
        super(id, "Sum");

        this.addInput('Number A');
        this.addInput('Number B');
        this.addOutput('Sum');
    }

    process(inputs) {
        return this.linkInputs['Number A'] + this.linkInputs['Number B'];
    }

    hasOutput() {
        return true;
    }
}
