///////////////////////////////////
// THE SIMULATION


var Sim = {
	active: false,
	init: function (scene)
	{

		if (scene)
		{
			this.scene = Object.create(Scene).init(scene);
		}
		else {
			this.scene = Object.create(Scene).init();
		}

		this.time = Object.create(Time);

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
		this.draw();
		
		return this;
	},
	draw: function()
	{
		// send scene a request for rendering updates
		this.scene.step('draw', this.time);
		//console.log(this.time)
		// draw all entities
		//suggestion for syntax: this.renderer.render(this.scene, this.camera);

		return this;
	},
	start: function()
	{
		// start updates
		if (!this.time.frame)
		{
			this.update();
		}
		return this;
	},
	stop: function()
	{
		// stop updates
		window.cancelAnimationFrame(this.time.frame);
		this.time.frame = false;
		return this;
	}
}

///////////////

var Time = {
	steps: 0,
	up: 0,
	lastUpdated: new Date().getTime(),
	init: function ()
	{
		this.delta = 0;
		this.up = 0;
		this.frame = 0;
		this.steps = 0;
		this.stepsRemaining = 0;
		this.advancing = false;
		this.lastUpdated = new Date().getTime();
	},
	update: function ()
	{
	  var now = new Date().getTime();
		var delta = now - this.lastUpdated;
		
		// cap delta at 100ms
		delta < 100 ? this.delta = delta : this.delta = 100;

		this.up += this.delta;
	  this.lastUpdated = now;

		this.steps ++;
		// reset steps if exceed maximum accurate number
		//this.steps >= Number.MAX_VALUE ? this.steps = 0 : this.steps ++;

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
	init: function (seed)
	{
		// take a seed object to set up initial values
		
		if (seed) {
			this.active = seed;
		}
		else {
			this.active = {};
		}

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
			throw 'entity already added'
		}

		return this;
	},
	assign: function (values)
	{
		Object.assign(this.active, values)

		return this;
	},
	remove: function (id)
	{
		// delete active entity at id

		if (this.active[id])
		{
			delete this.active[id];
		}
		else {
			throw 'active entity not found'
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
		// steps to give active entities a chance to update
		// currently only 'update' or 'draw'
		for (var i in this.active)
		{
			if (this.active[i][ref])
			{
				this.active[i][ref](time, this)
			}
		}
		return this;
	}

}

///////////////
