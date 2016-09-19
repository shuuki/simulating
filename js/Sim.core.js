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
		this.seed = settings.seed || fallback.seed;
		this.entity.active = this.seed.entities;

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
		this.entity.updateAll(this);

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
		this.entity.drawAll(this);

		// close out drawing
		//this.context.fill();
		this.context.stroke();
		this.context.closePath();
	},

	save: function()
	{
		this.cache = {
			// add sim state values here for save/load
			//scene: this.scene,
			time: this.time,
			entities: this.entity.active
		};
		localStorage.setItem('SimSave', JSON.stringify(this.cache));
	},
	load: function()
	{
		if (localStorage.getItem('SimSave'))
		{
			this.cache = JSON.parse(localStorage.getItem('SimSave'));
			this.entity.active = this.cache.entities;
			this.time = this.cache.time;
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
		//this.init(this.seed);
	},

	entity:
	{
		// current entities being simulated
		active: {},
		inactive: {},

		// queue of entities being processed
		queue: [],

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
		reactivate: function(id)
		{
			this.active[id] = this.inactive[id];
			delete this.inactive[id];
		},
		updateAll: function(origin)
		{
			// build the queue
			this.queue = (Object.keys(this.active));

			// go through queue from top to bottom
			while (this.queue.length > 0)
			{
				this.active[this.queue[0]].update(origin);
				this.queue.shift();
			}
		},
		drawAll: function(origin)
		{
			// build the queue
			this.queue = (Object.keys(this.active));

			// go through queue from top to bottom
			while (this.queue.length > 0)
			{
				this.active[this.queue[0]].draw(origin);
				this.queue.shift();
			}
		}
	}
}
