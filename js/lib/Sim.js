///////////////////////////////////
// THE SIMULATION

var Sim = {
	init: function (seed)
	{
		// takes optional scene object
		if (!seed)
		{
			this.scene = Object.create(Scene).init();
		}
		else {
			this.scene = Object.create(Scene).init(seed);
		}

		// start new time
		this.time = Object.create(Time);

		console.log('Sim ready', this.time.updated);

		return this;
	},
	update: function ()
	{
		// update clock
		this.time.update();

		// start the next frame
		this.frame = requestAnimationFrame(this.update.bind(this));

		// send scene a request for updates at current time 
		this.scene.step('update', this.time);

		// render scene
		this.draw();

		return this;
	},
	draw: function ()
	{
		// send scene a request for rendering updates
		this.scene.step('draw', this.time);

		// draw all entities
		//suggestion for syntax: this.renderer.render(this.scene, this.camera);

		return this;
	},
	start: function ()
	{
		// start updates
		if (!this.frame)
		{
			this.update();
		}

		return this;
	},
	stop: function ()
	{
		// stop updates
		window.cancelAnimationFrame(this.frame);
		this.frame = false;

		return this;
	}
	// later: save, load
}

///////////////

var Time = {
	steps: 0,
	up: 0,
	updated: new Date().getTime(),
	init: function ()
	{
		// reset time values
		this.delta = 0;
		this.steps = 0;
		this.up = 0;
		this.updated = new Date().getTime();

		return this;
	},
	update: function ()
	{
		// get current time and find delta since last update
	  var now = new Date().getTime();
		var delta = now - this.updated;

		// limit delta to 100ms
		delta < 100 ? this.delta = delta : this.delta = 100;

		// update 
		this.steps += 1;
		this.up += this.delta;
		this.updated = now;

	  return this;
	}
	// later: advance, rewind
	// export, import
}

///////////////

var Scene = {
	init: function (seed)
	{
		// take a seed object to set up initial values
		if (seed) {
			this.active = seed;
		}
		else {
			this.active = {};
		}

		this.inactive = {};

		return this;
	},
	add: function (id, value)
	{
		// add new active entity as long as id is not in use
		if (!this.active[id])
		{
			this.active[id] = value;
		}
		else
		{
			throw 'ENTITY ALREADY ADDED'
		}

		return this;
	},
	assign: function (values)
	{
		// map an object onto active entities
		Object.assign(this.active, values)

		return this;
	},
	get: function (id)
	{
		// returns entity at id, or all entities of no id is passed
		if (!id)
		{
			return this.active;
		}
		else if (this.active[id])
		{
			return this.active[id];
		}		
		else {
			throw 'ENTITY NOT FOUND'
		}
	},
	remove: function (id)
	{
		// delete active entity at id
		if (this.active[id])
		{
			delete this.active[id];
		}
		else {
			throw 'ENTITY NOT FOUND'
		}

		return this;
	},
	forEach: function (fn, args)
	{
		// call a function on every active entity
		for (i in this.active)
		{
			fn.apply(this, this.active[i], args)
			//test function (a) { console.log(this, a) }
		}

		return this;		
	},
	step: function (ref, time)
	{
		// goes over all active entities
		// calls any function matching a reference 
		// Sim has two step types: 'update' and 'draw'
		for (var i in this.active)
		{
			if (this.active[i][ref])
			{
				this.active[i][ref](time, this);
			}
		}

		return this;
	},
	deactivate: function (id)
	{
		// move active entity to inactive
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
	activate: function (id)
	{
		// move inactive entity to active
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
	drop: function (id)
	{
		// delete inactive entity
	  if (this.inactive[id])
	  {
	    delete this.active[id];
	  }
	  else
	  {
	    throw 'inactive entity not found';
	  }

	  return this;
	}
}

///////////////
