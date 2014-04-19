var Game = require('./Game');
var Player = require('./Player');
var Enemy = require('./Enemy');
var Rocket = require('./Rocket');

var Vector2 = require('./hna/Vector2');

var config = require('./config');

var CANVAS_WIDTH = config.canvas.width;
var CANVAS_HEIGHT = config.canvas.height;

var canvasEl = document.createElement('canvas');
canvasEl.textContent = 'y u no browser with canvas support';
canvasEl.width = CANVAS_WIDTH;
canvasEl.height = CANVAS_HEIGHT;
document.body.appendChild(canvasEl);

var player = new Player(0);

var game = new Game(canvasEl);
game.addComponent(player);
game.start();


player.on('shoot', function() { spawner.shoot(); });


var MIN_DISTANCE = config.spawner.minDistance;
var INTERVAL = config.spawner.interval;
var BULLET_DISTANCE = config.spawner.bulletDistance;
var PLAYER_DISTANCE = config.spawner.playerDistance;

var spawner = {
  on:function() {},

  score: 0,
  enemyCount: 0,
  bullets: 0,

  shoot: function() {
    this.bullets++;
    game.addComponent(new Rocket(player.position, player.direction));
  },

  lastSpawn: 0,
  update: function(_, timestamp) {
    if (this.lastSpawn + INTERVAL < timestamp) {

      var spawn = player.position.clone();
      while (spawn.clone().substract(player.position).length() < MIN_DISTANCE)  {
        spawn = new Vector2(CANVAS_WIDTH * Math.random(), CANVAS_HEIGHT * Math.random());
      }

      var nmy = new Enemy(player, spawn);

      game.addComponent(nmy)

      this.lastSpawn = timestamp;
    }

    var rockets = game.getComponents(function(cmp) {
      return cmp instanceof Rocket;
    });
    var toDie = game.getComponents(function(cmp) {
      return cmp instanceof Enemy && rockets.some(function(r) {
        var distance = r.position.clone().substract(cmp.position).length();
        return r.position.clone().substract(cmp.position).length() < BULLET_DISTANCE;
      });
    });
    this.score += toDie.length;
    toDie.forEach(function(c){ c.emit('dead'); });


    var hits = game.getComponents(function(cmp) {
      return cmp instanceof Enemy && cmp.position.clone().substract(player.position).length() < PLAYER_DISTANCE;
    });

    if (hits.length > 0) {
      game.stop();
    }

    this.enemyCount = game.getComponents(function(c){ return c instanceof Enemy }).length;

  },

  draw: function(context) {
      context.textAlign = 'center';

      context.font = '172pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .2)';
      context.fillText(this.score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

      context.font = '64pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .15)';
      context.fillText(this.enemyCount, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

      context.font = '32pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .1)';
      var efficency = Math.round(100 * this.score / this.bullets) || 0;
      context.fillText('efficency: ' + efficency + '%', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 130);
  }
};

game.addComponent(spawner);