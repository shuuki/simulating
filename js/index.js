
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
		stage: new Stage()
	}
	
}


// little test that ticker in one second increments
function Ticker()
{
	this.time = 0;
}
Ticker.prototype.update = function(time)
{
	this.time += (time.delta / 1000);	
}
Ticker.prototype.draw = function(context)
{
	context.fillText(this.time.toFixed(0), 12, (context.canvas.height - 12));
}


// 
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
Camera.prototype.draw = function() {}


function Stage()
{
	this.area = [];
}
Stage.prototype.update = function() {}
Stage.prototype.draw = function() {}


/**  ship actor */
function Ship(domain)
{
	this.domain = domain;
	this.x = domain.width / 2;
	this.y = domain.height / 2;
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.TurnSpeed = 0;
	this.Direction = pi * 1.5;
}
Ship.prototype.update = function(increment)
{
	// physics variables
	var delta = increment / 1000,
		friction = 0.000001,
		thrustMain = 1.1,
		thrustLateral = 0.7,
		maxSpeed = 4,
		maxTurn = 0.08;

	// movement controls
	if (Key.isDown(Key.UP) || Key.isDown(Key.W))
	{
			this.xSpeed += Math.cos(this.Direction) * (thrustMain * delta);
			this.ySpeed += Math.sin(this.Direction) * (thrustMain * delta);	
	}
	if (Key.isDown(Key.DOWN) || Key.isDown(Key.S))
	{
			this.xSpeed -= Math.cos(this.Direction) * (thrustLateral * delta);
			this.ySpeed -= Math.sin(this.Direction) * (thrustLateral * delta);
	}
	if (Key.isDown(Key.A))
	{
		this.xSpeed += Math.cos(this.Direction - (pi / 2)) * (thrustLateral * delta);
		this.ySpeed += Math.sin(this.Direction - (pi / 2)) * (thrustLateral * delta);	
	}
	if (Key.isDown(Key.D))
	{
		this.xSpeed -= Math.cos(this.Direction - (pi / 2)) * (thrustLateral * delta);
		this.ySpeed -= Math.sin(this.Direction - (pi / 2)) * (thrustLateral * delta);	
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
	if (Key.isDown(Key.LEFT)) {
		let thrust = maxTurn + this.TurnSpeed;
		this.TurnSpeed -= thrust * delta;
	}
	if (Key.isDown(Key.RIGHT)) {
		let thrust = maxTurn - this.TurnSpeed;
		this.TurnSpeed += thrust * delta;
	}

	// limit turn speed
	if (this.TurnSpeed > maxTurn) this.TurnSpeed = maxTurn;
	if (this.TurnSpeed < -maxTurn) this.TurnSpeed = -maxTurn;


	this.Direction += this.TurnSpeed;

	// bound maximum direction to one rotation
	if (this.Direction > pi * 2) { this.Direction -= pi * 2; }
	if (this.Direction < 0) { this.Direction += pi * 2; }

	// apply friction to rotation
	if (this.TurnSpeed > friction) this.TurnSpeed -= friction;
	if (this.TurnSpeed < -friction) this.TurnSpeed += friction;
	// if friction is greater than speed, stop
	if (this.TurnSpeed < friction && this.TurnSpeed > -friction) this.TurnSpeed = 0;

	// reset ship to other side of canvas if it leaves domain, asteroids style
	if (this.x > this.domain.width) this.x = 0;
	if (this.x < 0) this.x = this.domain.width;
	if (this.y > this.domain.height) this.y = 0; 
	if (this.y < 0) this.y = this.domain.height;

	/*
	if (this.x > this.domain.width) this.x = this.domain.width;
	if (this.x < 0) this.x = 0;
	if (this.y > this.domain.height) this.y = this.domain.height; 
	if (this.y < 0) this.y = 0;
	*/
	

}
Ship.prototype.draw = function(context)
{
	let shipAngle = 0.8,
		shipSize = 8;

	context.lineWidth = 2;
	context.arc(this.x, this.y, shipSize, (this.Direction-pi-shipAngle), (this.Direction-pi+shipAngle), false);
	context.arc(this.x, this.y, shipSize, this.Direction, this.Direction, false);
	context.arc(this.x, this.y, shipSize, (this.Direction-pi-shipAngle), (this.Direction-pi+shipAngle), false);
	

	//context.fillRect(this.x - 2, this.y - 2, 4, 4);
	//context.arc(this.x, this.y, 4, 0, 2 * pi, false);

	context.fillText("X"+this.x.toFixed(0) +", Y"+ this.y.toFixed(0), this.x+16, this.y+4);
	context.fillText(Util.radToDeg(this.Direction).toFixed(0), this.x-10, this.y+20);

	//context.fillText(Util.radToDeg(this.Direction).toFixed(0), 10, 40);
	context.fill();
	context.stroke();
	context.closePath();

}
