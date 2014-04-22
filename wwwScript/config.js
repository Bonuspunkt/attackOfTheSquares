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

  enemy: {
    size: 16,
    speed: 2,
    spawnSleep: 500
  },

  spawner: {
    minDistance: 100,
    interval: 750,
    bulletDistance: 10,
    playerDistance: 16
  }

};