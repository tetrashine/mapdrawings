// chain of events
// preprocess -> input -> process -> postprocess -> output
export default class Node {
    constructor(id, name='Node') {
        this.id = id;
        this.name = name;
        this.selected = false;
        this.inputs = {};
        this.linkInputs = {};
        this.linkOutputs = {};
        this.clearAll();
        this.x = 0;
        this.y = 0;
    }

    getId() { return this.id; }
    getName() { return this.name; }
    getX() { return this.x; }
    getY() { return this.y; }
    isSelected() { return this.selected; }
    addInput(id) { this.linkInputs[id] = undefined; }
    getInput(id) { return this.linkInputs[id]; }
    getInputs() { return Object.keys(this.linkInputs); }
    addOutput(id) { this.linkOutputs[id] = undefined; }
    getOutput(id) { return this.linkOutputs[id].node; }
    getOutputs() { return Object.keys(this.linkOutputs); }
    getOutputNodeIndex(id) { return this.linkOutputs[id].index; }

    select() {
        this.selected = true;
    }

    unselect() {
        this.selected = false;
    }

    clearAll() {
        this.getInputs().forEach(id => {
            this.unlinkInputNode(id);
        });

        this.getOutputs().forEach(id => {
            this.unlinkOutputNode(id);
        });
    }

    reset() {
        this.getInputs().forEach(id => {
            let node = this.getInput(id);
            if (node) {
                node.unlinkOutputNode(id);
            }
        });

        this.getOutputs().forEach(id => {
            let node = this.getOutput(id);
            node.unlinkInputNode(id);
        });

        this.clearAll();
    }

    linkInputNode(id, node) {
        //If there is previous input, unlink it first
        if (this.linkInputs[id]) {
            this.linkInputs[id].unlinkOutputNode(id);
        }

        this.linkInputs[id] = node;
    }

    unlinkInputNode(id) {
        this.linkInputs[id] = undefined;
    }

    linkOutputNode(inputId, node, index) {
        this.linkOutputs[inputId] = {
            node: node,
            index: index
        };
    }

    unlinkOutputNode(inputId) {
        delete this.linkOutputs[inputId];
    }

    hasInputs() {
        return this.getInputs().length > 0;
    }

    hasOutput() {
        return false;
    }

    input(id, val) {
        this.inputs[id] = val;

        //Check if all inputs are in
        /*if (Object.keys(this.inputs).length === Object.keys(this.linkInputs).length) {
            startProcessing(inputs);
        }*/
    }

    readyForExecution() {
        let ready = true;
        this.getInputs().every(id => {
            if (typeof this.getInput(id) === undefined) {
                ready = false;
                return false;
            }
            return true;
        });

        return ready;
    }

    execute(inputs) {
        this.preprocess();
        let outputVal = this.process(this.inputs);
        this.postprocess();
        this.output(outputVal);
    }

    preprocess() {
    }

    process(inputs) {
        return 0;
    }

    postprocess() {
    }

    output(val) {
        Object.keys(this.linkOutputs).forEach(key => {
            let node = this.getOutput(key);
            node.input(key, val);
        });
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
    }
}
