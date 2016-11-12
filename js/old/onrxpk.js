var settings = {
		refresh: 40
}

var style = {
	width: 32,
	height: 20,
	scale: 16,
	background: "rgba(255,0,255,0.2)",
	figure: function(cell) {
		if (cell.type == "0") { return "rgba(28,28,45,0.5)"; }
		if (cell.type == "X") { return "rgba(0,0,0,0.5)"; }
		if (cell.type == "*" && cell.subtype == undefined ) { return "rgba(0,"+cell.energy*8+","+cell.energy*4+",1)"; }
		if (cell.type == "*" && cell.subtype == "poison") { return "rgba("+(-cell.energy)*8+",0,0,1)" }
		if (cell.type == "@") { return "rgba(255,255,0,1)"; }
	}
}

/**********************************/

function canvas(theme) {
	var canvas = document.createElement("canvas");
	canvas.id = "blob";
	canvas.height = theme.height * theme.scale;
	canvas.width = theme.width * theme.scale;
	var body = document.getElementsByTagName("body")[0];
	return body.appendChild(canvas);
} canvas(style);

/**********************************/

function roll(count) {
	return Math.floor(Math.random() * count);
}

function shuffle(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**********************************/

function Space(x,y) {
	this.x = x;
	this.y = y;
	return this;
}
Space.prototype.vector = function(other) {
	return new Space(this.x + other.x, this.y + other.y);
}

/**********************************/

var direction = [
	new Space(0,-1),//  n
	new Space(1,-1),//  ne
	new Space(1,0),//   e
	new Space(1,1),//   se
	new Space(0,1),//   s
	new Space(-1,1),//  sw 
	new Space(-1,0),//  w
	new Space(-1,-1)// nw
]
 
function rotate(start, change) {
	var index = direction.indexOf(start);
	return direction[(index + change + 8) % 8];
}

/**********************************/

function Entity(type, energy, life, subtype, acted) {
	this.type = type;
	this.energy = energy;
	this.life = life || false;
	this.subtype = subtype || null;
	this.acted = acted || false;
	return this;
}

/**********************************/

function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.map = new Array(height);
	for (var row = 0; row < height; row++) {
		this.map[row] = new Array(width)
	}
	return this;
}
Grid.prototype.set = function(space, value) {
	return this.map[space.y][space.x] = value;
}
Grid.prototype.get = function(space) {
	return this.map[space.y][space.x];
}
Grid.prototype.interior = function(space) {
	if (space.x < 0 || space.x >= this.width || space.y < 0 || space.y >= this.height ) { return false; } else { return true; }
}
Grid.prototype.render = function(theme) {
	var canvas = document.getElementById("blob");
	var c = canvas.getContext("2d");
	for (var y = 0; y < this.map.length; y++) {
		for (var x = 0; x < this.map[0].length; x++) {
			var block = this.get(new Space(x,y));
			if (block != undefined) {
				c.fillStyle = theme.figure(block);
			} else {
				c.fillStyle = theme.background;
			}
			c.fillRect(x * theme.scale, y * theme.scale, theme.scale, theme.scale);
		}
	}
}
Grid.prototype.update = function(action) {
	for (var row = 0; row < this.map.length; row++) {
		for (var col = 0; col < this.map[0].length; col++) {
			var coord = new Space(col,row);
			var here = new Cell(this, coord);
			var update = action(here);
			for (var i = 0; i < update.length; i++) {
				this.set(update[i].coord, update[i].content);
			}
		}
	}
	return this;
}
// grid.prototype.area = function() { // get a region of the grid }

/**********************************/

