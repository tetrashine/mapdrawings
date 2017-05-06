import Node from 'mapflow/node';

export default class Sum extends Node {
    constructor(id) {
        super(id, "Sum");
    }

    clearAll() {
        super.clearAll();
        this.linkInputs = {
            'Number A': null,
            'Number B': null,
        };

        this.linkOutputs = {
            'Sum': null
        };
    }

    process(inputs) {
        return this.linkInputs['Number A'] + this.linkInputs['Number B'];
    }
}
