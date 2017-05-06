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
        event.stopPropagation();
    }

    setInput(inputId, index, event) {
        let input = this.props.node.getId();
        let output = event.dataTransfer.getData(_NODE);

        MapFlowActionCreator.linkInput(input, output, inputId, index);

        return false;
    }

    onDrag(event, data) {
        MapFlowActionCreator.updateNodeCoordinates(this.props.node.getId(), data.x, data.y);
        event.stopPropagation();
    }

    cancelEvent(event) {
        event.stopPropagation();
    }

    cancelDefault(event) {
        event.preventDefault();
    }

    render() {
        let node = this.props.node;
        let id = node.getId();
        let name = node.getName();
        let selectedClass = node.isSelected() ? "selected" : "";
        let inputDiv = node.getInputs().map((input, index) => {
            return <div key={index} draggable="true" onDrop={this.setInput.bind(this, input, index)} onDragEnter={this.cancelDefault}  onDragOver={this.cancelDefault} className="mf-node-input cancel btn">&nbsp;</div>
        });

        return <Draggable
            axis="both"
            handle=".handle"
            cancel=".cancel"
            defaultPosition={{x: node.x, y: node.y}}
            onDrag={this.onDrag.bind(this)}
            onMouseDown={this.cancelEvent}
            position={null}
        >
            <div ref="mfNode" id={id} className={"mf-node handle unselectable " + selectedClass}>
                <div className="mf-node-inputs">{ inputDiv }</div>

                <span>{ name }</span>

                { node.hasOutput() ? <div draggable="true" onDragStart={this.setOutput.bind(this)} className="mf-node-output cancel btn" onMouseDown={this.cancelEvent}>&nbsp;</div> : null }
            </div>
        </Draggable>;
    }
}
