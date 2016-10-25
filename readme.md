# THE SIMULATION

## Sim core

### Sim

**values**

* `frame` (number)
* `time` (Time)
* `scene` (Scene)

**methods**

* `init(scene)` starts new time and scene, takes optional scene seed object
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

**methods**

* `add(id, value)` add new active entity as long as id is not in use
* `assign(values)` map an object onto active entities
* `forEach(fn, args)` call a function on every active entity
* `get(id)`returns entity at id, or all entities of no id is passed
* `init(scene)` set up entities, takes optional seed object with initial values
* `remove(id)` delete active entity at id 
* `step(ref, time)` goes over every active entity and calls any method matching 
