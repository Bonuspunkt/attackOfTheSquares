function Vector2(x, y) {
    if (typeof y === 'undefined') {
        y = x;
    }

    this.x = x;
    this.y = y;
}

Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
};

Vector2.prototype.distance = function(vector) {
    return Math.sqrt(this.distanceSquared(vector));
};

Vector2.prototype.distanceSquared = function(vector) {
    return this.substract(vector).lengthSquared();
};

Vector2.prototype.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
};

Vector2.prototype.equals = function(vector) {
    return this.x === vector.x && this.y === vector.y;
};

Vector2.prototype.length = function() {
    return Math.sqrt(this.lengthSquared());
};

Vector2.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y;
};

Vector2.prototype.max = function(max) {
    return new Vector2(
        (this.x > max.x) ? this.x : max.x, (this.y > max.y) ? this.y : max.y
    );
};

Vector2.prototype.min = function(min) {
    return new Vector2(
        (this.x < min.x) ? this.x : min.x, (this.y < min.y) ? this.y : min.y
    );
};

Vector2.prototype.multiply = function(vector) {
    if (typeof vector === 'number') {
        this.x *= vector;
        this.y *= vector;
    } else {
        this.x += vector.x;
        this.y += vector.y;
    }
    return this;
};

Vector2.prototype.negate = function() {
    this.x *= -1;
    this.y *= -1;
    return this;
};

Vector2.prototype.normalize = function() {
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
};

Vector2.prototype.substract = function(vector) {
    this.add(vector.clone().multiply(-1));
    return this;
};


Vector2.prototype.clone = function() {
    return new Vector2(this.x, this.y);
};

Object.defineProperties(Vector2, {
    one: {
        get: function() {
            return new Vector2(1, 1);
        }
    },
    zero: {
        get: function() {
            return new Vector2(0, 0);
        }
    },
    unitX: {
        get: function() {
            return new Vector2(1, 0);
        }
    },
    unitY: {
        get: function() {
            return new Vector2(0, 1);
        }
    }
});

module.exports = Vector2;
