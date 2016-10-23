// 

var sim = new Sim({
	scene: {
		ticker: new Ticker('bip', 1),
		ticker2: new Ticker('BOP', 2.5)
	}
}).start();


// ticker: a little thing that increments once every n seconds

function Ticker(name, increment)
{
	this.name = name;
	this.increment = increment;
	this.time = 0;
	this.tick = 0;
	this.tock = false;
}
Ticker.prototype.update = function(time, scene)
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
}
Ticker.prototype.render = function(time, scene)
{		
	//console.log(time, scene)
	if (this.tock) {
		console.log(this.name, this.tick)
	}	
}	
