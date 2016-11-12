/** coord */

function xy(x, y) {
	this.x = x;
	this.y = y;
}

xy.prototype.move = function(tx, ty) {
	this.x = tx;
	this.y = ty;
}

xy.prototype.shift = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

var utility = {}

utility.distance = function(first, second) {
	return Math.sqrt(Math.pow(second.y - first.y, 2) + Math.pow(second.x - first.x, 2));
}

/** grid */

function grid(width, height) {
	this.width = width;
	this.height = height;
	this.area = [];
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			this.area.push({x: x, y: y});
		}
	}
}

grid.prototype.inside = function(cx, cy) {
	return cx >= 0 && cx < this.width &&
		cy >= 0 && cy < this.height;
}

grid.prototype.get = function(cx, cy) {
	if (this.inside(cx, cy))
		return this.area[cx + cy * this.width];
	else
		throw RangeError("coord outside grid");
}

grid.prototype.set = function(cx, cy, content) {
	if (this.inside(cx, cy))
		this.area[cx + cy * this.width] = {x: cx, y: cy, content};
	else
		throw RangeError("coord outside grid");
}

grid.prototype.forEach = function(func) {
	for (let i = 0; i < this.area.length; i++) {
		var value = this.area[i];
		if (value)
			func.call(this, value);
		else
			continue;
	}
};

/** grid tests

var oo = new grid(3,3)
// make 3x3 grid

oo.inside(2,6)
// returns false

oo.inside(1,1)
// returns true

oo.get(2,2)
// returns Object {x: 2, y: 2}

oo.set(2,2, "stuff")
oo.get(2,2)
// returns Object {content: "stuff", x: 2, y: 2}

oo.forEach(function(value) { console.log(value) })
// prints grid area contents

*/

function node(value) {
	this.id = value;
	this.parent = null;
	this.children = [];
}

node.prototype.setParent = function(node) {
	this.parent = node;
}

node.prototype.getParent = function() {
	return this.parent;
}

node.prototype.addChild = function(node) {
	node.setParent(this);
	this.children[this.children.length] = node;
	return this.children[this.children.length - 1];
}

node.prototype.getChildren = function() {
	return this.children;
}

node.prototype.removeChildren = function() {
	this.children = [];
}




//??????


grid.prototype.distance = function(first, second) {
	return Math.sqrt(Math.pow(second.y - first.y, 2) + Math.pow(second.x - first.x, 2));
}




var random = {
	pick: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	roll: function(max) {
		return Math.floor(Math.random() * max);
	},
	shuffle: function(array) {
	  var m = array.length,
			t, i;
	  while (m) {
	    i = Math.floor(Math.random() * m--);
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }
	  return array;
	}
}
