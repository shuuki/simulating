/** the simulation */

function Sim (config)
{
	this.init(config);
	return this;
}
Sim.prototype = {
	init: function(config)
	{
		// takes an object with starting values
		if (config)
		{
			// set clock
			if (config.time)
			{
				this.time = new Time(config.time);
			}
			else
			{
				this.time = new Time;
			}
			// set entities
			if (config.scene)
			{
				this.scene = new Scene(config.scene);
			}
			else {
				this.scene = new Scene;
			}
			this.config = config;
		}
		// set empty config if none is passed
		else
		{
			this.time = new Time;
			this.scene = new Scene;
		}

		console.log('Sim ready', this.time.lastUpdated);
		return this;
	},
	update: function()
	{
		// main loop heartbeat

		// update clock
		this.time.update();

		// start the next frame
		this.time.frame = requestAnimationFrame(this.update.bind(this));

		// run updates for current time
		this.scene.step('update', this.time);

		// render scene
		this.render();
	},
	render: function()
	{
		// draw all entities
		this.scene.step('render', this.time);
		//this.renderer.render(this.scene, this.camera);
	},
	start: function()
	{
		// start / stop updates
		if (!this.time.frame)
		{
			this.update();
		}
	},
	stop: function()
	{
		window.cancelAnimationFrame(this.time.frame);
		this.time.frame = false;
	},
}


function Time()
{

	this.frame = 0
	this.up = 0

  this.playing = null;
	this.delta = 0

	this.steps = 0;
	this.stepsRemaining = 0;
  this.lastUpdated = new Date().getTime();

}
Time.prototype = {
	update: function()
	{
	  var now = new Date().getTime();
		var delta = now - this.lastUpdated;
		
		if (delta > 100) 
		{
			delta = 100;
		}


		this.delta = delta;
		// reset steps if exceeds ?? Number.MAX_VALUE ??
		this.steps ++;
		this.up += this.delta;
	  this.lastUpdated = now;

		//console.log('update', this)
	  return this;
	},
	advance: function(steps, refresh)
	{
		var ms = refresh || 0;
		
		this.stepsRemaining += steps;
		if (!this.playing)
		{
			this.playing = setInterval(this.step.bind(this), ms);
		}
		return this;
	},
	step: function()
	{
	  if (this.stepsRemaining > 0) {
	    //this.stepsRemaining--;
	    this.steps++;
	  }
	  else if (this.stepsRemaining <= 0)
	  {
	    clearInterval(this.playing);
	    this.playing = null;
	    this.stepsRemaining = 0;
	  }
	  
	  this.update();
	}
}



function Scene (seed)
{
	// takes a seed object to set up initial values
	if (seed) {
		// if both active and inactive entities are passed, assign them
		if (seed.active && seed.inactive)
		{
			this.active = seed.active;
			this.inactive = seed.inactive;
		}
		// if no inactive entities are passed, count all entities as active
		if (!seed.inactive)
		{
			this.active = seed;
			this.inactive = {};
		}
	}
	// if no initial values are passed, create empty scene
	else
	{
		this.active = {};
		this.inactive = {};
	}

	// queue of entities actively being processed
	this.queue = [];
}

Scene.prototype = {
	// entity management
	// add new active entity, as long as id is not in use
	add: function (id, value)
	{
		if (!this.active[id])
		{
			this.active[id] = value;
		}
		else
		{
			throw 'entity already added'
		}
		return this;
	},
	// add active entity without checking before any existing entity
	assign: function (id, value)
	{
		this.active[id] = value;
		return this;
	},
	// delete active entity at id
	remove: function (id)
	{
		if (this.active[id])
		{
			delete this.active[id];
		}
		else {
			throw 'active entity not found'
		}
		return this;
	},
	// move active entity to inactive
	deactivate: function (id)
	{
		if (this.inactive[id])
		{
			this.inactive[id] = this.active[id];
			delete this.active[id];
		}
		else
		{
			throw 'active entity not found';
		}
		return this;
	},
	// move inactive entity to active
	activate: function (id)
	{
		if (this.inactive[id])
		{
			this.active[id] = this.inactive[id];
			delete this.inactive[id];
		}
		else
		{
			throw 'inactive entity not found';
		}
		return this;
	},
	// delete inactive entity
	drop: function (id)
	{
		if (this.inactive[id])
		{
			delete this.active[id];
		}
		else
		{
			throw 'inactive entity not found';
		}
		return this;
	},
	// call a function on every active entity
	forEach: function (fn, args)
	{
		for (i in this.active)
		{
			fn.apply(this, this.active[i], args)
			//test function (a) { console.log(this, a) }
		}
		return this;		
	},
	step: function (ref, time)
	{
		for (var i in this.active)
		{
			if (!this.active[i][ref])
			{
			}
			else {
				this.active[i][ref](time);
			}
		}
		return this;		

		//'init', 'update', 'render'
	}


}
