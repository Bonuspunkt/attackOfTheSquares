module.exports = {

    inherits: function(constructor, superConstructor) {

        constructor.prototype = Object.create(superConstructor.prototype, {
            constructor: {
                value: constructor,
                writeable: true,
                configurable: true
            }
        });

    },

    getRGBA: function() {
        var color, alpha;
        if (typeof arguments[0] === 'object') {
            color = arguments[0];
            alpha = arguments[1];
        } else {
            color = {
                r: arguments[0],
                b: arguments[1],
                g: arguments[2]
            };
            alpha = arguments[3];
        }
        return [
            'rgba(',
            color.r || 0, ',',
            color.g || 0, ',',
            color.b || 0, ',',
            alpha, ')'
        ].join('');
    }

};
