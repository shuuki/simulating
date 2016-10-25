# THE SIMULATION

## Sim core

### Sim

* `frame`
* `init(scene)`
* `update()`
* `draw()`
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

* `active` object holding scene entities

**methods**

* `add(id, value)` add new active entity as long as id is not in use
* `assign(values)` map an object onto active entities
* `forEach(fn, args)` call a function on every active entity
* `get(id)`returns entity at id, or all entities of no id is passed
* `init(scene)` set up entities, takes optional seed object with initial values
* `remove(id)` delete active entity at id 
* `step(ref, time)` goes over all active entities and calls any function matching a reference 
