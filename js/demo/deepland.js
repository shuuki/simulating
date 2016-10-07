
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
	Sim.camera.position.set(-4, 0, 12);
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
	this.cone.position.set(-6,0,-1)
	this.cone.rotation.set(0,0,0)
	this.cone.receiveShadow = true;

	origin.scene.add(this.cone);

	console.log('craft is a go')
}
Craft.prototype.update = function() {}
Craft.prototype.render = function() {}



// Land entity 
function Land(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
Land.prototype.init = function(origin) {

	
	/**** GEOMETRY */

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

	var foo = this.plane.geometry.vertices;
	for (var i = 0, l = foo.length; i < l; i++) {
		foo[i].z = (Math.random() * 2);
	}
	
	
	
}
Land.prototype.render = function(origin) {}
