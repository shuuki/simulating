/** the simulation */

var Sim = {
  test: function()
  {
    console.log('Sim ready.');
  },
  init: function(viewport, width, height)
  {
  	// start the clock
  	this.time = 0;
    this.running = null;

  	// set up canvas
  	var canvas = document.createElement('canvas');
  	canvas.id = viewport;
  	canvas.width = width;
  	canvas.height = height;
  	
    // only add canvas to body if one is not already present
    if (!document.getElementById(viewport))
    {
      document.getElementsByTagName('body')[0].appendChild(canvas);
    }

    // attach canvas to Sim
  	this.canvas = document.getElementById(viewport);
  	this.context = this.canvas.getContext('2d');

  	// declare entities to simulate

  },
  start: function()
  {
    if (!this.running)
    {
      this.update();
    }
  },
  stop: function()
  {
    window.cancelAnimationFrame(this.running);
    this.running = null;
  },
  update: function()
  {
  	// start the next frame
  	this.running = requestAnimationFrame(this.update.bind(this));

  	// update clock
  	var now = new Date().getTime();
  	this.delta = now - (this.time || now);
  	this.time = now;

  	// update entities
    // pass delta

  	// render scene
  	this.render();
  },
  render: function()
  {
  	// clear frame
  	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  	this.context.moveTo(0, 0);
  	this.context.beginPath()

  	// add some debug text
  	var debug = this.time + ' ' + (1000 / this.delta).toFixed(0) + 'fps';
  	this.context.font = '12px monospace';
  	this.context.fillStyle = 'gray';
  	this.context.fillText(debug, 12, 12);
  	
  	// render entities
  	//this.ship.draw(this.context);

    // close out drawing
  	this.context.fill();
  	this.context.stroke();
  	this.context.closePath();
  },
  save: function()
  {
    this.cache = {
      // add sim state values here for save/load
      //scene: this.scene,
      time: this.time
    };
    localStorage.setItem('SimSave', JSON.stringify(this.cache));
  },
  load: function()
  {
    if (localStorage.getItem('SimSave'))
    {
      this.cache = JSON.parse(localStorage.getItem('SimSave'));
    }
  },
  reset: function()
  {
    // clear cache
    if (this.cache)
    {
      this.cache = null;
    }
    // remove locally stored data if present
    if (localStorage.getItem('SimSave'))
    {
      localStorage.removeItem('SimSave');
    }
  },
  util:
  {
    // cache pi for speed
    pi: Math.PI,
    // convert degrees to radians
    degToRad: function(degrees)
    {
      return degrees * (this.pi/180);
    },
    // convert radians to degrees
    radToDeg: function(radians)
    {
      return radians * (180/this.pi);
    },
    // roll a random whole number between 0 and a maximum
    roll: function(max)
    {
      return Math.floor(Math.random() * max);
    },
    // pick a random element from an array
    pick: function(list)
    {
      return list[Math.floor(Math.random() * list.length)];
    },
    // shuffle
    // from mike bostock via frankmitchell.org/2015/01/fisher-yates
    shuffle: function(list)
    {
      var m = list.length, t, i;
      // while there are elements to shuffle...
      while (m) {
        // pick a remaining element...
        i = Math.floor(Math.random() * m--);
        // and swap it with the current element
        t = list[m];
        list[m] = list[i];
        list[i] = t;
      }
      return list;
    }
  },
  input:
  {
    // cache of keys currently active
    active: {},

    // index of tracked inputs
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
    }
  },
  scene:
  {
    entities : {},
    stage: {}

    // scene
    // --stage
    // --entities
    // ----cameras
    // ----actors

    // camera entity needs what values?
    /*
    var Camera = {
      width: 320,
      height: 200,
      x: 120,
      y: 100,
      aspect: 1.6 || (this.width / this.height)
    }
    */
  }
}


/** event listeners */

// load events
window.addEventListener('load', function()
{
  Sim.test();
	Sim.init('display', 320, 200);
  Sim.start();
	//Sim.update();
}, false);

// keyboard events
window.addEventListener('keyup', function(event)
{
	Sim.input.keyUp(event);
}, false);
window.addEventListener('keydown', function(event)
{
	Sim.input.keyDown(event);
	//console.log(event.keyCode)
  console.log(Sim.input.active)
}, false);

// mouse events
window.addEventListener('click', function()
{
	var x = event.pageX,
    y = event.pageY;
	console.log("click",x,y)
}, false);

window.addEventListener('mouseup', function()
{
	var x = event.pageX,
    y = event.pageY;
	console.log("mouseup",x,y)
}, false);

window.addEventListener('mousedown', function()
{
	var x = event.pageX,
    y = event.pageY;
  Sim.input.keyDown({x: x, y: y})
	console.log("mousedown",x,y)
  console.log(Sim.input.active)
}, false);


// experiment for later: do stuff with clicks	
// add mouseDown/mouseUp and some touch events
