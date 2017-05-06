import AppDispatcher from 'dispatcher/appdispatcher';
import MapFlowConstants from 'constants/mapflowconstants';

import Log from 'mapflow/log';
import Sum from 'mapflow/examples/sum';
import Data from 'mapflow/data';
import Node from 'mapflow/node';
import BaseStore from 'stores/basestore';

class MapFlowStore extends BaseStore {
    constructor() {
        super();

        this.name = "";
        this.nodes = [];
    }

    createData() {
        let node = new Data(this.generateNodeId(), 10);
        this.nodes.push(node);
    }

    createNode() {
        let node = new Sum(this.generateNodeId());
        this.nodes.push(node);
    }

    createLog() {
        let node = new Log(this.generateNodeId());
        this.nodes.push(node);
    }

    clearAll() {
        this.nodes.forEach(node => {
            node.clearAll();
        });

        this.nodes = [];
    }

    linkInput(input, output, inputId, index) {
        let inputNode = this.getNodeById(input);
        let outputNode = this.getNodeById(output);

        inputNode.linkInputNode(inputId, outputNode);
        outputNode.linkOutputNode(inputId, inputNode, index);
    }

    execute() {
        console.log(this.nodes);
    }

    delete() {
        for (let index = this.nodes.length - 1; index >= 0; index--) {
            if (this.nodes[index].isSelected()) {
                this.node = this.nodes.splice(index, 1);
                this.node.forEach(n => {
                    n.reset();
                });
            }
        }
    }

    getNodes() {
        return this.nodes;
    }

    getNodeById(id) {
        let nodes = this.nodes;
        for(let i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].getId() === id) {
                return nodes[i];
            }
        }
    }

    generateNodeId() {
        if (!this.nodeId) {
            this.nodeId = 0;
        }

        let val = this.nodeId++;
        return val.toString();
    }

    updateCoord(id, x, y) {
        let node = this.getNodeById(id);
        node.setXY(x, y);
    }

    selectNodes(ids) {
        let selectedIndex = 0;
        this.nodes.forEach(node => {
            if (node.getId() === ids[selectedIndex]) {
                node.select();
                selectedIndex++;
            } else {
                node.unselect();
            }
        });
    }
}

const store = new MapFlowStore();

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
    let action = payload.action;
    let text;

    switch(action.actionType) {
        case MapFlowConstants.EXECUTE:
            store.execute();
            store.emitChange();
            break;
        case MapFlowConstants.DELETE:
            store.delete();
            store.emitChange();
            break;
        case MapFlowConstants.CREATE_DATA:
            store.createData();
            store.emitChange();
            break;
        case MapFlowConstants.CREATE_NODE:
            store.createNode();
            store.emitChange();
            break;
        case MapFlowConstants.CREATE_LOG:
            store.createLog();
            store.emitChange();
            break;
        case MapFlowConstants.CLEAR_ALL:
            store.clearAll();
            store.emitChange();
            break;
        case MapFlowConstants.LINK_INPUT:
            store.linkInput(action.input, action.output, action.inputId, action.inputIndex)
            store.emitChange();
            break;
        case MapFlowConstants.UPDATE_COORD:
            store.updateCoord(action.id, action.x, action.y)
            store.emitChange();
            break;
        case MapFlowConstants.SELECTED_NODES:
            store.selectNodes(action.ids);
            store.emitChange();
            break;
        default:
            //do nothing
    }
});

export default store;
