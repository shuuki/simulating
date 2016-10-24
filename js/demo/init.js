var landscape = Object.create(Walk);
landscape.init('plains');


var world = {
	landscape: Object.create(Walk).init('plains')
}


var sim = Object.create(Sim).init().start();

sim.scene.add('landscape', landscape)
