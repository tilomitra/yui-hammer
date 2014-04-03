/*
Copyright 2013 Yahoo! Inc.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
'use strict';

var HAMMER_GESTURES = [
    'hold',
    'tap',
    'doubletap',
    'drag',
    'dragstart',
    'dragend',
    'dragup',
    'dragdown',
    'dragleft',
    'dragright',
    'swipe',
    'swipeup',
    'swipedown',
    'swipeleft',
    'swiperight',
    'transform',
    'transformstart',
    'transformend',
    'rotate',
    'pinch',
    'pinchin',
    'pinchout',
    'touch',
    'release'
],

eventDef = {
    processArgs: function (args, isDelegate) {
        if (isDelegate) {
            return args.splice(4,1)[0];
        }
        else {
            return args.splice(3,1)[0];
        }
    },
    on: function (node, subscription, notifier) {

        var self = this;
        this._setupHammer(node, subscription);

        // Delegate the gesture event to HammerJS.
        this._hammer.on(this.type, function (ev) {
            self.handleHammerEvent(ev, node, subscription, notifier);
        });
    },

    delegate: function (node, subscription, notifier, filter) {

        var self = this;
        this._setupHammer(node, subscription);

        this._hammer.on(this.type, function (ev) {
            //This is what Y.Event.Delegate runs under the hood to determine if a given `filter` applies to a given `ev.target`.
            if (Y.Selector.test(ev.target, filter, ev.currentTarget)) {
                self.handleHammerEvent(ev, node, subscription, notifier);
            }
        });
    },

    handleHammerEvent: function (ev, node, subscription, notifier) {
        // do event facade normalization here
        notifier.fire(ev);
    },

    _setupHammer: function (node, subscription) {
        var params = subscription._extra;
        this._hammer = node.getData('hammer');

        // start new hammer instance
        if(!this._hammer) {
            this._hammer = new Hammer(node.getDOMNode(), params || {});
            node.setData('hammer', this._hammer);
        }
              // change the options
        else if(this._hammer && params) {
            this._hammer.options = Y.merge(this._hammer.options, params);
        }

        return this._hammer;
    },

    _off: function () {
        this._hammer.off(this.type, this.handleHammerEvent);
    },

    detach: function () {
        this._off();
    },

    detachDelegate: function () {
        this._off();
    }
};

Y.Array.each(HAMMER_GESTURES, function (gesture) {
    Y.Event.define(gesture, eventDef);
});
