import Node from 'mapflow/node';

export default class Log extends Node {

    constructor(id) {
        super(id, 'Log');

        this.addInput('Input');
    }

    process(inputs) {
        console.log(inputs['Input']);
    }
}
