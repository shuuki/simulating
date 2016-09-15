/** event listeners */

// load events

window.addEventListener('load', function()
{
	Sim.test();
	Sim.init({id: 'display', width: 320, height: 200}, flatland);
	Sim.start();
}, false);

// keyboard events

window.addEventListener('keyup', function(event)
{
	Sim.input.keyUp(event);
}, false);

window.addEventListener('keydown', function(event)
{
	Sim.input.keyDown(event);
	//console.log(event.keyCode)
	//console.log(Sim.input.active)
}, false);

// mouse events

window.addEventListener('click', function()
{
	//console.log(event.type, event.pageX, event.pageY)
}, false);

window.addEventListener('mouseup', function()
{
  Sim.input.mouseUp(event)
  //console.log(event.type, event.x, event.y)
}, false);

window.addEventListener('mousedown', function()
{
	Sim.input.mouseDown(event)
	//console.log(event.type, event.x, event.y)
	//console.log(Sim.input.active)
}, false);



/** the simulation */

var Sim = {
	// proof of life
	test: function()
	{
		console.log('Sim ready.');
	},
	// first steps
	// initialize canvas
	init: function(viewport, seed)
	{
		// start the clock
		this.time = 0;
		this.running = null;

		// set up canvas
		var canvas = document.createElement('canvas');
		canvas.id = viewport.id;
		canvas.width = viewport.width;
		canvas.height = viewport.height;

		// only add canvas to body if one is not already present
		if (!document.getElementById(viewport.id))
		{
			document.getElementsByTagName('body')[0].appendChild(canvas);
		}
		// for later: make this delete any existing canvas and replace

		// declare entities to simulate
		this.seed = seed || {};

		// attach canvas to Sim
		this.canvas = document.getElementById(viewport.id);
		this.context = this.canvas.getContext('2d');
	},
	start: function()
	{
		if (!this.running)
		{
			this.update();
		}
	},
	stop: function()
	{
		window.cancelAnimationFrame(this.running);
		this.running = null;
	},
	// update
	// main loop heartbeat
	update: function()
	{
		// start the next frame
		this.running = requestAnimationFrame(this.update.bind(this));

		// update clock
		var now = new Date().getTime();
		this.delta = (now - (this.time || now));
		this.time = now;

		// update entities with delta
		//this.entities.updateAll(this.delta);

		// render scene
		this.render();
	},

	render: function() {
		// clear frame
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.moveTo(0, 0);
		this.context.beginPath()

		// add some debug text
		var debug = this.time + ' ' + (1000 / this.delta).toFixed(0) + 'fps';
		this.context.font = '12px monospace';
		this.context.fillStyle = 'gray';
		this.context.fillText(debug, 12, 12);

		// render entities
		//this.entities.drawAll(this.context);

		// close out drawing
		this.context.fill();
		this.context.stroke();
		this.context.closePath();
	},
	/***
	*/
	save: function()
	{
		this.cache =
		{
			// add sim state values here for save/load
			//scene: this.scene,
			time: this.time
		};
		localStorage.setItem('SimSave', JSON.stringify(this.cache));
	},
	load: function()
	{
		if (localStorage.getItem('SimSave'))
		{
			this.cache = JSON.parse(localStorage.getItem('SimSave'));
		}
	},
	reset: function() {
		// clear cache
		if (this.cache) {
			this.cache = null;
		}
		// remove locally stored data if present
		if (localStorage.getItem('SimSave')) {
			localStorage.removeItem('SimSave');
		}
	},
  /*** input control
  * receives data from event listeners
  * recognizes keyboard and mouse (for now)
  * current events available at Sim.input.active
  * many keyboard buttons named for easy use
  * adds mouse coordinates on mousedown
  * clears mouse coordinates on mouseup
  */
	input: {
		// cache of keys currently active
		active: {},

		// index of tracked keys
		BACKSPACE: 8,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		Q: 81,
		W: 87,
		E: 69,
		A: 65,
		S: 83,
		D: 68,
		SPACE: 32,
		ENTER: 13,
		SHIFT: 16,

		// track key states
		isDown: function(keyCode)
    {
			return this.active[keyCode];
		},
		keyDown: function(event)
    {
			this.active[event.keyCode] = true;
		},
		keyUp: function(event)
    {
			delete this.active[event.keyCode];
		},

    // track mouse states
    mouseDown: function(event)
    {
      this.active['mousedown'] = {x: event.x, y: event.y};
    },
    mouseUp: function(event)
    {
      delete this.active['mousedown'];
    }
	},
  /** scene */
  entities: {
    
    // entities being simulated
    active: {},

		create: function(id, values)
		{
			this.active[id] = values;
		},
		destroy: function(id)
		{
			delete this.active[id];
		},		
		update: function(id, args)
		{
      this.active[id].update(args)
    },
		updateAll: function(delta)
		{
			//foreach active id 
			//this.active[id].update(delta);
		},
		draw: function(id, args)
		{
			this.active[id].draw(args)
		},
		drawAll: function(context) {
			//foreach active id 
			//this.active[id].draw(context);
		},

		stage: {},
    entities: {},
		views: {},

		// view entity needs what values?
		/*
		var view = {
		  width: 320,
		  height: 200,
		  x: 120,
		  y: 100,
		  aspect: 1.6 || (this.width / this.height)
		}
		*/
  }
}

// utilities
// provides useful tools and math
// stores pi for faster calculations
// degree / radian converter
// randomness inspired by dice and cards
Sim.util = {
	// cache pi for speed
	pi: Math.PI,
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
	// roll a random whole number between 0 and a maximum
	roll: function(max)
	{
		return Math.floor(Math.random() * max);
	},
	// pick a random element from an array
	pick: function(list)
	{
		return list[Math.floor(Math.random() * list.length)];
	},
	// shuffle
	// from mike bostock via frankmitchell.org/2015/01/fisher-yates
	shuffle: function(list)
	{
		var m = list.length,
			t, i;
		// while there are elements to shuffle...
		while (m)
		{
			// pick a remaining element...
			i = Math.floor(Math.random() * m--);
			// and swap it with the current element
			t = list[m];
			list[m] = list[i];
			list[i] = t;
		}
		return list;
	}
}

// geometry
// mostly untested
// ported from QUANWOYO TRIANGLES
Sim.geom =
{
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



/** seeds */

var flatland =
{
	test: 'working'
}
