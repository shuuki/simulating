
## Sim core

### Sim

* `init(scene)`
* `update()`
* `draw()`
* `start()`
* `stop()`


### Time

**values**

* `lastUpdated`: time of latest update in ms since the epoch
* `delta`: time since last update in ms, limited to 100ms
* `up`: accumulated delta time since simulation began in ms
* `steps`: number of updates performed

**methods**

* `init()`: reset time values
* `update()`: get current time and find delta since last update 

### Scene

* init
* add
* assign
* remove
* forEach
* step
