# THE SIMULATION

A set of tools designed to make it easy to spin up simple interactive demos in JavaScript/HTML/CSS and web browser.

``` JS:
// start a new empty simulation 
var sim = Object.create(Sim).init().start();
```

``` HTML:
<!-- include Sim.js -->
<script src="js/lib/Sim.js"></script>

<!-- optional intro demo -->
<script src="js/demo/intro.js"></script>
```

## Sim.js

### Sim

**values**

* `frame` (number)
* `time` (Time)
* `scene` (Scene)

**methods**

* `init(seed)` starts new time and scene, takes optional scene seed object
* `update()` requests animation frame, gets updates from time and scene 
* `draw()` gets extra update from scene for rendering 
* `start()` start running updates if not already running
* `stop()` stops running updates


### Time

**values**

* `delta` (number) time since last update, in ms, limited to 100ms
* `lastUpdated` (number) time of latest update, in ms since the epoch
* `steps`(number) number of updates performed
* `up` (number) accumulated delta time since simulation began, in ms

**methods**

* `init()` reset time values
* `update()` get current time and find delta since last update 


### Scene

**values**

* `active` (object) holds scene entities
* `inactive` (object) holds entities not actively simulated

**methods**

* `activate(id)` move inactive entity to active
* `add(id, value)` add new active entity as long as id is not in use
* `assign(values)` map an object onto active entities
* `deactivate(id)` move active entity to inactive
* `drop(id)` delete inactive entity
* `forEach(fn, args)` calls a passed function on every active entity
* `get(id)` returns entity at id, or all entities of no id is passed
* `init(scene)` set up entities, takes optional seed object with initial values
* `remove(id)` delete active entity at id.
* `step(ref, time)` goes over every active entity and calls any method matching reference

---

## Entities

Sim makes no assumptions about entities, just exposes some basic information to entities and allows them to make their own decisions. Entities are generally expected to have at least three methods:

1. `init` define values necessary for a new entity
2. `update` add logic for updating entity
3. `draw` extra logic for rendering entity

Note: `update` and `draw` are both called frequently by `Sim.update`, once per `step`, so entities containing methods `update` or `draw` will be called with the current instance of Time and Scene as arguments to use in their logic.

```
// Ticker entity 
// a little thing that increments once every n seconds

var Ticker = {
	init: function (name, increment)
	{
		// give ticker a name and time increment
		this.name = name;
		this.increment = increment;
		this.time = 0;
		this.tick = 0;
		this.tock = false;
		return this;
	},
	update: function(time, scene)
	{
		// reset tock and delta since last update
		this.time += time.delta / 1000;
		this.tock = false;

		// set tock to true and decrement by ticker's increment 
		while (this.time >= this.increment) {
			this.time -= this.increment;
			this.tick += 1;
			this.tock = true;
		}
	},
	draw: function(time, scene)
	{
		// log a tick to the console
		if (this.tock) {
			console.log(this.name, this.tick)
		}
	}
}

```
