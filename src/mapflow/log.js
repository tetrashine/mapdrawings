import Node from 'mapflow/node';

export default class Log extends Node {

    constructor(id) {
        super(id, 'Log');
    }

    clearAll() {
        super.clearAll();
        this.linkInputs = {
            'Input': null
        };

        this.linkOutputs = {};
    }

    process(inputs) {
        console.log(this.linkInputs['Input'])
    }
}
