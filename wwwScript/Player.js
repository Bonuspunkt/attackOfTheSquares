var EventEmitter = require('./hna/EventEmitter');
var util = require('./hna/util');

var Vector2 = require('./hna/Vector2');

var config = require('./config');

var CANVAS_WIDTH = config.canvas.width;
var CANVAS_HEIGHT = config.canvas.height;
var IMAGE_SIZE = config.player.size;
var SPEED = config.player.speed;
var AIM_SPEED = config.player.aimSpeed;
var SHOOT_INTERVAL = config.player.shootInterval;


var img = new Image();
img.src = './player.png';

function getGamepads() {
    return (
        navigator.getGamepads && navigator.getGamepads() ||
        navigator.webkitGetGamepads && navigator.webkitGetGamepads()
    );
}

function Player(index) {
    EventEmitter.call(this);

    this.position = new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.direction = new Vector2(1, 0);
    this.gamepadIndex = index;

    this.lastShot = 0;
}
util.inherits(Player, EventEmitter);

Player.prototype.update = function(timestampDelta, timestamp) {

    var gamepad = getGamepads()[this.gamepadIndex];

    if (!gamepad) {
        return;
    }

    this.aim = gamepad.buttons[6].pressed;

    if (0.15 < gamepad.axes[0] || gamepad.axes[0] < -0.15 ||
        0.15 < gamepad.axes[1] || gamepad.axes[1] < -0.15) {
        var delta = new Vector2(gamepad.axes[0], gamepad.axes[1])
            .multiply(this.aim ? AIM_SPEED : SPEED);
        this.position.add(delta);
    }

    if (0.2 < gamepad.axes[2] || gamepad.axes[2] < -0.2 ||
        0.2 < gamepad.axes[3] || gamepad.axes[3] < -0.2) {
        this.angle = Math.atan2(gamepad.axes[3], gamepad.axes[2]);
        this.direction.x = gamepad.axes[2];
        this.direction.y = gamepad.axes[3];
        this.direction.normalize();
    }

    if (gamepad.buttons[7].pressed && this.canShot(timestamp)) {
        this.emit('shoot');
    }

    // boundary checks
    if (this.position.x < IMAGE_SIZE / 2) {
        this.position.x = IMAGE_SIZE / 2;
    }
    if (this.position.x > CANVAS_WIDTH - IMAGE_SIZE / 2) {
        this.position.x = CANVAS_WIDTH - IMAGE_SIZE / 2;
    }
    if (this.position.y < IMAGE_SIZE / 2) {
        this.position.y = IMAGE_SIZE / 2;
    }
    if (this.position.y > CANVAS_HEIGHT - IMAGE_SIZE / 2) {
        this.position.y = CANVAS_HEIGHT - IMAGE_SIZE / 2;
    }
};

Player.prototype.canShot = function(timestamp) {
    if (this.lastShot < timestamp - SHOOT_INTERVAL) {
        this.lastShot = timestamp;
        return true;
    }
    return false;
};

Player.prototype.draw = function(context) {
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.drawImage(img, -IMAGE_SIZE / 2, -IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
    context.rotate(-this.angle);
    context.translate(-this.position.x, -this.position.y);

    if (this.aim) {
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(
            this.position.x + this.direction.x * 1e6,
            this.position.y + this.direction.y * 1e6);
        context.strokeStyle = 'rgba(255,0,0, 0.25)';
        context.stroke();
        context.closePath();
    }
};


module.exports = Player;
