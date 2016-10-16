



var sim = new Sim().init({
	seed: {
		ticker: new Ticker(),
		ticker2: new Ticker()
	}
});


// little thing that ticks in one second increments

function Ticker()
{
	this.time = 0;
}

Ticker.prototype.init = function()
{
	this.time = Math.random() * 3;
}	

Ticker.prototype.render = function(origin)
{
	console.log(this.time)
}	

Ticker.prototype.update = function(time)
{
this.time += (time.delta / 1000);
}
