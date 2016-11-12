window.addEventListener('load', function() {
	Sim.init();
	Sim.draw();
}, false);

var Sim = {};

Sim.init = function() {
	this.makeCanvas();

	this.canvas = document.getElementById("display");
	this.context = this.canvas.getContext("2d");

	this.time = 0;
	this.fps = 30;

	this.canvas.addEventListener("click", function() {
		let x = event.pageX - this.offsetLeft;
		let y = event.pageY - this.offsetTop;
		console.log(x, y)

		//Sim.context.fillRect(x-1, y-1, 3, 3);

	}, false);
}

Sim.makeCanvas = function() {
	let canvas = document.createElement("canvas"),
		body = document.getElementsByTagName("body")[0];
	canvas.id = "display";
	canvas.width = 320;
	canvas.height = 200;
	body.appendChild(canvas);
}

Sim.draw = function() {
	//	setTimeout(function() {
	requestAnimationFrame(this.draw.bind(this));

	// update clock
	let now = new Date().getTime();

	this.delta = now - (this.time || now);
	this.time = now;
	//console.log(this.time, this.delta)

	this.render();

	//	}, 1000 / this.fps);
}

Sim.render = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	let debug = "T " + this.time + " Δ " + (1000 / this.delta).toFixed(1) + "fps";

	this.context.font = "16px monospace";
	this.context.fillText(debug, 10, 20);
}
