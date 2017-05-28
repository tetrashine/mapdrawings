import AppDispatcher from 'dispatcher/appdispatcher';
import MapFlowConstants from 'constants/mapflowconstants';

class MapFlowActionCreator {

    execute() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.EXECUTE
        });
    }

    delete() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.DELETE
        });
    }

    clearAll() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.CLEAR_ALL
        });
    }

    createData() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.CREATE_DATA
        });
    }

    createNode() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.CREATE_NODE
        });
    }

    createLog() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.CREATE_LOG
        });
    }

    linkInput(input, output, inputId, inputIndex) {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.LINK_INPUT,
            input: input,
            output: output,
            inputId: inputId,
            inputIndex: inputIndex
        });
    }

    updateNodeCoordinates(id, x, y) {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.UPDATE_COORD,
            id: id,
            x: x,
            y: y
        });
    }

    selectedNodes(ids, linkIds) {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.SELECTED_NODES,
            ids: ids,
            linkIds: linkIds
        });
    }

    startDragCoords(x, y) {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.START_DRAG_COORDS,
            x: x, y: y
        });
    }

    updateDragCoords(x, y) {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.UPDATE_DRAG_COORDS,
            x: x, y: y
        });
    }

    updateDragEnd() {
        AppDispatcher.handleAction({
            actionType: MapFlowConstants.DRAG_END
        });
    }
};

export default new MapFlowActionCreator();
