import AppDispatcher from 'dispatcher/appdispatcher';
import MapFlowConstants from 'constants/mapflowconstants';

import Log from 'mapflow/log';
import Sum from 'mapflow/examples/sum';
import Data from 'mapflow/data';
import Node from 'mapflow/node';
import BaseStore from 'stores/basestore';
import MapflowMode from 'constants/mapflowmode';

class MapFlowStore extends BaseStore {
    constructor() {
        super();

        this.mode = MapflowMode.DEFAULT;
        this.start = {x: 0, y: 0};
        this.end = {x: 0, y: 0};
        this.name = "";
        this.nodes = [];
        this.selectedLinks = {};
    }

    startLinkDrag(x, y) {
        this.mode = MapflowMode.LINK;
        this.start = {
            x: x, y: y
        };
    }

    updateLinkDrag(x, y) {
        this.end = {
            x: x, y: y
        };
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

    endLinkDrag() {
        this.mode = MapflowMode.DEFAULT;
    }

    preExecute() {}

    execute() {
        this.preExecute();

        let storage, storageIds;
        let hasExecution = false;
        let nodes = this.nodes.slice()

        do {
            storageIds = {};
            storage = [];
            hasExecution = false;
            nodes.forEach((node, index) => {
                if (node.readyForExecution() && !storageIds[node.getId()]) {
                    node.execute();
                    node.getOutputs().forEach(id => {
                        let output = node.getOutput(id);
                        storage.push(output);
                        storageIds[output.getId()] = true;
                    });

                    hasExecution = true;
                }
            });
            nodes = storage;

        } while(hasExecution);

        this.postExecute();
    }

    postExecute() {}

    delete() {
        //Delete link first to ensure node still exist
        Object.keys(this.selectedLinks).forEach(key => {
            delete this.selectedLinks[key];

            let res = key.split('-');
            let sourceId = res[0];
            let name = res[1];

            for (let index = this.nodes.length - 1; index >= 0; index--) {
                let source = this.nodes[index];
                if (source.getId() === sourceId) {
                    let target = source.getOutput(name);
                    target.unlinkInputNode(name);
                    source.unlinkOutputNode(name)
                    break;
                }
            }
        });

        for (let index = this.nodes.length - 1; index >= 0; index--) {
            if (this.nodes[index].isSelected()) {
                this.node = this.nodes.splice(index, 1);
                this.node.forEach(n => {
                    n.reset();
                });
            }
        }
    }

    getMode() {
        return this.mode;
    }

    getLink() {
        return {
            start: this.start,
            end: this.end
        };
    }

    getNodes() {
        return this.nodes;
    }

    getSelectedLinks() {
        return this.selectedLinks;
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

    selectNodes(ids, linkIds) {
        let selectedIndex = 0;
        this.nodes.forEach(node => {
            if (node.getId() === ids[selectedIndex]) {
                node.select();
                selectedIndex++;
            } else {
                node.unselect();
            }
        });

        //set all to false
        Object.keys(this.selectedLinks).forEach(id => {
            this.selectedLinks[id] = undefined;
        });

        //set selected ones
        linkIds.forEach(linkId => {
            this.selectedLinks[linkId] = true;
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
            store.selectNodes(action.ids, action.linkIds);
            store.emitChange();
            break;
        case MapFlowConstants.START_DRAG_COORDS:
            store.startLinkDrag(action.x, action.y);
            store.emitChange();
            break;
        case MapFlowConstants.UPDATE_DRAG_COORDS:
            store.updateLinkDrag(action.x, action.y);
            store.emitChange();
            break;
        case MapFlowConstants.DRAG_END:
            store.endLinkDrag();
            store.emitChange();
            break;
        default:
            //do nothing
    }
});

export default store;
