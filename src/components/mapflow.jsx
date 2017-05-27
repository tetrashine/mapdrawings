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
            <i className="material-icons btn" onClick={this.exceute}>play_arrow</i>
            <i className="material-icons btn" onClick={this.createData} >add_circle</i>
            <i className="material-icons btn" onClick={this.createNode}>note_add</i>
            <i className="material-icons btn" onClick={this.createAlert}>add_alarm</i>
            <i className="material-icons btn" onClick={this.delete}>delete</i>
            <i className="material-icons btn" onClick={this.clearAll}>delete_forever</i>
            |
            <i className="material-icons">format_align_left</i>
            <i className="material-icons">format_align_center</i>
            <i className="material-icons">format_align_right</i>
            <BoardComponent
                nodes={this.state.nodes}
                links={this.state.links}
            />
        </div>;
    }
}
