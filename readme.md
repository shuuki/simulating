# THE SIMULATION


```
// start a new empty simulation 
var sim = Object.create(Sim).init().start();
```


## Sim core

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

**methods**

* `add(id, value)` add new active entity as long as id is not in use
* `assign(values)` map an object onto active entities
* `forEach(fn, args)` calls a passed function on every active entity
* `get(id)` returns entity at id, or all entities of no id is passed
* `init(scene)` set up entities, takes optional seed object with initial values
* `remove(id)` delete active entity at id.
* `step(ref, time)` goes over every active entity and calls any method matching reference


### Entity

Each entity is assumed to have three methods:

1. `init` values necessary for a new entity
2. `update` logic for updating entity
3. `draw` (optional) extra logic for rendering entity

- `update` and `draw` both receive current instance of Time and Scene from Sim as arguments to use in their logic
