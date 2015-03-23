var EventEmitter = require('./hna/EventEmitter');
var Vector2 = require('./hna/Vector2');
var util = require('./hna/util');

var Follower = require('./Follower');
var Dasher = require('./Dasher');
var Whirrer = require('./Whirrer');

var config = require('./config');

var CANVAS_WIDTH = config.canvas.width;
var CANVAS_HEIGHT = config.canvas.height;
var INTERVAL = config.spawner.interval;
var MIN_DISTANCE = config.spawner.minDistance;


function Spawner(player) {
  EventEmitter.call(this);

  this.player = player;
}
util.inherits(Spawner, EventEmitter);

Spawner.prototype.lastSpawn = 0;
Spawner.prototype.update = function(_, timestamp) {

  if (this.lastSpawn + INTERVAL > timestamp) { return; }

  var spawn = this.player.position.clone();
  while (spawn.clone().substract(this.player.position).length() < MIN_DISTANCE)  {
    spawn = new Vector2(CANVAS_WIDTH * Math.random(), CANVAS_HEIGHT * Math.random());
  }

  var seed = Math.random();
  var NmyType;
  if (seed < 0.1) {
    NmyType = Whirrer;
  } else if (seed > 0.8) {
    NmyType = Dasher
  } else {
    NmyType = Follower;
  }
  var nmy = new NmyType(this.player, spawn);

  this.emit('spawn', nmy);

  this.lastSpawn = timestamp;
};

module.exports = Spawner;