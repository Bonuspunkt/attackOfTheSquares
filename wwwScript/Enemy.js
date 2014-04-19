var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');

var config = require('./config');

var SIZE = config.enemy.size;
var SPEED = config.enemy.speed;

function Enemy(player, position) {
  EventEmitter.call(this);

  this.player = player;
  this.position = position;
}

util.inherits(Enemy, EventEmitter);

Enemy.prototype.update = function() {
  var toMove = this.player.position.clone().substract(this.position).normalize();
  this.position.add(toMove.multiply(SPEED));
};

Enemy.prototype.draw = function(context) {
  context.fillStyle = '#0b0';
  context.fillRect(
    this.position.x - SIZE / 2,
    this.position.y - SIZE / 2,
    SIZE, SIZE);
};


module.exports = Enemy;