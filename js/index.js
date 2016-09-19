
// load events
window.addEventListener('load', function()
{
	Sim.test();
	Sim.init({
		id: 'view',
		//width: 320,
		//height: 200,
		seed: flatland
	});
	Sim.start();
}, false);


// seed
var flatland = {
	test: 'seed loaded',
	entities: {
		ticker: new Ticker(),
		camera: new Camera({
			width: 320,
			height: 200,
			x: 120,
			y: 100,
			z: 0
		}),
		//stage: new Stage(),
		ship: new Ship()
	}	
}


// little test that ticker in one second increments
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


function Ship()
{
	this.x = 40;
	this.y = 40;
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.TurnSpeed = 0;
	this.Direction = Sim.util.pi * 1.5;
}
Ship.prototype.update = function(origin)
{
	// physics variables
	var delta = origin.time.delta / 1000,
		friction = 0.000001,
		turnFriction = 0.0001,
		thrustMain = 1.1,
		thrustLateral = 0.7,
		maxSpeed = 4,
		maxTurn = 0.08;

	// movement controls
	if (Sim.input.isDown(Sim.input.UP) || Sim.input.isDown(Sim.input.W))
	{
			this.xSpeed += Math.cos(this.Direction) * (thrustMain * delta);
			this.ySpeed += Math.sin(this.Direction) * (thrustMain * delta);	
	}
	if (Sim.input.isDown(Sim.input.DOWN) || Sim.input.isDown(Sim.input.S))
	{
			this.xSpeed -= Math.cos(this.Direction) * (thrustLateral * delta);
			this.ySpeed -= Math.sin(this.Direction) * (thrustLateral * delta);
	}
	if (Sim.input.isDown(Sim.input.A))
	{
		this.xSpeed += Math.cos(this.Direction - (Sim.util.pi / 2)) * (thrustLateral * delta);
		this.ySpeed += Math.sin(this.Direction - (Sim.util.pi / 2)) * (thrustLateral * delta);	
	}
	if (Sim.input.isDown(Sim.input.D))
	{
		this.xSpeed -= Math.cos(this.Direction - (Sim.util.pi / 2)) * (thrustLateral * delta);
		this.ySpeed -= Math.sin(this.Direction - (Sim.util.pi / 2)) * (thrustLateral * delta);	
	}

	// calculate length of the speed vector using pythagoras
	var SpeedVectorLength = Math.sqrt((this.xSpeed * this.xSpeed) + (this.ySpeed * this.ySpeed));

	// if moving, decrease speed with friction 
	if (SpeedVectorLength > 0)
	{
		this.xSpeed -= (this.xSpeed / SpeedVectorLength) * friction;
		this.ySpeed -= (this.ySpeed / SpeedVectorLength) * friction;
	}
	// if speed is faster than max speed, decrease speed
	if (SpeedVectorLength > maxSpeed)
	{
		this.xSpeed += (this.xSpeed / SpeedVectorLength) * (maxSpeed - SpeedVectorLength);
		this.ySpeed += (this.ySpeed / SpeedVectorLength) * (maxSpeed - SpeedVectorLength);
	}

	this.x += this.xSpeed;
	this.y += this.ySpeed;


	// Rotation Movement (Keys Left, Right)

	// controls
	if (Sim.input.isDown(Sim.input.LEFT)) {
		let thrust = maxTurn + this.TurnSpeed;
		this.TurnSpeed -= thrust * delta;
	}
	if (Sim.input.isDown(Sim.input.RIGHT)) {
		let thrust = maxTurn - this.TurnSpeed;
		this.TurnSpeed += thrust * delta;
	}

	// limit turn speed
	if (this.TurnSpeed > maxTurn) this.TurnSpeed = maxTurn;
	if (this.TurnSpeed < -maxTurn) this.TurnSpeed = -maxTurn;


	this.Direction += this.TurnSpeed;

	// bound maximum direction to one rotation
	if (this.Direction > Sim.util.pi * 2) { this.Direction -= Sim.util.pi * 2; }
	if (this.Direction < 0) { this.Direction += Sim.util.pi * 2; }

	// apply friction to rotation
	if (this.TurnSpeed > turnFriction) this.TurnSpeed -= turnFriction;
	if (this.TurnSpeed < -turnFriction) this.TurnSpeed += turnFriction;
	// if friction is greater than speed, stop
	if (this.TurnSpeed < turnFriction && this.TurnSpeed > -turnFriction) this.TurnSpeed = 0;

}
Ship.prototype.draw = function(origin)
{
	let context = origin.context,
		shipAngle = 0.8,
		shipSize = 8;

	context.strokeStyle = 'magenta';
	context.lineWidth = 2;
	context.arc(this.x, this.y, shipSize, (this.Direction - Sim.util.pi - shipAngle), (this.Direction - Sim.util.pi + shipAngle), false);
	context.arc(this.x, this.y, shipSize, this.Direction, this.Direction, false);
	context.arc(this.x, this.y, shipSize, (this.Direction - Sim.util.pi - shipAngle), (this.Direction - Sim.util.pi + shipAngle), false);
	
	//context.fillRect(this.x - 2, this.y - 2, 4, 4);
	//context.arc(this.x, this.y, 4, 0, 2 * Sim.util.pi, false);
	//context.fillText("X"+this.x.toFixed(0) + ", Y" + this.y.toFixed(0), this.x + 16, this.y + 4);
	//context.fillText(Sim.util.radToDeg(this.Direction).toFixed(0), this.x - 10, this.y + 20);
	//context.fillText(Sim.util.radToDeg(this.Direction).toFixed(0), 10, 40);

}
