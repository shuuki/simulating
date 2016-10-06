/** utilities */

// provides useful tools and math
// store pi for faster calculations
// degree / radian converter
// some trig

sim.util = {
	// cache pi for speed
	pi: 3.141592653589793,
	// convert degrees to radians
	degToRad: function(degrees)
	{
		return degrees * (this.pi / 180);
	},
	// convert radians to degrees
	radToDeg: function(radians)
	{
		return radians * (180 / this.pi);
	},
	// calculate angle between two points
	boop: function(x1, y1, x2, y2)
	{
		return Math.atan2(y2 - y1, x2 - x1) * 180 / this.pi + 180;
	}
}
