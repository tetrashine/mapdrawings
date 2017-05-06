export default class Base {
    constructor() {
        //Bind all function to object itself
        Object
        .getOwnPropertyNames(this)
        .filter((p) => {
            return typeof this[p] === 'function';
        })
        .forEach(fn => {
            this[fn] = this[fn].bind(this);
        })
    }
}
