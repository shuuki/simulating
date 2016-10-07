
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

// Craft entity
function Craft(pos, vel) {
	this.pos = pos || new THREE.Vector3(0,0,0);
	this.vel = vel || new THREE.Vector3(0,0,0);
	this.mass = 700;
}

Craft.prototype.init = function(origin) {

	origin.camera.position.set(0,-1,0.5)
	origin.camera.rotation.set(1.6,0,0)

	var geometry = new THREE.ConeGeometry( 1, 3, 6 );
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		wireframe: true 
	});

	this.cone = new THREE.Mesh( geometry, material);
	this.cone.castShadow = true;
	this.cone.position.set(this.pos.x,this.pos.y,this.pos.z)
	this.cone.rotation.set(-1.6,0,0)
	this.cone.receiveShadow = true;

	origin.scene.add(this.cone);

	this.cone.add(origin.camera)

	console.log('craft is a go')
}
Craft.prototype.update = function(origin) {
	

	if (origin.input.isDown(origin.input.W))
	{
		this.vel.z -= 0.1 * origin.time.delta / this.mass;
	}
	if (origin.input.isDown(origin.input.S))
	{
		this.vel.z += 0.1 * origin.time.delta / this.mass;
	}
	if (origin.input.isDown(origin.input.A))
	{
		this.vel.x -= 0.1 * origin.time.delta / this.mass;
	}
	if (origin.input.isDown(origin.input.D))
	{
		this.vel.x += 0.1 * origin.time.delta / this.mass;
	}	
	if (origin.input.isDown(origin.input.UP))
	{
		this.cone.rotation.x -= 0.01;
	}
	if (origin.input.isDown(origin.input.DOWN))
	{
		this.cone.rotation.x += 0.01;
	}
	if (origin.input.isDown(origin.input.LEFT))
	{
		this.cone.rotation.y -= 0.01;
	}
	if (origin.input.isDown(origin.input.RIGHT))
	{
		//this.vel.applyAxisAngle(new THREE.Vector3(0,0,1), 0.01);
		this.cone.rotation.y += 0.01;
	}
	
	if (origin.input.isDown(origin.input.SPACE))
	{
		this.vel = new THREE.Vector3
	}

	this.cone.position.add(this.vel)
	
}
Craft.prototype.render = function() {}



// Land entity 
function Land(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
Land.prototype.init = function(origin) {

	
	/**** GEOMETRY */

	var geometry = new THREE.SphereGeometry( 1200, 60, 60 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffff00, shading: THREE.FlatShading} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(0,-1209.4,0)
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	//origin.scene.add( sphere );



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
	origin.scene.add(this.plane);


	// lighting

	var ambientLight = new THREE.AmbientLight(0x212121)
	Sim.scene.add(ambientLight);

	var spotLight = new THREE.PointLight(0xffffff, 0.5);
	spotLight.position.set(200,200,200);
	spotLight.castShadow = true;

	origin.scene.add(spotLight);
	
	
	console.log('land is a go')

}
Land.prototype.update = function(origin) {

	for (var i = 0, l = this.plane.geometry.vertices.length; i < l; i++) {
		this.plane.geometry.vertices[i].z = (Math.random() * i)/50;
	}
	
}
Land.prototype.render = function(origin) {}
