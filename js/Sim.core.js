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
		this._time = {
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
		this._seed = settings.seed|| fallback.seed;

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
		if (!this._time.running)
		{
			this.update();
		}
	},
	// stop running updates
	stop: function()
	{
		window.cancelAnimationFrame(this._time.running);
		this._time.running = false;
	},
	// main loop heartbeat
	update: function()
	{
		// start the next frame
		this._time.running = requestAnimationFrame(this.update.bind(this));

		// update clock
		var now = new Date().getTime();
		this._time.delta = (now - (this._time.now || now));
		this._time.now = now;
		this._time.up += this._time.delta;

		// run updates for current time
		this.event.updateAll(this._time);

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
		var debug = this._time.now + ' ' + (1000 / this._time.delta).toFixed(0) + 'fps';
		this.context.font = '12px monospace';
		this.context.fillStyle = 'gray';
		this.context.fillText(debug, 12, 12);

		// draw all entities in event queue
		this.event.drawAll(this.context);

		// close out drawing
		this.context.fill();
		this.context.stroke();
		this.context.closePath();
	},

	save: function()
	{
		this._cache = {
			// add sim state values here for save/load
			//scene: this.scene,
			time: this._time
		};
		localStorage.setItem('SimSave', JSON.stringify(this._cache));
	},
	load: function()
	{
		if (localStorage.getItem('SimSave'))
		{
			this._cache = JSON.parse(localStorage.getItem('SimSave'));
		}
	},
	reset: function()
	{
		// clear cache
		if (this._cache)
		{
			this._cache = null;
		}
		// remove locally stored data if present
		if (localStorage.getItem('SimSave'))
		{
			localStorage.removeItem('SimSave');
		}
		this.init();
	},

  event:
	{

		queue: [],


		enqueue: function(data)
		{
			this.queue.push(data);
			// queue

			// add event
			// go through queue
			// while (queue.length < 0) {  }

		},

		dequeue: function()
		{
			this.queue.shift();
		},

    
    active: {},

		assign: function(id, values)
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
			// build a queue
			// go through it all from top to bottom
			// something better than this:
			//foreach active id 
			//this.active[id].update(delta);
		},

		draw: function(id, args)
		{
			this.active[id].draw(args)
		},
		drawAll: function(context)
		{
			// 
			//foreach active id 
			//this.active[id].draw(context);
		},

  }
}





		// entities being simulated

		//stage: {},
    //entities: {},
		//views: {},

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
