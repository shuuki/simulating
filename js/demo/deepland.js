
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
		light: new Light(),
		craft: new Craft()
	}
}


// entities

// Craft

function Craft(position, velocity, orientation)
{

	this.mass = 1980;
	this.movementSpeed = 35;
	this.rollSpeed = 4;

	this.moveState = {
		up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0,
		pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0
	};
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
	this.tmpQuaternion = new THREE.Quaternion();

}
Craft.prototype.init = function(sim)
{
	// set up cone geometry
	var geometry = new THREE.ConeGeometry( 1, 3, 6 );
	geometry.rotateX(-1.6);

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffaa,
		wireframe: true 
	});

	this.cone = new THREE.Mesh( geometry, material);
	this.cone.castShadow = true;
	this.cone.receiveShadow = true;

	// add cone to scene
	sim.scene.add(this.cone);

	// add camera to cone
	this.cone.add(sim.camera)
	sim.camera.position.set(0,0.4,0.5)
	sim.camera.rotation.set(0,0,0)

	console.log('craft is a go')
}
Craft.prototype.update = function(sim)
{
	//var thrust;	
	//var drag;
	var override = 0;
	var delta = sim.time.delta / 1000;
	var moveMult = delta * (this.movementSpeed / this.mass) ;
	var rotMult = delta * (this.rollSpeed / this.mass);

	if (sim.input.isDown(sim.input.SPACE))
	{
		override = 0.98;
		
		var queue = (Object.keys(this.moveState));
		while (queue.length > 0)
		{
			this.moveState[queue[0]] = this.moveState[queue[0]] * override;
			queue.shift()
		}

	}

	if (sim.input.isDown(sim.input.UP))  { this.moveState.pitchDown += 1; this.moveState.pitchUp -= 1; }
	if (sim.input.isDown(sim.input.DOWN)) { this.moveState.pitchUp += 1; this.moveState.pitchDown -= 1; }

	if (sim.input.isDown(sim.input.Q)) { this.moveState.rollLeft += 1; this.moveState.rollRight -= 1; }
	if (sim.input.isDown(sim.input.E)) { this.moveState.rollRight += 1; this.moveState.rollLeft -= 1; }

	if (sim.input.isDown(sim.input.LEFT)) { this.moveState.yawLeft += 1; this.moveState.yawRight -= 1; }
	if (sim.input.isDown(sim.input.RIGHT)) { this.moveState.yawRight += 1; this.moveState.yawLeft -= 1; }	

	if (sim.input.isDown(sim.input.W)) { this.moveState.forward += 1; this.moveState.back -= 1; }
	if (sim.input.isDown(sim.input.S)) { this.moveState.back += 1; this.moveState.forward -= 1; }

	if (sim.input.isDown(sim.input.A)) { this.moveState.left += 1; this.moveState.right -= 1; }
	if (sim.input.isDown(sim.input.D)) { this.moveState.right += 1; this.moveState.left -= 1; }

	if (sim.input.isDown(sim.input.R)) { this.moveState.up += 1; this.moveState.down -= 1; }
	if (sim.input.isDown(sim.input.F)) { this.moveState.down += 1; this.moveState.up -= 1; }



	this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
	this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
	this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
	//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );


	this.moveVector.x = ( - this.moveState.left + this.moveState.right );
	this.moveVector.y = ( - this.moveState.down + this.moveState.up );
	this.moveVector.z = ( - this.moveState.forward + this.moveState.back );
	//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	//console.log(this.moveVector)
	
	this.cone.translateX( this.moveVector.x * moveMult );
	this.cone.translateY( this.moveVector.y * moveMult );
	this.cone.translateZ( this.moveVector.z * moveMult );

	this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
	this.cone.quaternion.multiply( this.tmpQuaternion );

	// expose the rotation vector for convenience
	this.cone.rotation.setFromQuaternion(this.cone.quaternion, this.cone.rotation.order);



	//this.cone.rotation.set(this.rotationVector)

	//this.cone.rotation.setFromVector3(this.orientation)

	//this.cone.position.add(this.velocity)

	
}
Craft.prototype.render = function() {


}




// motion independent of orientation

// collision

// gravity

// be able to update land geometry



function Light(){}
Light.prototype.init = function(sim) {
	
		// lighting

		var ambientLight = new THREE.AmbientLight(0x181118)
		Sim.scene.add(ambientLight);

		var light = new THREE.PointLight(0xffffff, 1);
		light.position.set(200,200,200);
		//light.shadow.mapSize.width = 1024;
		//light.shadow.mapSize.height = 1024;
		light.castShadow = true;

		//sim.scene.add(light);
		
		var dirLight = new THREE.DirectionalLight(0xffffff, 2);
		dirLight.position.set(-1, 0.18, -1);
		sim.scene.add(dirLight);
		
}
Light.prototype.update = function(sim) {}
Light.prototype.render = function(sim) {}



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
	this.sphere1 = new THREE.Mesh( geometry, material );
	this.sphere1.position.set(600, 1200, -1200)
	this.sphere1.castShadow = true;
	this.sphere1.receiveShadow = true;
	sim.scene.add(this.sphere1);
	
	var geometry = new THREE.SphereGeometry( 3700, 20, 20 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, shading: THREE.FlatShading} );
	this.sphere2 = new THREE.Mesh( geometry, material );
	this.sphere2.position.set(2400, -1540, -50000)
	this.sphere2.castShadow = true;
	this.sphere2.receiveShadow = true;
	sim.scene.add(this.sphere2);



	var geometry2 = new THREE.PlaneGeometry(20,20,10,10);
	for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
		geometry2.vertices[i].z = (Math.random() * i)/100;
	}
	console.log(geometry2.vertices)

	var material2 = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		//wireframe: true
	});

	this.plane = new THREE.Mesh(geometry2, material2);
	this.plane.position.set(30,-10,-40)
	this.plane.rotation.set(-1.52,0,-3)
	this.plane.castShadow = true;
	this.plane.receiveShadow = true;
	this.plane.geometry.dynamic = true;
	this.plane.geometry.verticesNeedUpdate = true;
	sim.scene.add(this.plane);

	var skyBoxGeometry = new THREE.SphereGeometry( 1000000, 10, 10 );
	// BackSide: render faces from inside of the cube, instead of from outside (default).
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x111122, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	sim.scene.add(skyBox);

	//console.log('land is a go')
}
Land.prototype.update = function(sim) {
	
	// update plane and reset for next turn
	for (var i = 0, l = this.plane.geometry.vertices.length; i < l; i++) {
		this.plane.geometry.vertices[i].z = Math.random() * 3 / sim.time.delta;
	}
	this.plane.geometry.verticesNeedUpdate = true;
	
	// slowly rotate spheres
	this.sphere1.rotation.y += 0.0001;
	this.sphere2.rotation.y += 0.00005;
	
}
Land.prototype.render = function(sim) {}
