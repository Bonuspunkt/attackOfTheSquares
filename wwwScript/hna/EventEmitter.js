function EventEmitter() {
    this.events = {};
}

EventEmitter.prototype.addEventListener = function(name, fn) {
    name = String(name).toLowerCase();
    this.events[name] = this.events[name] || [];
    this.events[name].push(fn);
};
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;

EventEmitter.prototype.removeEventListener = function(name, fn) {
    name = String(name).toLowerCase();
    var eventHandlers = this.events[name] || [];
    var index = eventHandlers.indexOf(fn);
    if (index === -1) {
        return false;
    }
    eventHandlers.splice(index, 1);
    return true;
};
EventEmitter.prototype.un = EventEmitter.prototype.removeEventListener;
EventEmitter.prototype.off = EventEmitter.prototype.removeEventListener;

EventEmitter.prototype.fireEvent = function(name) {
    name = String(name).toLowerCase();
    var args = [].slice.call(arguments, 1);
    var eventHandlers = (this.events[name] || []).slice();
    eventHandlers.forEach(function(handler) {
        handler.apply(this, args);
    }, this);
};
EventEmitter.prototype.emit = EventEmitter.prototype.fireEvent;

EventEmitter.prototype.once = function(name, fn) {
    name = String(name).toLowerCase();
    var fireAndForget = function() {
        this.un(name, fireAndForget);
        fn.apply(this, arguments);
    }.bind(this);

    this.on(name, fireAndForget);
};

module.exports = EventEmitter;
