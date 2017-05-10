import React from 'react';
import ReactDom from 'react-dom';

import BaseComponent from 'components/base';
import NodeComponent from 'components/node';
import MapFlowActionCreator from 'actions/mapflowactioncreator';

const _PX = 'px';
const _LINE = 'line';
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

    formLinkId(sourceId, inputId) {
        return sourceId + '-' + inputId;
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

    drawLine(key, from, to, selected=false, thickness=1) {
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
            left: cx + _PX,
            backgroundColor: (selected ? 'blue' : 'black')
        };

        return <div ref={_LINE+key} key={key} className='line' style={style}></div>
    }

    storesToComponents(nodes) {
        let components = [];
        let lines = [];
        nodes.forEach((node, i) => {
            let component = <NodeComponent ref={'node' + node.getId()} key={node.getId()} node={node} />;
            components.push(component);

            let sourceId = node.getId();
            let x = node.getX();
            let y = node.getY();

            if (node.hasOutput()) {
                node.getOutputs().forEach(id => {
                    let output = node.getOutput(id);
                    let inputIndex = node.getOutputNodeIndex(id);
                    let lineId = this.formLinkId(sourceId, id);
                    lines.push(this.drawLine(lineId, {
                        x: x + 165,
                        y: y + 25
                    }, {
                        x: output.getX() - 14,
                        y: output.getY() + (7 * (inputIndex + 1))
                    }, typeof this.props.links[lineId] !== 'undefined'));
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
            let [hitIds, linkIds] = this.getOverlappingComponents(this.refs.highlight);

            MapFlowActionCreator.selectedNodes(hitIds, linkIds);
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
        let hitLinks = [];
        let highlightOffset = this.getOffset(highlight);

        this.props.nodes.forEach((node, i) => {
            //check for hit test at nodes
            let el = this.refs['node' + node.getId()];
            let offset = this.getOffset(el.getDomObj());
            let sourceId = node.getId();
            if (this.hit(highlightOffset, offset)) {
                hitIds.push(el.getNodeId());

                //push all output links of selected node
                node.getInputs().forEach(id => {
                    let output = node.getInput(id);
                    if (output) {
                        let linkId = this.formLinkId(output.getId(), id);
                        hitLinks.push(linkId);
                    }
                });
                node.getOutputs().forEach(id => {
                    let linkId = this.formLinkId(sourceId, id);
                    hitLinks.push(linkId);
                });
            } else {
                //only check if node itself is not selected,
                //else all output links should be selected
                //check for hit test at links
                node.getOutputs().forEach(id => {
                    let linkId = this.formLinkId(sourceId, id);
                    let link = this.refs[_LINE+linkId];
                    let linkOffset = this.getOffset(link);

                    if (this.hit(highlightOffset, linkOffset)) {
                        hitLinks.push(linkId);
                    }
                });
            }
        });

        return [hitIds, hitLinks];
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
