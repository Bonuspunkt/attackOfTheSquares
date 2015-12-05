var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');
var config = require('./config');

var ROCKET_SIZE = config.rocket.size;
var SPEED = config.rocket.speed;
var LIFETIME = config.rocket.lifetime;

function Rocket(position, direction) {
    EventEmitter.call(this);

    this.position = position.clone();
    this.move = direction.clone().multiply(SPEED);
}

util.inherits(Rocket, EventEmitter);

Rocket.prototype.update = function(timestampDelta, timestamp) {
    if (!this.start) {
        this.start = timestamp;
    }

    if (timestamp - this.start > LIFETIME) {
        this.emit('dead');
    } else {
        this.position.add(this.move);
    }
};

Rocket.prototype.draw = function(context) {
    if (this.explode) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
        context.fillStyle = '#f00';
        context.fill();
        context.closePath();
    } else {
        context.fillStyle = '#f00';
        context.fillRect(
            this.position.x - ROCKET_SIZE / 2,
            this.position.y - ROCKET_SIZE / 2,
            ROCKET_SIZE, ROCKET_SIZE);
    }
};

module.exports = Rocket;
