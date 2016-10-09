
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
		craft: new Craft()
	}
}


// entities

// Craft

function Craft(position, velocity, orientation)
{

	this.mass = 50000;

	this.movementSpeed = 5;
	this.rollSpeed = 0.1;

	this.moveState = {
		up: 0, down: 0, left: 0, right: 0,
		forward: 0, back: 0,
		pitchUp: 0, pitchDown: 0,
		yawLeft: 0, yawRight: 0,
		rollLeft: 0, rollRight: 0
	};
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
	this.tmpQuaternion = new THREE.Quaternion();


}
Craft.prototype.init = function(sim)
{
	
	var delta = sim.time.delta;
	
	var geometry = new THREE.ConeGeometry( 1, 3, 6 );
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		wireframe: true 
	});

	this.cone = new THREE.Mesh( geometry, material);
	this.cone.castShadow = true;
	this.cone.receiveShadow = true;

	// add cone to scene
	sim.scene.add(this.cone);

	// add camera to cone
	this.cone.add(sim.camera)
	sim.camera.position.set(0,-1,0.5)
	sim.camera.rotation.set(0,0,0)


	console.log('craft is a go')
}
Craft.prototype.update = function(sim)
{
	

	
	var thrust;
	
	var drag;




	if (sim.input.isDown(sim.input.LEFT))
	{
		this.moveState.rollLeft += 1;
	}

	if (sim.input.isDown(sim.input.RIGHT))
	{
		this.moveState.rollRight += 1;
	}


	if (sim.input.isDown(sim.input.W)) { this.moveState.forward += 1; }

	if (sim.input.isDown(sim.input.S)) { this.moveState.back += 1; }

	if (sim.input.isDown(sim.input.A)) { this.moveState.left += 1; }
	
	if (sim.input.isDown(sim.input.D)) { this.moveState.right += 1; }
 	
	if (sim.input.isDown(sim.input.DOWN)) { this.moveState.pitchUp += 1; }

	if (sim.input.isDown(sim.input.UP)) { this.moveState.pitchDown += 1; }

	if (sim.input.isDown(sim.input.Q)) { this.moveState.yawLeft += 1; }

	if (sim.input.isDown(sim.input.E)) { this.moveState.yawRight += 1; }	



	if (sim.input.isDown(sim.input.SPACE)) { }

	if (sim.input.isDown(sim.input.SHIFT))
	{  }





	this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
	this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
	this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

	//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
	this.moveVector.y = ( - this.moveState.down    + this.moveState.up );
	this.moveVector.z = ( - this.moveState.forward + this.moveState.back );



	//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	var moveMult = sim.time.delta * this.movementSpeed / this.mass ;
	var rotMult = sim.time.delta * this.rollSpeed / this.mass;

	

	this.cone.translateX( this.moveVector.x * moveMult );
	this.cone.translateY( this.moveVector.y * moveMult );
	this.cone.translateZ( this.moveVector.z * moveMult );

	this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
	this.cone.quaternion.multiply( this.tmpQuaternion );

	// expose the rotation vector for convenience
	this.cone.rotation.setFromQuaternion( this.cone.quaternion, this.cone.rotation.order );



	//this.cone.rotation.set(this.rotationVector)

	//this.cone.rotation.setFromVector3(this.orientation)

	//this.cone.position.add(this.velocity)

	
}
Craft.prototype.render = function() {


}



















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
	sphere.position.set(600, 1200, -1200)
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

	var ambientLight = new THREE.AmbientLight(0x440044)
	Sim.scene.add(ambientLight);

	var light = new THREE.PointLight(0xffffff, 0.5);
	light.position.set(200,200,200);
	//light.shadow.mapSize.width = 1024;
	//light.shadow.mapSize.height = 1024;
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
