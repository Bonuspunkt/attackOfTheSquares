var Game = require('./Game');
var Player = require('./Player');
var Rocket = require('./Rocket');
var Spawner = require('./Spawner');

var config = require('./config');

var Follower = require('./Follower');
var Dasher = require('./Dasher');
var Whirrer = require('./Whirrer');
var ENEMY_TYPES = [Follower, Dasher, Whirrer];
function isEnemy(obj) { return ENEMY_TYPES.some(function(Type){ return obj instanceof Type }); }

// hack for more true random
Math.random = (function(){
  var pool = new Uint16Array(1);

  return function random() {
      crypto.getRandomValues(pool);
      return pool[0] / 65535;
  };

}());


var CANVAS_WIDTH = config.canvas.width;
var CANVAS_HEIGHT = config.canvas.height;

var canvasEl = document.createElement('canvas');
canvasEl.textContent = 'y u no browser with canvas support';
canvasEl.width = CANVAS_WIDTH;
canvasEl.height = CANVAS_HEIGHT;
document.body.appendChild(canvasEl);

var anchorEl = document.createElement('a');
anchorEl.style.display = 'block';
anchorEl.href = '#';
anchorEl.textContent = 'get screenshot';
anchorEl.addEventListener('click', function() {
  this.href = canvasEl.toDataURL();
  this.download = 'screenshot.png';
});
document.body.appendChild(anchorEl);

var game = new Game(canvasEl);

var player = new Player(0);
player.on('shoot', function() { gameLogic.shoot(player); });
game.addComponent(player);

var spawner = new Spawner(player);
spawner.on('spawn', function(obj) { game.addComponent(obj); });
game.addComponent(spawner);


game.start();


var BULLET_DISTANCE = config.gameLogic.bulletDistance;
var PLAYER_DISTANCE = config.gameLogic.playerDistance;

var gameLogic = {
  on: function() {},

  score: 0,
  kills: 0,
  enemyCount: 0,
  bullets: 0,

  shoot: function(player) {
    this.bullets++;
    game.addComponent(new Rocket(player.position, player.direction));
  },

  lastSpawn: 0,
  update: function(_, timestamp) {
    var rockets = game.getComponents(function(cmp) {
      return cmp instanceof Rocket;
    });
    var toDie = game.getComponents(function(cmp) {
      return isEnemy(cmp) &&
      rockets.some(function(r) {
        var distance = r.position.clone().substract(cmp.position).length();
        return distance < BULLET_DISTANCE;
      });
    });
    if (toDie.length) {
      this.kills += toDie.length;
      this.score += toDie.map(function(cmp) {
        if (cmp instanceof Whirrer) { return 5; }
        if (cmp instanceof Dasher) { return 3; }
        return 1;
      }).reduce(function(prev, curr) {
        return prev + curr;
      }, 0) * this.kills / this.bullets;
      toDie.forEach(function(c){ c.emit('dead'); });
    }


    var hits = game.getComponents(function(cmp) {
      return isEnemy(cmp)
        && cmp.position.clone().substract(player.position).length() < PLAYER_DISTANCE;
    });

    if (hits.length > 0) {
      game.stop();
    }

    this.enemyCount = game.getComponents(function(c){
      return isEnemy(c);
    }).length;

  },

  draw: function(context) {
      context.textAlign = 'center';

      var stats = this.kills + ' kills - shots ' + this.bullets;
      context.font = '24pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .1)';
      context.fillText(stats, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 220);

      var score = this.score | 0;
      context.font = '172pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .25)';
      context.fillText(score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);


      var efficency = 'efficency: ' + (Math.round(100 * this.kills / this.bullets) || 0) + '%';
      context.font = '32pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .15)';
      context.fillText(efficency, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);

      var enemyCount = this.enemyCount + ' enemies detected'
      context.font = '64pt Consolas';
      context.fillStyle = 'rgba(0,0,0, .2)';
      context.fillText(enemyCount, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200)
  }
};

game.addComponent(gameLogic);