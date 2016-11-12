//  .-. .   .-. .-.   .-. . . .-. .-. . . .-.
//  |(  |   | | |(    |-  |\| |..  |  |\| |- 
//  `-' `-' `-' `-'   `-' ' ` `-' `-' ' ` `-'

/*** Style */
function Style(theme) {
	this.width = theme.width;
	this.height = theme.height;
	this.scale = theme.scale;
	this.background = theme.background;
	this.palette = theme.palette;
	(function() {
		var canvas = document.createElement("canvas");
		canvas.id = "display";
		canvas.height = theme.height * theme.scale;
		canvas.width = theme.width * theme.scale;
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(canvas);
	})();
	this.canvas = document.getElementById("display");
	return this;
};

/*** Randomness */
function shuffle(list) {
	return list[Math.floor(Math.random() * list.length)];
};
function roll(max) {
	return Math.floor(Math.random() * max);
};
function rollCoord(max) {
	return new Coord(roll(max.x), roll(max.y));
};

/*** Utilities */
function attenuate(intensity, distance) {
	// turn off Math.floor for smoother but more expensive gradients
	return Math.floor(intensity / distance);
	//return Math.floor(intensity / Math.pow(distance, 2));
	//return Math.floor((1 / Math.pow(distance / intensity + 1, 3)) * intensity);
};

/*** Coord */
function Coord(x, y) {
	this.x = x;
	this.y = y;
	return this;
};
Coord.prototype.shift = function(target) {
	return new Coord(this.x + target.x, this.y + target.y);
};
Coord.prototype.distance = function(target) {
	return Math.sqrt(Math.pow(target.y - this.y, 2) + Math.pow(target.x - this.x, 2));
};

/*** Directions *///
var direction = {
	moore: [
		new Coord(0,-1),//  n
		new Coord(1,-1),//  ne
		new Coord(1,0),//   e
		new Coord(1,1),//   se
		new Coord(0,1),//   s
		new Coord(-1,1),//  sw 
		new Coord(-1,0),//  w
		new Coord(-1,-1)//  nw
	],
	neumann: [
		new Coord(0,-1),//  n
		new Coord(1,0),//   e
		new Coord(0,1),//   s
		new Coord(-1,0)//   w
	],
	quad: [
		new Coord(0,0),// top left
		new Coord(1,0),//  top right
		new Coord(0,1),//   bottom left
		new Coord(1,1)//   bottom right
	]
};
direction.spin = function(start, change, type) {
	var neighborhood = direction.type || direction.moore,
		increment = neighborhood.length;
	return neighborhood[(start + change + increment) % increment];
};

