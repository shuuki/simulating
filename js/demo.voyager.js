
// load

window.addEventListener('load', function()
{
	Sim.test();
	Sim.init(voyager);
	Sim.start();
}, false);


// seed

var voyager = {
	display: {
		width: 480,
		height: 640
	},
	seed: {
		ticker: new Ticker(),
		//camera: new Camera(),
		//stage: new Stage(),

		// magling data from NASA
		// Planetary Fact Sheet - Metric
		// http://nssdc.gsfc.nasa.gov/planetary/factsheet/
		//             10^24 kg,       km,   10^6 km,  km/s,       hex    //   10^6 km,  10^6 km,
	 	//                 mass, diameter,  distance, speed,     color    // periapsis, apoapsis,
	 	slvr: new Body(       0,9999999999,        0,     0, '#282828' ), //         0,        0,
		sonn: new Body( 1988435,   695700,         0,     0, '#f8f8f2' ), //         0,        0,
		mirk: new Body(   0.330,     4879,      57.9,  47.4, '#787878' ), //      46.0,     69.8,
		vans: new Body(    4.87,    12104,     108.2,  35.0, '#ae885d' ), //     107.5,    108.9,
		erth: new Body(    5.97,    12756,     149.6,  29.8, '#888ba0' ), //     147.1,    152.1,
		marz: new Body(   0.642,     6792,     227.9,  24.1, '#86674c' ), //     206.6,    249.2,
		jupt: new Body(    1898,   142984,     778.6,  13.1, '#b87e1b' ), //     740.5,    816.6,
		sats: new Body(     568,   120536,    1433.5,   9.7, '#debc7f' ), //    1352.6,   1514.5,
		urns: new Body(    86.8,    51118,    2872.5,   6.8, '#a8ccd1' ), //    2741.3,   3003.6,
		nepz: new Body(     102,    49528,    4495.1,   5.4, '#3d5ad8' ), //    4444.5,   4545.7,
	}
}


// celestial bodies

function Body(mass, diameter, distance, speed, color) // periapsis, apoapsis
{

	var scale = {
		distance: 1,
		diameter: .0001,
		time: 0.0005
	}

	this.m = mass;
	this.d = diameter * scale.diameter; // radius
	this.od = distance * scale.distance; // orbit, distance from origin
	this.s = speed * scale.time; // speed

	this.color = color; 

	this.p = 0; // period, how far along

	//this.l = l; // length of 


// origin x/y, only for rendering
	this.ox = 240;
	this.oy = 320;
}

Body.prototype.update = function()
{
	
	this.p += this.s;

	var whatsit = blah(this.od, this.p);
	
	this.x = whatsit[0]+this.ox
	this.y = whatsit[1]+this.oy
	
	//https://lord.io/blog/2014/kepler/


	


	// two coords in [x,y] format
	function distance(a, b)
	{
		var distance = Math.sqrt(Math.pow(b[1] - a[1], 2) + Math.pow(b[0] - a[0], 2));
	  return distance;
	}


	function blah(length, angle)
	{
		var x = length * Math.cos(angle),
				y = length * Math.sin(angle);
		return [x,y];
	}	

	function attenuate(intensity, distance)
	{
	  return (intensity / Math.pow(distance, 2));
	}



	function Vector (x, y, z)
	{
	  this.x = x;
	  this.y = y;
	  this.z = z;
	}


}
Body.prototype.draw = function(origin)
{
	var context = origin.context;

	// fill circle with body color
	context.beginPath();
	context.fillStyle = this.color;
	context.arc(this.x, this.y, this.d/2, 0, 2 * Math.PI);
	context.globalAlpha = 1;
	context.fill();
	context.closePath();

	// stroke outline for small bodies
	context.beginPath();
	context.strokeStyle = this.color;
	context.lineWidth = 4;
	context.arc(this.x, this.y, 8, 0, 2 * Math.PI);
	context.globalAlpha = 0.2;
	context.stroke();
	context.closePath();

	// cycles elapsed on each planet
	//context.globalAlpha = 1;
	//context.fillText((this.d/(2*Math.PI)).toFixed(1), this.x+8, this.y+4);
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
