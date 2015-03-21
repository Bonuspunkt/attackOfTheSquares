var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');
var Vector2 = require('./hna/Vector2');

var config = require('./config');

var SIZE = config.whirrer.size;
var SPEED = config.whirrer.speed;
var SPAWN_SLEEP = config.whirrer.spawnSleep;
var COLOR = config.whirrer.color;
var RADIUS = config.whirrer.radius;
var ROTATION_SPEED = config.whirrer.rotationSpeed

function Whirrer(player, position) {
  EventEmitter.call(this);

  this.player = player;
  this.basePosition = position;
  var offset = this.basePosition.clone()
    .substract(this.player.position)
    .normalize()
    .multiply(RADIUS);
  this.rotation = 1;
  this.position = this.basePosition.add(offset);
}

util.inherits(Whirrer, EventEmitter);

Whirrer.prototype.update = function(_, timestamp) {
  if (!this.spawn) {
    this.spawn = timestamp;
  }
  this.active = Math.min((timestamp - this.spawn) / SPAWN_SLEEP, 1);
  if (this.active === 1) {
    var toMove = this.player.position.clone()
      .substract(this.position).normalize();
    this.basePosition.add(toMove.multiply(SPEED));
    this.rotation = (timestamp - this.spawn) * ROTATION_SPEED;
    var offset = new Vector2(Math.sin(this.rotation), Math.cos(this.rotation))
      .multiply(RADIUS);
    this.position = this.basePosition.clone().add(offset);
  }
};

Whirrer.prototype.draw = function(context) {
  context.fillStyle = util.getRGBA(COLOR, this.active || 0);
  context.fillRect(
    this.position.x - SIZE / 2,
    this.position.y - SIZE / 2,
    SIZE, SIZE);
};


module.exports = Whirrer;