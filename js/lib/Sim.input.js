/** input control */

// receives data from event listeners
// recognizes keyboard and mouse (for now)
// current events available at Sim.input.active
// many keyboard buttons named for easy use
// adds mouse coordinates on mousedown
// clears mouse coordinates on mouseup

Sim.input = {
  // cache of keys currently active
  active: {},

  // index of tracked keys
  BACKSPACE: 8,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  Q: 81,
  W: 87,
  E: 69,
  A: 65,
  S: 83,
  D: 68,
  SPACE: 32,
  ENTER: 13,
  SHIFT: 16,

  // track key states
  isDown: function(keyCode)
  {
    return this.active[keyCode];
  },
  keyDown: function(event)
  {
    this.active[event.keyCode] = true;
  },
  keyUp: function(event)
  {
    delete this.active[event.keyCode];
  },

  // track mouse states
  mouseDown: function(event)
  {
    this.active['mousedown'] = {x: event.x, y: event.y};
  },
  mouseUp: function(event)
  {
    delete this.active['mousedown'];
  }
}


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


// load

window.addEventListener('load', function()
{
	//Sim.init(intro);
	//Sim.start();
}, false);
