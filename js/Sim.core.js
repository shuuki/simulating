/** the simulation */

// core code required to run a basic sim
// canvas rendering 
// start / stop running updates
// save / load with localstorage
// track scene elements and entities

var Sim = {
	// proof of life
	test: function()
	{
		console.log('Sim ready');
	},
	// first steps
	// takes an object with starting values
	init: function(settings)
	{
		// reset the clock
		this.time = {
			delta: 0,
			now: 0,
			up: 0,
			running: false
		}

		// default settings
		var fallback = {
			id: 'display',
			width: 480,
			height: 300,
			seed: {}
		}

		// initialize canvas
		var canvas = document.createElement('canvas');
		canvas.id = settings.id || fallback.id;
		canvas.width = settings.width || fallback.width;
		canvas.height = settings.height || fallback.height;

		// declare entities to simulate
		this._seed = settings.seed || fallback.seed;
		this.entity.active = this._seed.entities


		// only add canvas to body if one is not already present
		if (!document.getElementById(canvas.id))
		{
			document.getElementsByTagName('body')[0].appendChild(canvas);
		}
		// for later: make this delete any existing canvas and replace

		// attach canvas to Sim
		this.canvas = document.getElementById(canvas.id);
		this.context = this.canvas.getContext('2d');
	},
	// start running updates
	start: function()
	{
		if (!this.time.running)
		{
			this.update();
		}
	},
	// stop running updates
	stop: function()
	{
		window.cancelAnimationFrame(this.time.running);
		this.time.running = false;
	},
	// main loop heartbeat
	update: function()
	{
		// start the next frame
		this.time.running = requestAnimationFrame(this.update.bind(this));

		// update clock
		var now = new Date().getTime();
		this.time.delta = (now - (this.time.now || now));
		this.time.now = now;
		this.time.up += this.time.delta;

		// run updates for current time
		this.entity.updateAll(this.time);

		// render scene
		this.render();
	},
	render: function()
	{
		// clear frame
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.moveTo(0, 0);
		this.context.beginPath()

		// add some debug text
		var debug = this.time.now + ' ' + (1000 / this.time.delta).toFixed(0) + 'fps';
		this.context.font = '12px monospace';
		this.context.fillStyle = 'gray';
		this.context.fillText(debug, 12, 12);

		// draw all entities in event queue
		this.entity.drawAll(this.context);

		// close out drawing
		this.context.fill();
		this.context.stroke();
		this.context.closePath();
	},

	save: function()
	{
		this.cache = {
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
	reset: function()
	{
		// clear cache
		if (this.cache)
		{
			this.cache = null;
		}
		// remove locally stored data if present
		if (localStorage.getItem('SimSave'))
		{
			localStorage.removeItem('SimSave');
		}
		this.init();
	},

	entity:
	{

		queue: [],

		// queue

		// add event
		// go through queue
		// while (queue.length < 0) {	}

		add: function(data)
		{
			this.queue.push(data);
		},

		step: function()
		{
			if (this.queue.length > 0)
			{
				return this.queue.shift();
			}
			else
			{
				return null;
			}
		},

		active: {},
		inactive: {},
			
		assign: function(id, data)
		{
			this.active[id] = data;
		},
		destroy: function(id)
		{
			delete this.active[id];
		},
		deactivate: function(id)
		{
			this.inactive[id] = this.active[id];
			delete this.active[id];
		},

		updateAll: function(time, args)
		{
			// build a queue
			this.queue = (Object.keys(this.active));

			// go through it all from top to bottom
			while (this.queue.length > 0)
			{
				this.step()
				//this.active[this.step()].update(args);
				//console.log();
				//this.active[id].update(args)
			}
		},
		drawAll: function(context)
		{
			//foreach entity id 
			//this.active[id].draw(context);
		}

	}
	
}

// entities being simulated
//stage: {},
//entities: {},
//views: {},
//active: {},

/*
	Entity: function()
	{
		this.update = function()
		{
			// things to do when this entity updates
		}
		this.draw = function()
		{
			// things to do when this entity renders 
		}
	}


	update: function(id, args)
	{
		this.entity[id].update(args)
	},
	draw: function(id, args)
	{
		this.entity[id].draw(args)
	},


*/
