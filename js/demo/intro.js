
// load

window.addEventListener('load', function()
{
	sim.test();
	sim.init(intro);
	sim.start();
}, false);


// seed

var intro = {
	display: {
		width: 320,
		height: 200
	},
	seed: {
		ticker: new Ticker(),
	}
}


// little thing that ticks in one second increments

function Ticker()
{
	this.time = 0;
}
Ticker.prototype.update = function(origin)
{
	var delta = origin.time.delta;
	this.time += (delta / 1000);
}
Ticker.prototype.draw = function(origin)
{
	var context = origin.context;
	context.fillText(this.time.toFixed(0), 12, (context.canvas.height - 12));
}
