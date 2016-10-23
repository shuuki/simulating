
/** event listeners */

// keyboard events

window.addEventListener('keyup', function(event)
{
	Sim.input.keyUp(event);
}, false);

window.addEventListener('keydown', function(event)
{
	Sim.input.keyDown(event);
	//console.log(event.keyCode)
	//console.log(Sim.input.active)
}, false);

// mouse events

window.addEventListener('click', function()
{
	//console.log(event.type, event.pageX, event.pageY)
}, false);

window.addEventListener('mouseup', function()
{
  Sim.input.mouseUp(event)
  //console.log(event.type, event.x, event.y)
}, false);

window.addEventListener('mousedown', function()
{
	Sim.input.mouseDown(event)
	//console.log(event.type, event.x, event.y)
	//console.log(Sim.input.active)
}, false);

// load events

window.addEventListener('load', function()
{
  //console.log('loaded')
}, false);
