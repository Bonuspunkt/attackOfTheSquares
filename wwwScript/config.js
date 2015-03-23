module.exports = {

  canvas: {
    width: 1280,
    height: 720
  },

  player: {
    size: 16,
    speed: 2.5,
    aimSpeed: 1,
    shootInterval: 500
  },

  rocket: {
    size: 4,
    speed: 5,
    lifetime: 750
  },

  follower: {
    color: { r: 0, g: 180, b: 0 },
    size: 16,
    speed: 2,
    spawnSleep: 500
  },

  whirrer: {
    color: { r: 0, g: 0, b: 180 },
    size: 16,
    speed: 2,
    spawnSleep: 500,
    radius: 30,
    rotationSpeed: 1e-2
  },

  dasher: {
    color: { r: 180, g: 0, b: 0 },
    size: 16,
    vMax: 12,
    spawnSleep: 500,
    chargeTime: 1000,
    dashTime: 750,
    slowdown: 0.9
  },

  spawner: {
    minDistance: 100,
    interval: 750
  },
  gameLogic: {
    bulletDistance: 10,
    playerDistance: 16
  }
};