function Game(canvasEl) {
  var components = [];

  var context = canvasEl.getContext('2d');

  this.addComponent = function addComponent(component) {
    component.on('dead', function() {
      this.removeComponent(component);
    }.bind(this));
    components.push(component);
  };
  this.removeComponent = function removeComponent(component) {
    var index = components.indexOf(component);
    component = components.splice(index, 1);
  };

  var lastTimestamp = 0;
  
  this.run = function run(timestamp) {
    var timestampDelta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    components.forEach(function(cmp) {
      cmp.update(timestampDelta, timestamp);
    });

    context.clearRect(0,0, canvasEl.width, canvasEl.height);
    components.forEach(function(cmp) {
      cmp.draw && cmp.draw(context);
    });

    if (running) {
      requestAnimationFrame(run);
    }
  };

  this.getComponents = function(fn) {
    return components.filter(fn);
  };

  var running = false;
  this.start = function() {
    running = true;
    requestAnimationFrame(this.run);
  };

  this.stop = function() {
    running = false;
  }
}


module.exports = Game;