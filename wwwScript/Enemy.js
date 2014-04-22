var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');

var config = require('./config');

var SIZE = config.enemy.size;
var SPEED = config.enemy.speed;
var SPAWN_SLEEP = config.enemy.spawnSleep;

function Enemy(player, position) {
  EventEmitter.call(this);

  this.player = player;
  this.position = position;
}

util.inherits(Enemy, EventEmitter);

Enemy.prototype.update = function(_, timestamp) {
  if (!this.spawn) {
    this.spawn = timestamp;
  }
  this.active = Math.min((timestamp - this.spawn) / SPAWN_SLEEP, 1);
  if (this.active === 1) {
    var toMove = this.player.position.clone().substract(this.position).normalize();
    this.position.add(toMove.multiply(SPEED));
  }
};

Enemy.prototype.draw = function(context) {
  context.fillStyle = 'rgba(0, 180, 0, ' + (this.active || 0) + ')';
  context.fillRect(
    this.position.x - SIZE / 2,
    this.position.y - SIZE / 2,
    SIZE, SIZE);
};


module.exports = Enemy;