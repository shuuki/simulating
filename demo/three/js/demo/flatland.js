
// load

window.addEventListener('load', function()
{
	Sim.init(flatland);
	Sim.start();
}, false);


// seed

var flatland = {
	seed: {
		ship: new Ship()
	}
}


// entities

function Ship()
{
	this.x = 40;
	this.y = 40;
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.TurnSpeed = 0;
	this.Direction = 0;
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
	if (origin.input.isDown(origin.input.UP) || origin.input.isDown(origin.input.W))
	{
			this.xSpeed += Math.cos(this.Direction) * (thrustMain * delta);
			this.ySpeed += Math.sin(this.Direction) * (thrustMain * delta);
	}
	if (origin.input.isDown(origin.input.DOWN) || origin.input.isDown(origin.input.S))
	{
			this.xSpeed -= Math.cos(this.Direction) * (thrustLateral * delta);
			this.ySpeed -= Math.sin(this.Direction) * (thrustLateral * delta);
	}
	if (origin.input.isDown(origin.input.A))
	{
		this.xSpeed += Math.cos(this.Direction - (origin.util.pi / 2)) * (thrustLateral * delta);
		this.ySpeed += Math.sin(this.Direction - (origin.util.pi / 2)) * (thrustLateral * delta);	
	}
	if (origin.input.isDown(origin.input.D))
	{
		this.xSpeed -= Math.cos(this.Direction - (origin.util.pi / 2)) * (thrustLateral * delta);
		this.ySpeed -= Math.sin(this.Direction - (origin.util.pi / 2)) * (thrustLateral * delta);	
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
	if (origin.input.isDown(origin.input.LEFT)) {
		let thrust = maxTurn + this.TurnSpeed;
		this.TurnSpeed -= thrust * delta;
	}
	if (origin.input.isDown(origin.input.RIGHT)) {
		let thrust = maxTurn - this.TurnSpeed;
		this.TurnSpeed += thrust * delta;
	}

	// limit turn speed
	if (this.TurnSpeed > maxTurn) this.TurnSpeed = maxTurn;
	if (this.TurnSpeed < -maxTurn) this.TurnSpeed = -maxTurn;


	this.Direction += this.TurnSpeed;

	// bound maximum direction to one rotation
	if (this.Direction > origin.util.pi * 2) { this.Direction -= origin.util.pi * 2; }
	if (this.Direction < 0) { this.Direction += origin.util.pi * 2; }

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
	context.arc(this.x, this.y, shipSize, (this.Direction - origin.util.pi - shipAngle), (this.Direction - origin.util.pi + shipAngle), false);
	context.arc(this.x, this.y, shipSize, this.Direction, this.Direction, false);
	context.arc(this.x, this.y, shipSize, (this.Direction - origin.util.pi - shipAngle), (this.Direction - origin.util.pi + shipAngle), false);

	context.moveTo(this.x, this.y)
	context.lineTo(this.x - 11 * Math.cos(this.Direction), this.y - 11 * Math.sin(this.Direction));
	context.moveTo(this.x, this.y)
	context.lineTo(this.x + 8 * Math.cos(this.Direction), this.y + 8 * Math.sin(this.Direction));
	context.fillStyle = 'magenta';
	context.fill();
	context.stroke();
	
	//context.fillRect(this.x - 2, this.y - 2, 4, 4);
	//context.arc(this.x, this.y, 4, 0, 2 * origin.util.pi, false);
	//context.fillText("X"+this.x.toFixed(0) + ", Y" + this.y.toFixed(0), this.x + 16, this.y + 4);
	//context.fillText(origin.util.radToDeg(this.Direction).toFixed(0), this.x - 10, this.y + 20);
	//context.fillText(origin.util.radToDeg(this.Direction).toFixed(0), 10, 40);

}
