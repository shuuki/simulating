
// load

window.addEventListener('load', function()
{
	Sim.init(deepland);
	Sim.start();
}, false);


// seeed

var deepland = {
	seed: {
		land: new Land(),
		craft: new Craft(new THREE.Vector3(-2,5,0))
	}
}


// entities

// Craft

function Craft(position, velocity, orientation) {
	this.position = position || new THREE.Vector3(0,0,0);
	this.velocity = velocity || new THREE.Vector3(0,0,0);
	this.orientation = orientation || new THREE.Vector3(0,0,0);
			
	this.mass = 700;
	

}

Craft.prototype.init = function(sim) {


	var geometry = new THREE.ConeGeometry( 1, 3, 6 );
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		wireframe: true 
	});

	this.cone = new THREE.Mesh( geometry, material);
	this.cone.castShadow = true;

	this.cone.position.set(this.position.x,this.position.y,this.position.z)

	this.cone.rotation.set(-1.6,0,0)
	this.cone.receiveShadow = true;

	sim.scene.add(this.cone);

	this.cone.add(sim.camera)
	sim.camera.position.set(0,-1,0.5)
	sim.camera.rotation.set(1.6,0,0)


	console.log('craft is a go')
}
Craft.prototype.update = function(sim) {
	

	var thrust, orientation;
	
	var drag;

	if (sim.input.isDown(sim.input.W))
	{
		this.velocity.z -= 0.1 * sim.time.delta / this.mass;
	}
	if (sim.input.isDown(sim.input.S))
	{
		this.velocity.z += 0.1 * sim.time.delta / this.mass;
	}
	if (sim.input.isDown(sim.input.A))
	{
		this.velocity.x -= 0.1 * sim.time.delta / this.mass;
	}
	if (sim.input.isDown(sim.input.D))
	{
		this.velocity.x += 0.1 * sim.time.delta / this.mass;
	}	
	if (sim.input.isDown(sim.input.UP))
	{
		this.orientation.x -= 0.01;
	}
	if (sim.input.isDown(sim.input.DOWN))
	{
		this.orientation.x += 0.01;
	}
	if (sim.input.isDown(sim.input.LEFT))
	{
		this.orientation.y -= 0.01;
	}
	if (sim.input.isDown(sim.input.RIGHT))
	{
		//this.vel.applyAxisAngle(new THREE.Vector3(0,0,1), 0.01);
		this.orientation.y += 0.01;
	}	
	if (sim.input.isDown(sim.input.SPACE))
	{
		this.velocity = new THREE.Vector3
	}

	this.cone.position.add(this.velocity)
	
}
Craft.prototype.render = function() {}



















// Land entity 
function Land(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
Land.prototype.init = function(sim) {

	
	/**** GEOMETRY */

	// big sphere
	var geometry = new THREE.SphereGeometry( 1200, 60, 60 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffff00, shading: THREE.FlatShading} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(0,-1209.4,0)
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sim.scene.add( sphere );

	var geometry2 = new THREE.PlaneGeometry(1000,1000,50,50);
	for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
		geometry2.vertices[i].z = (Math.random() * i)/100;
	}

	var material2 = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		shading: THREE.FlatShading,
		//wireframe: true
	});

	this.plane = new THREE.Mesh(geometry2, material2);
	this.plane.position.set(30,-10,-40)
	this.plane.rotation.set(-1.52,0,-3)
	this.plane.castShadow = true;
	this.plane.receiveShadow = true;
	this.plane.geometry.dynamic = true;
	this.plane.geometry.verticesNeedUpdate = true;
	this.plane.geometry.normalsNeedUpdate = true;
	sim.scene.add(this.plane);


	// lighting

	var ambientLight = new THREE.AmbientLight(0x212121)
	Sim.scene.add(ambientLight);

	var light = new THREE.PointLight(0xffffff, 0.5);
	light.position.set(200,200,200);
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.castShadow = true;

	sim.scene.add(light);
	
	
	console.log('land is a go')

}
Land.prototype.update = function(sim) {

	for (var i = 0, l = this.plane.geometry.vertices.length; i < l; i++) {
		this.plane.geometry.vertices[i].z = (Math.random() * i)/50;
	}
	
}
Land.prototype.render = function(sim) {}
