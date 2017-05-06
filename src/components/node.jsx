import React from 'react';
import ReactDom from 'react-dom';

import BaseComponent from 'components/base';
import MapFlowActionCreator from 'actions/mapflowactioncreator';
import Draggable from 'react-draggable';

const _NODE = 'node';
export default class Node extends BaseComponent {

    constructor() {
        super();
    }

    getNodeId() {
        return this.props.node.getId();
    }

    getDomObj() {
        return this.refs.mfNode;
    }

    setOutput(event) {
        event.dataTransfer.setData(_NODE, this.props.node.getId());
    }

    setInput(inputId, index, event) {
        let input = this.props.node.getId();
        let output = event.dataTransfer.getData(_NODE);

        MapFlowActionCreator.linkInput(input, output, inputId, index);

        return false;
    }

    onDrag(evt, data) {
        MapFlowActionCreator.updateNodeCoordinates(this.props.node.getId(), data.x, data.y)
        evt.stopPropagation();
    }

    cancelEvent(event) {
        event.preventDefault();
    }

    render() {
        let node = this.props.node;
        let id = node.getId();
        let name = node.getName();
        let selectedClass = node.isSelected() ? "selected" : "";
        let inputDiv = node.getInputs().map((input, index) => {
            return <div key={index} draggable="true" onDrop={this.setInput.bind(this, input, index)} onDragEnter={this.cancelEvent}  onDragOver={this.cancelEvent} className="mf-node-input cancel btn">&nbsp;</div>
        });

        return <Draggable
            axis="both"
            handle=".handle"
            cancel=".cancel"
            defaultPosition={{x: node.x, y: node.y}}
            onDrag={this.onDrag.bind(this)}
            position={null}
        >
            <div ref="mfNode" id={id} className={"mf-node handle unselectable " + selectedClass}>
                <div className="mf-node-inputs">{ inputDiv }</div>

                <span>{ name }</span>

                { node.hasOutputs() ? <div draggable="true" onDragStart={this.setOutput.bind(this)} className="mf-node-output cancel btn">&nbsp;</div> : null }
            </div>
        </Draggable>;
    }
}
