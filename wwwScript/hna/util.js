module.exports = {

  inherits: function(constructor, superConstructor) {

    constructor.prototype = Object.create(superConstructor.prototype, {
      constructor: {
        value: constructor,
        writeable: true,
        configurable: true
      }
    });
    
  }

};