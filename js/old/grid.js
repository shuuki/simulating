
/** grid */

function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.area = [];
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			this.area.push({x: x, y: y});
		}
	}
}

Grid.prototype.inside = function(cx, cy) {
	return cx >= 0 && cx < this.width &&
		cy >= 0 && cy < this.height;
}

Grid.prototype.get = function(cx, cy) {
	if (this.inside(cx, cy))
		return this.area[cx + cy * this.width];
	else
		throw RangeError("coord outside grid");
}

Grid.prototype.set = function(cx, cy, content) {
	if (this.inside(cx, cy))
		this.area[cx + cy * this.width] = {x: cx, y: cy, content};
	else
		throw RangeError("coord outside grid");
}

Grid.prototype.forEach = function(func) {
	for (let i = 0; i < this.area.length; i++) {
		var value = this.area[i];
		if (value)
			func.call(this, value);
		else
			continue;
	}
}

export {Grid}

/** grid tests

var oo = new Grid(3,3)
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
