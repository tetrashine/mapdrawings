import { EventEmitter } from 'events';
import AppDispatcher from 'dispatcher/appdispatcher';


const _CHANGE = 'change'

export default class BaseStore extends EventEmitter {
    // Emit Change event
    emitChange() {
        this.emit(_CHANGE);
    }

    // Add change listener
    addChangeListener(callback) {
        this.on(_CHANGE, callback);
    }

    // Remove change listener
    removeChangeListener(callback) {
        this.removeListener(_CHANGE, callback);
    }
}
