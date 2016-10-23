///////////////////////////////////
// THE SIMULATION


var Sim = {
	active: false,
	init: function(config)
	{
		// takes an object with starting values
		if (config)
		{
			// set clock
			if (config.time)
			{
				this.time = Object.create(Timer);//.init(config.time);
			}
			else
			{
				this.time = Object.create(Timer);
			}
			// set entities
			if (config.scene)
			{
				this.scene = Object.create(Scene).init(config.scene);
			}
			else {
				this.scene = Object.create(Scene);
			}
			this.config = config;
		}
		// set empty config if none is passed
		else
		{
			this.config = {};
			this.time = Object.create(Timer) ;
			this.scene = Object.create(Scene) ;
		}

		console.log('Sim ready', this.time.lastUpdated);
		return this;
	},
	update: function()
	{
		// update clock
		this.time.update();

		// send scene a request for updates at current time 
		this.scene.step('update', this.time);

		// start the next frame
		this.time.frame = requestAnimationFrame(this.update.bind(this));

		// render scene
		this.render();
		
		return this;
	},
	render: function()
	{
		// send scene a request for rendering updates
		this.scene.step('render', this.time);

		// draw all entities
		//suggestion for syntax: this.renderer.render(this.scene, this.camera);

		return this;
	},
	start: function()
	{
		// start / stop updates
		if (!this.time.frame)
		{
			this.update();
		}
		return this;
	},
	stop: function()
	{
		window.cancelAnimationFrame(this.time.frame);
		this.time.frame = false;
		return this;
	}
}

///////////////

var Timer = {
	delta: 0,
	up: 0,
	frame: 0,
	steps: 0,
	stepsRemaining: 0,
	advancing: false,
	lastUpdated: new Date().getTime(),
	update: function()
	{
	  var now = new Date().getTime();
		var delta = now - this.lastUpdated;
		
		// cap delta at 100ms
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
		if (!this.advancing)
		{
			this.advancing = setInterval(this.step.bind(this), ms);
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
	    clearInterval(this.advancing);
	    this.advancing = false;
	    this.stepsRemaining = 0;
	  }
	  
	  this.update();
	}
}

///////////////

var Scene = {
	queue: [],
	init: function (seed)
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
	},

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
		// steps to give active entities a chance to update
		// currently only 'update' or 'render'
		for (var i in this.active)
		{
			//console.log(this.active[i])
			if (this.active[i][ref])
			{
				this.active[i][ref](time, this)
			}
		}
		return this;
	}

}

///////////////