/*** Grid */
function Grid(width, height, area) {
// ## Keeps track of things in one big array with height/width variables to construct 2D grid. ### isInside: checks to see if a coordinate is within the bounds of the grid. ### get: retrieves the content of grid area at given coordinates. ### set: adds content at the grid area given coordinates and content. ### forEach: goes over every grid index and calls a given function. ### filter: goes over every grid index and returns a new grid with only content matching given query. ### select: grabs contents of a grid in an area from top left to bottom right. ### merge: overwrites content of base grid with a given overlay grid. 

// test ground var soupcans = new Grid(5,5); soupcans.set(new Coord(0,1), "whoops"); soupcans.set(new Coord(1,1), "ohai"); soupcans.set(new Coord(2,2), "ohai"); soupcans.set(new Coord(4,4), "yay"); var temp = soupcans.select(new Coord(1,1), new Coord(2,2)).filter("ohai"); var testworld = new Grid(5,5); testworld.set(new Coord(1,0), "*"); testworld.set(new Coord(1,1), "*"); testworld.set(new Coord(4,0), "*"); testworld.set(new Coord(3,4), "*"); var another = new Grid(2,2); another.set(new Coord(0,0), "yep"); another.set(new Coord(0,1), "yep"); //soupcans.merge(testworld); //soupcans.merge(temp, new Coord(1,1));


/**
 * JSDoc style Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
*/

	this.width = width;
	this.height = height;
	this.area = area || new Array(width * height);
	return this;
};
Grid.prototype.isInside = function(coord) {
	return coord.x >= 0 && coord.x < this.width && coord.y >= 0 && coord.y < this.height;
};
Grid.prototype.get = function(coord) {
	if (this.isInside(coord)) {
		return this.area[coord.x + coord.y * this.width];
	} else {
		throw RangeError("Coordinates outside grid");
	}
};
Grid.prototype.set = function(coord, content) {
	if (this.isInside(coord)) {
		return this.area[coord.x + coord.y * this.width] = content;
	} else {
		throw RangeError("Coordinates outside grid");
	}
};
Grid.prototype.forEach = function(action) {
// forEach takes a function and applies that function to the contents of the grid area index. TODO still needs work.
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var index = new Coord(x,y);
			var content = this.area[x + y * this.width],
				updated = action(content, index);
			this.area[x + y * this.width] = updated;
		}
	}
	//return this;
};
Grid.prototype.filter = function(filter) {
// Filter takes an input as a query, looks in grid area contents and returns a new grid with only matching content. Anywhere a match is not found it returns 0. It will return everything in the grid if there is no query specified.
	var selection = [];
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
 			var content = this.get(new Coord(x, y));
			if(!filter || filter && content == filter) {
				selection.push(content);
			}
			if (filter && content != filter) {
				selection.push(0);
			}
		}
	}
	return new Grid(this.width, this.height, selection);
};
Grid.prototype.select = function(start, end) {
// Select takes an ordered pair of coordinates for start and end points, and assumes that the start coordinates are always lower than end coordinates. It returns a new grid in the rectangle between start and end, and copies the contents from that section of the old grid into the new grid.
	var selectWidth = (end.x - start.x) + 1,
		selectHeight = (end.y - start.y) + 1,
		selection = [];
	for (var y = start.y; y < selectHeight + start.y; y++) {
		for (var x = start.x; x < selectWidth + start.x; x++) {
 			var content = this.get(new Coord(x, y));
			if (this.isInside(new Coord(x, y))) {
				selection.push(content);
			}
		}
	}
	return new Grid(selectWidth, selectHeight, selection);
};
Grid.prototype.merge = function(overlay, start) {
// Merge takes an overlay grid and tries to add the contents of that new grid to the current grid, and returns a new combined grid. When there is overlay content it overwrites any old content, and everything else is ignored. Optionally specify a start coordinate to position the top-left corner of the overlay grid relative to the current grid, otherwise it defaults to 0,0.
	var base = new Coord(0, 0),
		start = start || base,
		offset = new Coord(base.x - start.x, base.y - start.y);
	for (var y = start.y; y < overlay.height + start.y; y++) {
		for (var x = start.x; x < overlay.width + start.x; x++) {
			var source = (x + offset.x) + ((y + offset.y) * overlay.width);
				destination = x + y * this.width;
			if (overlay.area[source]) {
				this.area.splice(destination, 1, overlay.area[source]);
			}
		}
	}
	return new Grid(this.width, this.height, this.area);
};
Grid.prototype.render = function(style) {
// Render takes a style object, checks grid area contents against the style's color palette, and renders color blocks to the style's canvas element in the DOM. 
	var c = style.canvas.getContext("2d");
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			c.fillStyle = style.palette(this.get(new Coord(x,y)));
			c.fillRect(x * style.scale, y * style.scale, style.scale, style.scale);
		}
	}
};
Grid.prototype.entities = function() {
// forEach takes a function and applies that function to the contents of the grid area index. TODO still needs work.
	var output = []
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var content = this.area[x + y * this.width];
			if (content) {
				output.push(new Entity(this, new Coord(x,y), content));
			}
		}
	}
	return output;
};
Grid.prototype.update = function(action) {
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var content = this.area[x + y * this.width];
			var update = action(new Cell(this, coord));
			for (var i = 0; i < update.length; i++) {
				this.set(update[i].coord, update[i].content);
			}
		}
	}
	return this;
};

