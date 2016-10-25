// INTRODUCTION TO THE SIMULATION

// start a new empty simulation 

var sim = Object.create(Sim).init().start();

// make a Ticker entity 
// a little thing that increments once every n seconds

var Ticker = {
	init: function (name, increment)
	{
		// give ticker a name and time increment
		this.name = name;
		this.increment = increment;
		this.time = 0;
		this.tick = 0;
		this.tock = false;
		return this;
	},
	update: function(time, scene)
	{
		// reset tock and delta since last update
		this.time += time.delta / 1000;
		this.tock = false;

		// set tock to true and decrement by ticker's increment 
		while (this.time >= this.increment) {
			this.time -= this.increment;
			this.tick += 1;
			this.tock = true;
		}
	},
	draw: function(time, scene)
	{
		// log a tick to the console
		//console.log(time, scene)
		if (this.tock) {
			console.log(this.name, this.tick)
		}
	}
}

// create instances of Ticker

var ticker = Object.create(Ticker).init('bip', 1);
var ticker2 = Object.create(Ticker).init('BOP', 2.5)

// assign tickers to the simulation scene

sim.scene.assign({ ticker, ticker2 })

// bip and BOP should now be appearing in your console regularly
