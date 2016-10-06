/** geometry */

// mostly untested drawing tools
// ported from QUANWOYO TRIANGLES

sim.geom = {
	// distance calculation
	// takes start and target coordinates
	// returns distance between points
	// console.log(distance(0,0,1,1))
	distance: function(startY, startX, targetY, targetX)
	{
		var distance = Math.sqrt(Math.pow(targetY - startY, 2) + Math.pow(targetX - startX,2));
		return distance;
	},
	// line 
	// raycasting using bresenham's line
	// takes start and target coordinates
	// returns array of steps from start to target
	// console.log(line(0,0,3,2))
	line: function (startY, startX, targetY, targetX)
	{
		var sequence = [];
		var dx = Math.abs(targetX - startX);
		var dy = Math.abs(targetY - startY);
		var sx = (startX < targetX) ? 1 : -1;
		var sy = (startY < targetY) ? 1 : -1;
		var err = dx - dy;
		while(true)
		{
			sequence.push([startY, startX]);
			if((startX == targetX) && (startY == targetY))
			{
				break;
			}
			var e2 = 2 * err;
			if (e2 >-dy)
			{
				err -= dy;
				startX  += sx;
			}
			if (e2 < dx)
			{
				err += dx;
				startY  += sy;
			}
		}
		return sequence;
	},
	// triangle meshes
	// uses delaunay triangulation
	// takes array of vertices
	// returns array of indices of the input array
	// use as triangle edges
	triangulate: function(list)
	{
		var points = [], mesh = [], lines = [];
		points = Delaunay.triangulate(list);
		//
		for(var i = 0; i < points.length; i++) {
			var vertex = points[i];
			mesh.push(list[vertex]);
		}
		//
		for(var l = 0; l < mesh.length-1; l++)
		{
			var edge = [];
			if(l < mesh.length-2)
			{
				edge = line(mesh[l][0], mesh[l][1], mesh[l+1][0], mesh[l+1][1]);}
			else
			{
				edge = line(mesh[l][0], mesh[l][1], mesh[0][0], mesh[0][1]);
			}
			lines.push(edge);
		}
		return lines;
	},
	// spirals
	// takes start coordinates and intended dimensions
	// returns array of steps from start space to finished spiral
	// console.log(spiral(0, 0, 3, 5))
	spiral: function (y, x, height, width)
	{
		var sequence = [];
		var delta = [0, -1];
		for(var i = Math.pow(Math.max(width, height), 2); i > 0; i--)
		{
			if((-height / 2 < y && y <= height / 2) && (-width / 2 < x && x <= width / 2))
			{
				sequence.push([y, x]);
			}
			if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y))
			{
				// change direction
				delta = [-delta[1], delta[0]];
			}
			x += delta[0];
			y += delta[1];
		}
		return sequence;
	}
}
