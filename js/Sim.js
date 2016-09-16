/** the simulation */

var Sim = {
	// proof of life
	test: function()
	{
		console.log('Sim ready.');
	},
	// first steps
	// initialize canvas
	init: function(settings)
	{
		// start the clock
		this.time = 0;
		this.running = null;
	
		// set up canvas
		var canvas = document.createElement('canvas');
		canvas.id = settings.id || 'display';
		canvas.width = settings.width || 480;
		canvas.height = settings.height || 300;

		// only add canvas to body if one is not already present
		if (!document.getElementById(canvas.id))
		{
			document.getElementsByTagName('body')[0].appendChild(canvas);
		}
		// for later: make this delete any existing canvas and replace

		// declare entities to simulate
		this.seed = settings.seed || {};

		// attach canvas to Sim
		this.canvas = document.getElementById(canvas.id);
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
