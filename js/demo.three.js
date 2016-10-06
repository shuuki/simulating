/**** INIT */

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
	//antialias: true
});
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.BasicShadowMap;

document.body.appendChild(renderer.domElement);


/**** GEOMETRY */

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({
	color: 0xff00ff,
	//wireframe: true
});
var cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);




var geometry2 = new THREE.PlaneGeometry(10,10,20,20);
var material2 = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shading: THREE.FlatShading,
	//wireframe: true
});
var plane = new THREE.Mesh(geometry2, material2);

plane.castShadow = true;
plane.receiveShadow = true;

plane.rotation.x = 5;
plane.position.y = -1;
plane.rotation.z = 2;


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
	color: 0xff0000,
	//linewidth: 1,
});

var line = new THREE.Line(geometry, material);

line.castShadow = true;
line.receiveShadow = true;

scene.add(line);






for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
	geometry2.vertices[i].z = (Math.random() * i)/300;
}


/**** LIGHTING */

var light = new THREE.AmbientLight(0x404040)
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.set(0,1,20);
directionalLight.castShadow = true;
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0x0000ff, 1);
directionalLight2.position.set(1,2,0);
directionalLight2.castShadow = true;
scene.add(directionalLight2);


/**** CAMERA */

camera.position.z = 12;
camera.position.y = 0;
camera.position.x = -4;

camera.rotation.z = -0.1;
camera.rotation.y = -0.4;
camera.rotation.x = -0.1;

/**** */

function render() {
	requestAnimationFrame(render);
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}
render();
