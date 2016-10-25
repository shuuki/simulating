

var sim = Object.create(Sim).init().start();

// ticker: a little thing that increments once every n seconds

var Ticker = {
	init: function (name, increment)
	{
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
		//console.log(time, scene)
		if (this.tock) {
			console.log(this.name, this.tick)
		}
	}
}

var ticker = Object.create(Ticker).init('bip', 1);
var ticker2 = Object.create(Ticker).init('BOP', 2.5)

// assign tickers to the scene
sim.scene.assign({ ticker, ticker2 })
