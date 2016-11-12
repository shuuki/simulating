


// vector library


function Vector(x, y, z)
{
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector.prototype.length = function()
{
	var length;
	length =  Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	return length;
}

Vector.prototype.add = function(v)
{
  var vNew = new Vector;
  vNew.x = this.x + v.x;
  vNew.y = this.y + v.y;
  vNew.z = this.z + v.z;
  return vNew;
}

Vector.prototype.subtract = function(v)
{
  var vNew = new Vector;
  vNew.x = this.x - v.x;
  vNew.y = this.y - v.y;
  vNew.z = this.z - v.z;
  return vNew;
}

Vector.prototype.multiply = function(s)
{
  var vNew = new Vector;
  vNew.x = this.x * s;
  vNew.y = this.y * s;
  vNew.z = this.z * s;
  return vNew;
}

Vector.prototype.divide = function(s)
{
  var vNew = new Vector;
  vNew.x = this.x / s;
  vNew.y = this.y / s;
  vNew.z = this.z / s;
  return vNew;
}

Vector.prototype.normal = function()
{
  var normal = new Vector(this.x, this.y, this.z);
  normal = normal.divide(normal.length())
  return normal;
}

Vector.prototype.cross = function(v)
{
  var cross = new Vector;
  cross.x = this.y * v.z - this.z * v.y;
  cross.y = this.z * v.x - this.x * v.z;
  cross.z = this.x * v.y - this.y * v.x;
  return cross;
}
