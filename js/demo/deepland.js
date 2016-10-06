var scene, camera, renderer, cube, plane, line;

var screenWidth = window.innerWidth,
	screenHeight = window.innerHeight,
	screenPixels = 2;


// load

window.addEventListener('load', function()
{
	init();
	sim.init();
	sim.start();
}, false);







/**** INIT */

function init()
{

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70, screenWidth / screenHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer();
renderer.setSize(screenWidth / screenPixels, screenHeight / screenPixels, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

document.body.appendChild(renderer.domElement);









/**** GEOMETRY */

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({
	color: 0x111111,
	//wireframe: true
});

cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);





var geometry2 = new THREE.PlaneGeometry(1000,1000,50,50);
for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
	geometry2.vertices[i].z = (Math.random() * i)/200;
}

var material2 = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shading: THREE.FlatShading,
	//wireframe: true
});

plane = new THREE.Mesh(geometry2, material2);
plane.position.set(30,-10,-40)
plane.rotation.set(-1.52,0,-3)
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);








var geometry = new THREE.ConeGeometry( 1, 3, 6 );
var material = new THREE.MeshBasicMaterial({
	color: 0xffff00,
	wireframe: true
});
var cone = new THREE.Mesh( geometry, material );
cone.castShadow = true;
cone.position.set(-6,0,-1)
cone.rotation.set(-1,0,-1)
cone.receiveShadow = true;

scene.add( cone );


/**** LIGHTING */

var ambientLight, spotLight, spotLight2;

ambientLight = new THREE.AmbientLight(0x212121)
scene.add(ambientLight);

spotLight = new THREE.DirectionalLight(0xffffff, 0.5);
spotLight.position.set(0,20,20);
spotLight.castShadow = true;
scene.add(spotLight);


/**** CAMERA */

camera.position.set(-4, 0, 12);

}


/**** */

function render() {
	requestAnimationFrame(render);

	//cube.rotation.x += 0.005;
	//cube.rotation.y += 0.01;
	//camera.lookAt(cube.position);


	renderer.render(scene, camera);
}

render();
