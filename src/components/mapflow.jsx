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
            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons btn" onClick={this.exceute}>play_arrow</i>
            </button>
            <button id="demo-menu-lower-left" className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons">add_circle</i>
            </button>

            <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor="demo-menu-lower-left">
              <li className="mdl-menu__item" onClick={this.createData}>Add Data</li>
              <li className="mdl-menu__item" onClick={this.createNode}>Add Node</li>
              <li className="mdl-menu__item" onClick={this.createAlert}>Add Alert</li>
            </ul>

            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons btn" onClick={this.delete}>delete</i>
            </button>
            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons btn" onClick={this.clearAll}>delete_forever</i>
            </button>
            |
            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons">format_align_left</i>
            </button>
            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons">format_align_center</i>
            </button>
            <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons">format_align_right</i>
            </button>
            <BoardComponent
                nodes={this.state.nodes}
                links={this.state.links}
            />
        </div>;
    }
}
