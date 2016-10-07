/** the simulation */

// core code required to run a basic sim
// canvas rendering 
// start / stop running updates
// save / load with localstorage
// track scene elements and entities

var Sim = {
	// defaults
	scene: {},
	camera: {},
	renderer: {},
	time: {
		running: 0,
		up: 0,
		now: 0,
		delta: 0
	},
	// first steps
	init: function(config)
	{
		// takes an object with starting values
		// set empty config if none is passed
		if (config)
		{
			// set the clock
			if (config.time)
			{
				this.time = config.time;
			}

			// declare entities to simulate
			if (config.seed)
			{
				this.entity.active = config.seed;
			}
		}

		// default values for display
		var screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			screenPixels = 2;

		// set up three.js
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(70, screenWidth / screenHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(screenWidth / screenPixels, screenHeight / screenPixels, false);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.BasicShadowMap;
		document.body.appendChild(this.renderer.domElement);

		// run updates
		this.entity.batch(this, 0);

		// proof of life
		console.log('Sim ready');
	},

	// main loop heartbeat
	update: function()
	{
		// update clock
		var now = new Date().getTime();
		this.time.delta = (now - (this.time.now || now));
		this.time.now = now;
		this.time.up += this.time.delta;

		// start the next frame
		this.time.running = requestAnimationFrame(this.update.bind(this));

		// run updates for current time
		this.entity.batch(this, 1);

		// render scene
		this.render();
	},
	render: function()
	{
		// draw all entities
		this.entity.batch(this, 2);

		this.renderer.render(this.scene, this.camera);
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
}

// entities
Sim.entity = {
	// current entities being simulated
	active: {},

	// queue of entities being processed
	queue: [],

	// manage entities
	add: function(id, data)
	{
		this.active[id] = data;
	},
	remove: function(id)
	{
		delete this.active[id];
	},

	// batch controls
	batch: function(origin, step)
	{
		// build event queue
		this.queue = (Object.keys(this.active));

		// go through queue from top to bottom
		while (this.queue.length > 0)
		{
			// act on top entity based on current step
			if (step === 0)
			{	
				this.active[this.queue[0]].init(origin);
			}
			if (step === 1)
			{
				this.active[this.queue[0]].update(origin);
			}
			if (step === 2)
			{
				this.active[this.queue[0]].render(origin);
			}
			
			// delete top entry
			this.queue.shift();
		}
	}

	/*
	// Thing entity
	function Thing() {}
	Thing.prototype.init = function(origin) {}
	Thing.prototype.update = function(origin) {}
	Thing.prototype.render = function(origin) {}
	*/

}