/*** Cell */
function Cell(type, content) {
	this.type = type;
	this.content = content || {};	
	return this; 
};
Cell.prototype.set = function(component, value) {
	this.content[component] = value;
	return this;
};
Cell.prototype.remove = function(component) {
	delete this.content[component];
	return this;
};
Cell.prototype.has = function(component) {
	if (this.content[component]) {
		return this.content[component];
	} else {
		return false;
	}
};

/*** Entity */
function Entity(context, coord, content) {
	this.grid = context;
	this.coord = coord;
	this.index = coord.x + coord.y * context.width;
	this.cell = content || this.grid.get(this.coord);
};
Entity.prototype.neighbors = function() {
	var found = [];
	for (var way = 0; way < direction.length; way++) {
		if (this.look(way)) {
			found.push(this.look(way));
		}
	}
 	return found;
};
Entity.prototype.look = function(way) {
	var target = this.coord.shift(direction.spin(way, 0));
	if (this.context.isInside(target)) {
		return new Entity(this.grid, target);
	} else {
		return false;
	}
};
Entity.prototype.search = function(query) {
	var area = this.neighbors(),
		found = [];
	for (var i = 0; i < area.length; i++) {
		if (!query || area[i].content && area[i].content == query) {
			found.push(area[i]);
		}
	}
	var final = shuffle(found);
	return final;
};
//Entity.prototype.move = function() {};
//Entity.prototype.influence = function() {// do or try to do a thing to a neighbor};

/*** Organism */
function Organism(family, population) {
	this.family = family;
	this.population = population || [];
	// is it something like... foreach on the grid, take every unique type of entity something or other, make an organism of all types
	return this;
};
Organism.prototype.add = function(entity) {
	this.population.push(entity);
	return this;
};
Organism.prototype.filter = function(component) {
	var found = [];
	for (var i = 0; i < this.population.length; i++) {
		if (this.population[i].cell.has(component)) {
			found.push(this.population[i].cell.content[component]);
		} else {
			found.push(0);
		}
	}
	return found;
};
Organism.prototype.attenuate = function (intensity, distance) {
	return (1 / Math.pow(distance / intensity + 1, 2)) * intensity;
};
//Organism.prototype.remove = function(entity) {};
//Organism.prototype.has = function(query) {};
//Organism.prototype.forEach = function() {};
//Organism.prototype.search = function() {};
//Organism.prototype.perimeter = function(target) {};

//
/*** Updates */
function sort(population) {
	// you now have all the power of randomness, coordinates, grids, cells, and entities.
	var org = {}
	for (var i = 0; i < population.length; i++) {
			var kin = population[i].cell.type;
			if (!org[kin]) {
				org[population[i].cell.type] = new Organism(kin).add(population[i]);
			} else {
				org[kin].add(population[i]);
			}
	}
	return org;
}

/*** Actions */
var act = {
	spawn: function() {},
	reset: function() {
	// clear space of all values.
	},
	kill: function() {
	// remove life and type, leave energy
	},
	ferment: function() {
	// add random energy, bounded by  
	},
	decay: function() {
	// subtract a random amount of energy, bounded by available energy
	},
	grow: function() {
	// it takes 2 energy to grow 1 space. check for empty space, expand in von neumann neighborhood. if no room to grow, wait.
	},
	fission: function() {
	// 
	},
	eat: function() {
	// occupy space with food, gain food's energy.
	},
	walk: function() {
	// look at neighborhood. move into random empty space or wait.
	},
	forage: function() {
	// look for food. if no food is around, read the neighborhood. get energy of all empty cells, move to space with highest energy.
	},
	drop: function() {
	// check neighborhood. if there is a clear space, add something??
	},
	gather: function() {
	// look for food. if no food is around, read the neighborhood. get energy of all empty cells, move to space with highest energy.
	},
	assemble: function(kin) {
	// look for members of a type. if none are found, walk. 
	},
	share: function() {
	// give some energy to a neighbor.
	},
	sacrifice: function() {
	// give all energy to a neighbor and reset current space.
	}
};
act.decide = function() {
	// rules go here
	// decisions are a way to search the actions catalog
}

