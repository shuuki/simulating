var scene, camera, renderer, cube, plane, line;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;


// load

window.addEventListener('load', function()
{
	init();
	//sim.test();
	//sim.init();
	//sim.start();
}, false);







/**** INIT */

function init()
{

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(60, screenWidth / screenHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer({/* antialias: true */});
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
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
var material2 = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shading: THREE.FlatShading,
	//wireframe: true
});
plane = new THREE.Mesh(geometry2, material2);

plane.castShadow = true;
plane.receiveShadow = true;

plane.rotation.set(-1.52,0,-3)
plane.position.set(30,0,-40)

scene.add(plane);



for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
	geometry2.vertices[i].z = (Math.random() * i)/200;
}

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

var light = new THREE.AmbientLight(0x212121)
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xff0000, 1.8);
directionalLight.position.set(0,1,20);
directionalLight.castShadow = true;
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0x0000ff, 1);
directionalLight2.position.set(-40,40,0);
directionalLight2.castShadow = true;
scene.add(directionalLight2);


/**** CAMERA */

camera.position.set(-4, 0, 12);
camera.rotation.set(-0.1, -0.4, -0.1);

}


/**** */

function render() {
	requestAnimationFrame(render);
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}

render();
