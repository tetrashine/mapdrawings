import React from 'react';
import ReactDom from 'react-dom';

export default class Base extends React.Component {

    constructor() {
        super();
        //Bind all function to object itself
        let funcKeys = [];

        for (let key in this) {
            if (typeof this[key] === 'function') {
                funcKeys.push(key);
            }
        }

        funcKeys.forEach(fnKey => {
            this[fnKey] = this[fnKey].bind(this);
        })
    }
}
