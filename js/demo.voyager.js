
// load

window.addEventListener('load', function()
{
	Sim.test();
	Sim.init(intro);
	Sim.start();
}, false);


// seed

var intro = {
	display: {
		width: 800,
		height: 800
	},
	seed: {
		ticker: new Ticker(),
		//camera: new Camera(),
		//stage: new Stage(),
		spzz: new Body( 9999999,       0, 0,      0,   'black'),
		sonn: new Body( 69.5700,       0, 0,      0,   'white'),
		mirk: new Body(   .4879,   579/7, 0, .00474, '#787878'),
		wans: new Body(  1.2104,  1082/7, 0, .00350, '#ae885d'),
		urth: new Body(  1.2756,  1496/7, 0, .00241, '#888ba0'),
		marz: new Body(   .6792,  2279/7, 0, .00298, '#86674c'),

	}
}

// magling data from NASA
// Planetary Fact Sheet - Metric
// http://nssdc.gsfc.nasa.gov/planetary/factsheet/

function Body(r, od, p, s, c)
{
	this.r = r; // radius
	this.od = od; // orbit, distance from origin
	this.p = p; // period, how far along

	this.s = s;
	this.c = c;

// origin x/y, only for rendering
	this.ox = 400; 
	this.oy = 400;	
}
Body.prototype.update = function()
{
	
	this.p += this.s;

	var whatsit = blah(this.od, this.p);
	
	this.x = whatsit[0]+this.ox
	this.y = whatsit[1]+this.oy
	
	//https://lord.io/blog/2014/kepler/

	function blah(radius, angle)
	{
		x = radius * Math.cos(angle);
		y = radius * Math.sin(angle);
		return [x,y];
	}	


}
Body.prototype.draw = function(origin)
{
	var context = origin.context;
	context.beginPath();
	context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	context.fillStyle = this.c;
	context.fill();
	// years elapsed
	context.fillText((this.p/(2*Math.PI)).toFixed(2), this.x+4, this.y+12);

	context.closePath();

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














// entities

function Camera(settings)
{
	this.width =  settings.width;
	this.height = settings.height;
	this.x = settings.x;
	this.y = settings.y;
	this.z = settings.z;
	this.aspect = this.width / this.height;
}
Camera.prototype.update = function()
{
	// take any transforms to the camera object
	// change x/y probably
	// maybe the aspect sometimes too
}
Camera.prototype.draw = function()
{}





function Stage()
{
	this.area = [];
}
Stage.prototype.update = function()
{}
Stage.prototype.draw = function()
{}
