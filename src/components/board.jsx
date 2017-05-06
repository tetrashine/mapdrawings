import React from 'react';
import ReactDom from 'react-dom';

import BaseComponent from 'components/base';
import NodeComponent from 'components/node';
import MapFlowActionCreator from 'actions/mapflowactioncreator';

const _PX = 'px';
export default class Board extends BaseComponent {

    constructor() {
        super();
        this.startSelection = false;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.startHitSelection = this.startHitSelection.bind(this);

        this.state = {
            style: {}
        }
    }

    componentDidMount() {
        this.boardOffset = this.getOffset(this.refs.board);
    }

    getOffset( el ) {
        let rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    drawLine(key, from, to, thickness=1) {
        let x1 = from.x;
        let y1 = from.y;
        let x2 = to.x;
        let y2 = to.y;
        // distance
        let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
        // center
        let cx = ((x1 + x2) / 2) - (length / 2);
        let cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
        let style = {
            transform: 'rotate(' + angle + 'deg)',
            width: length + _PX,
            position: 'absolute',
            top: cy + _PX,
            left: cx + _PX
        };

        return <div key={key} className='line' style={style}></div>
    }

    storesToComponents(nodes) {
        let components = [];
        let lines = [];
        nodes.forEach(node => {
            let component = <NodeComponent ref={'node' + node.getId()} key={node.getId()} node={node} />;
            components.push(component);

            let x = node.getX();
            let y = node.getY();
            let outputNodes = node.getOutputNodes();

            if (outputNodes.length) {
                outputNodes.forEach((output, outputIndex) => {
                    let inputIndex = node.getOutputNodeIndex(outputIndex);
                    lines.push(this.drawLine(i, {
                        x: x + 165,
                        y: y + 25
                    }, {
                        x: output.getX() - 14,
                        y: output.getY() + (7 * (inputIndex + 1))
                    }));
                });
            }
        });

        return [components, lines];
    }

    handleMouseDown(event) {
        // Figure out where the click is
        let offset = this.getOffset(this.refs.board);

        this.click = {
            x: event.clientX,
            y: event.clientY
        };

        this.startSelection = true;
    }

    startHitSelection(event) {
        if (this.startSelection) {
            let hitIds = this.getOverlappingComponents(this.refs.highlight);

            MapFlowActionCreator.selectedNodes(hitIds);
            this.click = null;
            this.setState({
                style: {
                    display: 'none'
                }
            });
        }

        this.startSelection = false;
    }

    getOverlappingComponents(highlight) {
        let hitIds = [];
        let highlightOffset = this.getOffset(highlight);

        this.props.nodes.forEach((node, i) => {
            let el = this.refs['node' + node.getId()];
            let offset = this.getOffset(el.getDomObj());
            if (this.hit(highlightOffset, offset)) {
                hitIds.push(el.getNodeId());
            }
        });

        return hitIds;
    }

    hit(rect1, rect2) {
        return !((rect1.left + rect1.width) < rect2.left ||
                rect1.left > (rect2.left + rect2.width) ||
                (rect1.top + rect1.height) < rect2.top ||
                rect1.top > (rect2.top + rect2.height));
    }

    handleMouseMove(event) {
        if (this.click) {
            let startX = this.click.x;
            let startY = this.click.y;

            let smallerX = Math.min(startX, event.clientX);
            let smallerY = Math.min(startY, event.clientY);

            let style = {
                width: Math.abs(event.clientX - startX) + _PX,
                height: Math.abs(event.clientY - startY) + _PX,
                top: (smallerY - this.boardOffset.top) + _PX,
                left: (smallerX - this.boardOffset.left) + _PX
            };

            this.setState({
                style: style
            });
        }
    }

    render() {
        let [components, lines] = this.storesToComponents(this.props.nodes);

        return <div ref='board' className='mf-map' onMouseLeave={this.startHitSelection} onMouseDown={this.handleMouseDown} onMouseUp={this.startHitSelection} onMouseMove={this.handleMouseMove}>
            { components }

            { lines }

            <div ref='highlight' className='highlight' style={this.state.style}></div>
        </div>;
    }
}