function Cell(grid, coord, content) {
	this.grid = grid;
	this.coord = coord;
	this.content = content || this.grid.get(coord);
	return this;
}
Cell.prototype.look = function(way) {
	var target = this.coord.vector(direction[way]);
	if (this.grid.interior(target)) {
		return new Cell(this.grid, target);
	} else {
		return false;
	}
}
Cell.prototype.neighborhood = function() {
	var found = [];
	for (var way = 0; way < direction.length; way++) {
		if (this.look(way)) {
			found.push(this.look(way));
		}
	}
 	return found;
}
Cell.prototype.search = function(query) {
	// check neighborhood for something specific
	var area = this.neighborhood(), found = [];
	for (var i = 0; i < area.length; i++) {
		if (!query || area[i].content && area[i].content.type == query) {
			found.push(area[i]);
		}
	}
	var final = shuffle(found);
	return final;
}
// cell.prototype.move = function(way) { // vacate current space and occupy a different space}
// cell.prototype.expand = function(way) { // add to adjacent spaces }
// cell.prototype.perimeter = function() { // find edges of connected space }
// cell.prototype.attenuate = function() { // calculate falloff over a given area }
/*
attenuation:
start with an array of cells
for each cell on the grid
	calculate distance to every cell in starting array
		perform attenuation and add all values together
			output becomes new energy value on the grid cell
*/

/**********************************/

function rules(cell) {
	var update = [];
	if (! cell.content) {
		// empty spaces become ground
		cell.content = new Entity("0", 0, false, null, false);
		update.push(cell);
		return update;
	}
	if (cell.content) {
		if (cell.content.life == true) {
			// constant chance of death
			if (roll(10000) > 9998) {
				cell.content = new Entity("0", 0, false, undefined, false);
			}
		}
		if (cell.content.type == "0") {
			// ground
			// chance to spawn alga
			if (roll(2000) > 1998) {
				cell.content = new Entity("*", 1, true, undefined, false);
			}
		}
		if (cell.content.type == "X") {
			// wall
		}
		if (cell.content.type == "*") {
			// alga
			if (roll(20) < 9) {
				// ferment
				cell.content.energy += roll(3);
			}
			if (roll(20) < 6) {
				// decay
				cell.content.energy -= roll(4);
				if (cell.content.energy < 0) {
					cell.content.subtype = "poison";
				}
			}
			/*
			if (cell.content.energy > 24 && (cell.content.energy + 25) % 25 == 0 ) {
				// grow
				var empty = cell.search("0");
				if (empty) {
					console.log("grow!")
				} else {
					console.log("can't grow!")
				}
			}
			*/
			if (cell.content.energy <= 0 && cell.content.subtype != "poison" || cell.content.energy >= 0 && cell.content.subtype == "poison") {
				// reset
				cell.content = new Entity("0", 0, false, null, false);
			}
		}
		if (cell.content.type == "@") {
			// blob
			if (cell.content.subtype == "spore") {
				var open = cell.search("0");
				if (open) {
					// move
				}
				var food = cell.search("*");
				if (food) {
					// eat
				}
			}
			/*
			if (cell.content.subtype == "grower") {
				if (cell.content.energy <= 5) {
					// assemble
				}
				if (cell.content.energy > 5) {
					// fission
				}
			}
			if (cell.content.subtype == "stalk") {}
			if (cell.content.subtype == "bloom") {}
			*/
		}
	}
	update.push(cell);
	return update;
}

/**********************************/

var blobland = new Grid(style.width, style.height);
//blobland.set(new Space(15,6), new Entity("X"))
//blobland.set(new Space(0,1), new Entity("X"))
//blobland.set(new Space(7,5), new Entity("X"))
blobland.set(new Space(7,4), new Entity("@", 1, true, "spore", false))
//blobland.set(new Space(6,3), new Entity("*", 1))
//blobland.set(new Space(2,8), new Entity("*", 1))
blobland.render(style)

/**********************************/

var log = document.getElementById("log");

var simulation, running = false, turns = 0;

var sim = function(interval) {
	if (running == false) {
		simulation = setInterval(sim.steps, interval);
	} else {
		return;
	}
}
sim.steps = function() {
	blobland.render(style);
	blobland.update(rules);
	sim.counter();
	running = true;
}
sim.stop = function() {
	clearInterval(simulation);
	running = false;
}
sim.counter = function() {
	turns++;
	var fps = 1000/settings.refresh;
	var seconds = Math.floor(turns/(fps));
	log.innerHTML = seconds;
}
sim(40);
