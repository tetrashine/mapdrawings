import React from 'react';
import ReactDom from 'react-dom';

import BaseComponent from 'components/base';
import MapFlowActionCreator from 'actions/mapflowactioncreator';
import Draggable from 'react-draggable';

const _NODE = 'node';
export default class Node extends BaseComponent {

    constructor() {
        super();

        this.state = {
            bounds: {right: 0, left: 0}
        }
    }

    componentDidMount() {
        this.setState({
            bounds: this.refs.mfNode.getBoundingClientRect()
        });
    }

    getNodeId() {
        return this.props.node.getId();
    }

    getDomObj() {
        return this.refs.mfNode;
    }

    setOutput(event) {
        MapFlowActionCreator.startDragCoords(event.clientX, event.clientY);
        event.dataTransfer.setData(_NODE, this.props.node.getId());
        event.stopPropagation();
    }

    setOutputDrag(event) {
        //console.log(event.clientX + "," + event.clientY)
        MapFlowActionCreator.updateDragCoords(event.clientX, event.clientY);
        event.stopPropagation();
    }

    setOutputDragEnd() {
        MapFlowActionCreator.updateDragEnd();
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
        let bounds = {
            left: this.props.bounds.left,
            right: this.props.bounds.right - this.state.bounds.width,
            top: this.props.bounds.top,
            bottom: this.props.bounds.bottom
        }

        return <Draggable
            axis="both"
            handle=".handle"
            cancel=".cancel"
            defaultPosition={{x: node.x, y: node.y}}
            onDrag={this.onDrag.bind(this)}
            onMouseDown={this.cancelEvent}
            position={null}
            bounds={bounds}
        >
            <div ref="mfNode" id={id} className={"mf-node handle unselectable " + selectedClass}>
                <div className="mf-node-inputs">{ inputDiv }</div>

                <span>{ name }</span>

                { node.hasOutput() ? <div draggable="true" onDragStart={this.setOutput.bind(this)} onDrag={this.setOutputDrag.bind(this)} onDragEnd={this.setOutputDragEnd.bind(this)} className="mf-node-output cancel btn" onMouseDown={this.cancelEvent}>&nbsp;</div> : null }
            </div>
        </Draggable>;
    }
}
