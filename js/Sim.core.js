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
	init: function(config)
	{
		// takes an object with starting values
		// set empty config if none is passed
		if (!config)
		{
			var config = {};
		}

		// set the clock
		if (config.time)
		{
			this.time = config.time;
		}
		else
		{
			this.time = {
				running: 0,
				up: 0,
				now: 0,
				delta: 0
			};
		}

		// declare entities to simulate
		if (config.seed)
		{
			this.entity.active = config.seed;
		}
		else
		{
			this.entity.active = {};
		}

		// set up display values
		if (config.display && config.display.width && config.display.height)
		{
			this.display = config.display;
		}
		else
		{
			this.display = {
				width: 480,
				height: 300
			};
		}

		// initialize canvas
		var canvas = document.createElement('canvas');
		canvas.id = 'display';
		canvas.width = this.display.width;
		canvas.height = this.display.height;

		// delete canvas if one is present
		var existing = document.getElementById(canvas.id);
		if (existing && existing.parentNode)
		{
			existing.parentNode.removeChild(existing);
		}

		// add canvas to body
		document.getElementsByTagName('body')[0].appendChild(canvas);

		// attach canvas to Sim
		this.canvas = document.getElementById(canvas.id);
		this.context = this.canvas.getContext('2d');
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
		//this.context.stroke();
		//this.context.closePath();
	},

	// start / stop updates
	start: function()
	{
		if (!this.time.running)
		{
			this.update();
		}
	},
	stop: function()
	{
		window.cancelAnimationFrame(this.time.running);
		this.time.running = false;
	},

	// manage state
	save: function()
	{
		// cache current sim state
		this.cache = {
			display: this.display,
			time: this.time,
			seed: this.entity.active
		};

		// save to localStorage
		localStorage.setItem('SimSave', JSON.stringify(this.cache));
	},
	load: function()
	{		
		if (localStorage.getItem('SimSave'))
		{
			this.cache = JSON.parse(localStorage.getItem('SimSave'));
			// loading is currently broken
			this.init(this.cache);
		}
		else
		{
			console.log('No SimSave present')
		}
	},
	reset: function()
	{
		// clear cache
		if (this.cache)
		{
			this.cache = {};
		}

		// start an empty sim
		this.init();

		// if present, remove locally stored data 
		if (localStorage.getItem('SimSave'))
		{
			localStorage.removeItem('SimSave');
		}
	},

	// entities
	entity:
	{
		// current entities being simulated
		active: {},
		inactive: {},

		// queue of entities being processed
		queue: [],

		// manage entities
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

		// batch controls
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
