
// load

window.addEventListener( 'load', function()
{
	Sim.init( deepland );
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


// wish list:

// motion independent of orientation

// collision

// gravity

// be able to update land geometry

// play sounds


// entities

// Craft

function Craft( position, velocity, orientation )
{

	this.mass = 1980;
	this.movementSpeed = 50;
	this.rollSpeed = 4;

	this.moveState = {
		up: 0, down: 0,
		left: 0, right: 0,
		forward: 0, back: 0,
		pitchUp: 0, pitchDown: 0,
		yawLeft: 0, yawRight: 0,
		rollLeft: 0, rollRight: 0
	};

	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
	this.tmpQuaternion = new THREE.Quaternion();

	this.history = [];

}
Craft.prototype.init = function(sim)
{

	// set up cone geometry
	var geometry = new THREE.ConeGeometry( 1, 3, 6 );
	geometry.rotateX( -1.6 );

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffaa,
		wireframe: true 
	});

	this.cone = new THREE.Mesh( geometry, material );
	this.cone.castShadow = true;
	this.cone.receiveShadow = true;

	// add cone to scene
	sim.scene.add(this.cone);

	// add camera to cone
	this.cone.add(sim.camera)
	sim.camera.position.set( 0, 0.4, 0.5 )
	sim.camera.rotation.set( 0, 0, 0 )


	// movement history path
	var path = new THREE.Path();
	var geometry = path.createGeometry( this.history );
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
	});

	this.line = new THREE.Line( geometry, material );
	this.line.geometry.dynamic = true;
	this.line.geometry.verticesNeedUpdate = true;
	this.line.castShadow = true;
	this.line.receiveShadow = true;
	sim.scene.add( this.line );

	console.log( 'craft is a go' )
}
Craft.prototype.update = function( sim )
{
	//var thrust;	
	//var drag;
	var brakes = 0;
	var delta = sim.time.delta / 1000;
	var moveMult = delta * ( this.movementSpeed / this.mass ) ;
	var rotMult = delta * ( this.rollSpeed / this.mass );


	// check event listeners for keys

	// thrusters

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


	// brakes
	
	if (sim.input.isDown(sim.input.SPACE))
	{
		brakes = 0.985;

		var queue = (Object.keys(this.moveState));
		while (queue.length > 0)
		{
			this.moveState[queue[0]] = this.moveState[queue[0]] * brakes;
			queue.shift()
		}
	}


	// update rotation vector

	this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
	this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
	this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
	//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );


	// update movement vector

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

	//var latest = new THREE.Vector3( this.cone.position.x, this.cone.position.y, this.cone.position.z)

	//this.line.geometry.vertices.push( latest );

	//this.history.push( latest ) 
	//if (history.length > 200) {
	//	history.shift();
	//}
	//this.line.geometry.verticesNeedUpdate = true;



	//this.cone.rotation.set(this.rotationVector)

	//this.cone.rotation.setFromVector3(this.orientation)

	//this.cone.position.add(this.velocity)


	
}
Craft.prototype.render = function(sim) {





	// update plane and reset for next turn
	//	for (var i = 0, l = this.history.length; i < l; i++) {
			
	//	}
	//	for (var key = 0; key < this.history.length; key++)
	//	{
			//context.lineTo(this.history[key].x, this.history[key].y);
	//	}
		//context.strokeStyle = 'rgba(0,255,255,0.3)';





}


function Light() {}
Light.prototype.init = function(sim)
{
	
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
function Land() {}
Land.prototype.init = function(sim)
{
	// geometry

	// noise helper
	var gen = new SimplexNoise();
	function noise( nx, ny, mult ) {
		return gen.noise2D( nx, ny ) * mult;
	}

	// little sphere
	var geometry = new THREE.IcosahedronGeometry( 1200, 3 );
	for (var i = 0, l = geometry.faces.length; i < l; i++) {
		geometry.faces[i].color.setHSL( Math.random() * 2 + 0.2, 0.1, 0.5 )
	}
	var material = new THREE.MeshPhongMaterial({
		color: 0xffff00,
		shading: THREE.FlatShading,
		vertexColors: THREE.VertexColors
	});
	this.sphere1 = new THREE.Mesh( geometry, material );
	this.sphere1.position.set( 600, 1200, -1200 )
	this.sphere1.castShadow = true;
	this.sphere1.receiveShadow = true;
	sim.scene.add(this.sphere1);

	// big sphere
	var geometry = new THREE.IcosahedronGeometry( 3700, 2 );
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		shading: THREE.FlatShading,
	});
	this.sphere2 = new THREE.Mesh( geometry, material );
	this.sphere2.position.set(2400, -1540, -50000)
	this.sphere2.castShadow = true;
	this.sphere2.receiveShadow = true;
	sim.scene.add(this.sphere2);

	
	// plane
	var plane = new THREE.PlaneGeometry( 1000, 1000, 20, 20 );

	for (var i = 0, l = plane.vertices.length; i < l; i++) {
		var width = 1000,
			height = 1000,
			nx = plane.vertices[i].x / width - 0.5,
			ny = plane.vertices[i].y / height - 0.5;

		plane.vertices[i].z = noise(1 * nx, 2 * ny, 32)
												+ noise(2 * nx, 2 * ny, 16)
												+ noise(3 * nx, 3 * ny, 4)
												+ noise(8 * nx, 8 * ny, 8);

	}
	var material2 = new THREE.MeshPhongMaterial({
		color: 0xff00ff,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		//wireframe: true
	});
	this.plane = new THREE.Mesh(plane, material2);
	this.plane.position.set(30,-10,-40)
	this.plane.rotation.set(-1.52,0,-3)
	this.plane.castShadow = true;
	this.plane.receiveShadow = true;
	this.plane.geometry.dynamic = true;
	this.plane.geometry.verticesNeedUpdate = true;
	sim.scene.add(this.plane);

	// sky
	var skyGeometry = new THREE.SphereGeometry( 1000000, 10, 10 );
	var skyMaterial = new THREE.MeshBasicMaterial({
		// maybe texture?
		//map: new THREE.TextureLoader().load('demo/deepland/eso.png'),
		color: 0x111122,
		side: THREE.BackSide
	});
	this.sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sim.scene.add(this.sky);

	// init done
	console.log('land is a go')

}
Land.prototype.update = function(sim)
{	

	// update plane and reset for next turn
	//for (var i = 0, l = this.plane.geometry.vertices.length; i < l; i++) {
	//	this.plane.geometry.vertices[i].z = Math.random() / sim.time.delta;
	//}
	//this.plane.geometry.verticesNeedUpdate = true;
	
	// slowly rotate spheres
	this.sphere1.rotation.y += 0.0001;
	this.sphere2.rotation.y += 0.00005;

}
Land.prototype.render = function(sim) {}
