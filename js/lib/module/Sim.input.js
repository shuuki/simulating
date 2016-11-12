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
  R: 82,
  F: 70, 
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
