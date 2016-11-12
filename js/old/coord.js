/** coordinates */

function XY(x, y) {
	this.x = x;
	this.y = y;
}

XY.prototype.move = function(tx, ty) {
	this.x = tx;
	this.y = ty;
}

XY.prototype.shift = function(dx, dy) {
	this.x = this.x + dx;
	this.y = this.y + dy;
}

export {XY}
