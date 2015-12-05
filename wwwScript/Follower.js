var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');

var config = require('./config');

var SIZE = config.follower.size;
var SPEED = config.follower.speed;
var SPAWN_SLEEP = config.follower.spawnSleep;
var COLOR = config.follower.color;

function Follower(player, position) {
    EventEmitter.call(this);

    this.player = player;
    this.position = position;
}

util.inherits(Follower, EventEmitter);

Follower.prototype.update = function(_, timestamp) {
    if (!this.spawn) {
        this.spawn = timestamp;
    }
    this.active = Math.min((timestamp - this.spawn) / SPAWN_SLEEP, 1);
    if (this.active === 1) {
        var toMove = this.player.position.clone().substract(this.position).normalize();
        this.position.add(toMove.multiply(SPEED));
    }
};

Follower.prototype.draw = function(context) {
    context.fillStyle = util.getRGBA(COLOR, this.active || 0);
    context.fillRect(
        this.position.x - SIZE / 2,
        this.position.y - SIZE / 2,
        SIZE, SIZE);
};


module.exports = Follower;
