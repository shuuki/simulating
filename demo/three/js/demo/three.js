var scene, camera, renderer, cube, plane, line;

var screenWidth = window.innerWidth,
	screenHeight = window.innerHeight,
	screenPixels = 2;




// load

window.addEventListener('load', function()
{
	init();
	Sim.init();
	Sim.start();
}, false);







/**** INIT */

function init()
{

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70, screenWidth / screenHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer({antialias: true});
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





var geometry2 = new THREE.PlaneGeometry(100,100,30,30);
for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
	geometry2.vertices[i].z = (Math.random() * i)/200;
}

var material2 = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shading: THREE.FlatShading,
	//wireframe: true
});

plane = new THREE.Mesh(geometry2, material2);
plane.position.set(30,0,-40)
plane.rotation.set(-1.52,0,-3)
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);




var curve = new THREE.EllipseCurve(
	0, 0, // ax, aY
	2, 4, // xRadius, yRadius
	0, 3 / 2 * Math.PI, // aStartAngle, aEndAngle
	false // aClockwise
);



var points = curve.getSpacedPoints(20);
var path = new THREE.Path();
var geometry = path.createGeometry(points);
var material = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	//linewidth: 1,
});

line = new THREE.Line(geometry, material);
line.castShadow = true;
line.receiveShadow = true;
scene.add(line);









/**** LIGHTING */

var ambientLight, spotLight, spotLight2;

ambientLight = new THREE.AmbientLight(0x212121)
scene.add(ambientLight);

spotLight = new THREE.DirectionalLight(0xff0000, 1.8);
spotLight.position.set(0,1,20);
spotLight.castShadow = true;
scene.add(spotLight);

spotLight2 = new THREE.DirectionalLight(0x0000ff, 1);
spotLight2.position.set(-40,40,0);
spotLight2.castShadow = true;
scene.add(spotLight2);


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
