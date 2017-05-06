import React from 'react';
import ReactDom from 'react-dom';

import MapFlowStore from 'stores/mapflowstore';
import BaseComponent from 'components/base';
import BoardComponent from 'components/board';
import MapFlowActionCreator from 'actions/mapflowactioncreator';

export default class MapFlow extends BaseComponent {

    constructor() {
        super();
        this.state = {
            nodes: MapFlowStore.getNodes(),
            links: MapFlowStore.getSelectedLinks()
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        MapFlowStore.addChangeListener(this._onChange);
    }

    // Remove change listers from stores
    componentWillUnmount() {
        MapFlowStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            nodes: MapFlowStore.getNodes()
        });
    }

    delete() { MapFlowActionCreator.delete(); }
    exceute() { MapFlowActionCreator.execute(); }
    clearAll() { MapFlowActionCreator.clearAll(); }
    createData() { MapFlowActionCreator.createData(); }
    createNode() { MapFlowActionCreator.createNode(); }
    createAlert() { MapFlowActionCreator.createLog(); }

    render() {

        return <div id='mf-board'>
            <div onClick={this.exceute}>Run</div>
            <div onClick={this.createData}>Add Data</div>
            <div onClick={this.createNode}>Add Node</div>
            <div onClick={this.createAlert}>Add Alert</div>
            <div onClick={this.delete}>Delete</div>
            <div onClick={this.clearAll}>Clear All</div>

            <BoardComponent
                nodes={this.state.nodes}
                links={this.state.links}
            />
        </div>;
    }
}
