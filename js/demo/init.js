var sim = Object.create(Sim).init().start();

var starting = {
	scene: {
		landscape: Object.create(Walk).start('plains')
	}
}
