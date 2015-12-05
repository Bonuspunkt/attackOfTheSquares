var EventEmitter = require('./hna/EventEmitter');
var Vector2 = require('./hna/Vector2');
var util = require('./hna/util');

var config = require('./config');

var SIZE = config.dasher.size;
var VMAX = config.dasher.vMax;
var SPAWN_SLEEP = config.dasher.spawnSleep;
var COLOR = config.dasher.color;
var CHARGE_TIME = config.dasher.chargeTime;
var DASH_TIME = config.dasher.dashTime;
var SLOWDOWN = config.dasher.slowdown;

var STATE_CHARGE = 1;
var STATE_MOVE = 2;

function Dasher(player, position) {
    EventEmitter.call(this);

    this.player = player;
    this.position = position;
}

util.inherits(Dasher, EventEmitter);

Dasher.prototype.update = function(_, timestamp) {
    if (!this.spawn) {
        this.spawn = timestamp;
    }
    this.active = Math.min((timestamp - this.spawn) / SPAWN_SLEEP, 1);
    var cycleTime = (timestamp - this.spawn) % (CHARGE_TIME + DASH_TIME);
    var newState = cycleTime < CHARGE_TIME ? STATE_CHARGE : STATE_MOVE;

    if (newState !== this.state) {
        switch (newState) {
            case STATE_CHARGE:
                this.velocity = Vector2.zero;
                break;
            case STATE_MOVE:
                this.velocity = this.player.position.clone()
                    .substract(this.position).normalize().multiply(VMAX);
                break;
        }
    }
    this.state = newState;

    switch (this.state) {
        case STATE_CHARGE:
            this.colorFactor = 0.2 + 0.8 * cycleTime / DASH_TIME;
            break;
        case STATE_MOVE:
            this.colorFactor = 1 - 0.8 * cycleTime / (CHARGE_TIME + DASH_TIME);
            break;
    }

    if (this.active === 1) {
        this.position.add(this.velocity.multiply(SLOWDOWN));
    }
};

Dasher.prototype.draw = function(context) {

    var color = util.getRGBA(
        Math.round(COLOR.r * this.colorFactor),
        Math.round(COLOR.g * this.colorFactor),
        Math.round(COLOR.b * this.colorFactor),
        this.active || 0);

    context.fillStyle = color;
    context.fillRect(
        this.position.x - SIZE / 2,
        this.position.y - SIZE / 2,
        SIZE, SIZE);
};


module.exports = Dasher;