/*** Simulation */
var simulation,
	simRunning = false,
	simTurns = 0,
	sim = function(actions, interval) {
	if (simRunning === false) {
		simulation = setInterval(function() {
			simRunning = true;
			simTurns++;
			actions();
			//var fps = 1000/interval,
			//	seconds = Math.floor(simTurns/(fps));
		}, interval);
	} else {
		return;
	}
};
sim.stop = function() {
	clearInterval(simulation);
	simRunning = false;
};



//  .-. .-. . . .-. .-. .-. .  .
//  `-. |-| |\| |  )|(  | |  )( 
//  `-' ` ' ' ` `-' `-' `-' '  `

/*** Testing ground */

// main theme
var chunky = new Style({
	width: 64,//32
	height: 40,//20
	scale: 8,//10
	background: "rgba(255,0,255,0.2)",
	palette: function(space) {
		if (!space) {
			return this.background;
		} else {
			
			var energy = space.content.energy || 1;
			if (space.type == "@") return "rgba(255,255,0,1)";
			if (space.type == "*") return "rgba(255,255,255,"+energy/255+")";
			if (space.type = "-") return "rgba(0,"+energy+","+energy+",1)";
		}		
	}
});

// main grid
var soupcans = new Grid(chunky.width, chunky.height);

soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("@").set("energy", 1)
);

//soupcans.set(new Coord(0,1), new Cell("*").set("energy", 50).set("life", true));
//soupcans.set(new Coord(4,3), new Cell("*").set("energy", 50));
//soupcans.set(new Coord(12,14), new Cell("*").set("energy", 100));
//soupcans.set(new Coord(11,7), new Cell("*").set("energy", -100));
//soupcans.set(new Coord(24,10), new Cell("*").set("energy", -100));
//soupcans.set(new Coord(22,8), new Cell("*").set("energy", 255));
//soupcans.set(new Coord(22,14), new Cell("-").set("energy", roll(255)));


soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(500))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(800))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(1600))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);

soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", roll(255))
);

soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);
soupcans.set(
	rollCoord(new Coord(chunky.width,chunky.height)),
	new Cell("*").set("energy", -roll(255))
);



// render the first frame for smoother load
soupcans.render(chunky);

// fire off the simulation
sim(function() {
	soupcans.render(chunky);
}, 500);


function falloff() {
	soupcans.forEach(function(cell, origin) {
		var top = sort(soupcans.entities())["*"].population,
				energies = sort(soupcans.entities())["*"].filter("energy");
		if (!cell || cell.type != "*") {
			var calculated = 0;
			for (var i = 0; i < energies.length; i++) {
				calculated += attenuate(energies[i], top[i].coord.distance(origin));
			}
			return new Cell("-").set("energy", Math.floor(calculated))
		} else if (cell.type == "*") {
			return cell;
		}
	});
};

falloff()

// run falloff() for fun render


//soupcans.merge(new Grid(chunky.width,chunky.height))

// make some noise 
//soupcans.forEach(function() { return new Cell("-").set("energy", roll(255)); });


//sort(soupcans.entities());

//sort(soupcans.entities())["*"].population[0].grid.height
//sort(soupcans.entities())["*"].filter("energy")
//sort(soupcans.entities())["*"].filter("energy")
//
//console.log(attenuate(12, new Coord(0,0).distance(new Coord(12,12))))



//update(soupcans.entities())












// THE TIME FOR THESE THINGS
// WILL COME (maybe)
	

/*** Turns */
function Turn() {
	this.step = {};
	return this;
};
Turn.prototype.setStep = function(phase, action) {
	this.step[phase] = action;
	return this;
};
Turn.prototype.advance = function() {
	var phases = Object.keys(this.step);
	for (var i = 0; i < phases.length; i++) {
		if (typeof this.step[phases[i]] === "function") {
			//			either one of these techniques seem to work, but when the called function passes a return, this breaks and throws an undefined?
			
			this.step[phases[i]].call(this);
			//this.step[phases[i]]();
		}
	}
};
function Event() {
	this.stack = [];
}
Event.prototype.add = function() {
	// push to stack
}
Event.prototype.run = function(action) {
	// apply function and pop from stack
}
