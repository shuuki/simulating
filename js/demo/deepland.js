
// load

window.addEventListener('load', function()
{
	Sim.init(deepland);
	Sim.start();
	seed()
}, false);


var deepland = {
	seed: {
		land: new Land(),
		craft: new Craft()
	}
}

// setup

/**** INIT */
function seed()
{
	console.log("old seed fired")
	/**** CAMERA */
	Sim.camera.position.set(0,-1,0.5)
	Sim.camera.rotation.set(1.6,0,0)

	//Sim.camera.position.set(-4, 0, 12);
}


// Craft entity
function Craft(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};
Craft.prototype.init = function(origin) {


	var geometry = new THREE.ConeGeometry( 1, 3, 6 ),
		material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			wireframe: true 
		});

	this.cone = new THREE.Mesh( geometry, material);
	this.cone.castShadow = true;
	this.cone.position.set(-2,-1,0)
	this.cone.rotation.set(-1.6,0,0)
	this.cone.receiveShadow = true;

	origin.scene.add(this.cone);

	console.log('craft is a go')
}
Craft.prototype.update = function(origin) {


	this.cone.add(origin.camera)

	if (origin.input.isDown(origin.input.W))
	{
		this.cone.position.y += 0.1;
	}
	if (origin.input.isDown(origin.input.S))
	{
		this.cone.position.y -= 0.1;
	}
	if (origin.input.isDown(origin.input.A))
	{
		this.cone.position.z += 0.01;
	}
	if (origin.input.isDown(origin.input.D))
	{
		this.cone.position.z -= 0.01;
	}
	
	
	
	
	if (origin.input.isDown(origin.input.DOWN))
	{
		this.cone.rotation.x += 0.01;
	}
	if (origin.input.isDown(origin.input.UP))
	{
		this.cone.rotation.x -= 0.01;
	}
	
	
	if (origin.input.isDown(origin.input.LEFT))
	{
		this.cone.rotation.y += 0.01;
	}
	if (origin.input.isDown(origin.input.RIGHT))
	{
		this.cone.rotation.y -= 0.01;
	}
	
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
		geometry2.vertices[i].z = (Math.random() * i)/200;
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

	origin.scene.add(this.plane);


	// lighting

	var ambientLight = new THREE.AmbientLight(0x212121)
	Sim.scene.add(ambientLight);

	var spotLight = new THREE.DirectionalLight(0xffffff, 0.5);
	spotLight.position.set(200,200,200);
	spotLight.castShadow = true;

	origin.scene.add(spotLight);
	
	
	console.log('land is a go')

}
Land.prototype.update = function(origin) {

	
	
}
Land.prototype.render = function(origin) {}
