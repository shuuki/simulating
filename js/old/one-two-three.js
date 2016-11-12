/**** INIT */

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
	//antialias: true
});
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
renderer.shadowMapEnabled = true;
//renderer.shadowMapType = THREE.BasicShadowMap;

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


var geometry2 = new THREE.PlaneGeometry(12,12,12,12);
var material2 = new THREE.MeshPhongMaterial({
	color: 0xffff00,
	wireframe: true
});
var plane = new THREE.Mesh(geometry2, material2);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = 5;
plane.position.y =-2;


for (var i = 0, l = geometry2.vertices.length; i < l; i++) {
	geometry2.vertices[i].z = Math.random() * 1;
}


/**** LIGHTING */

var light = new THREE.AmbientLight(0x404040)
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0,1,0);
directionalLight.castShadow = true;
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(1,1,0);
directionalLight2.castShadow = true;
scene.add(directionalLight2);


/**** CAMERA */

camera.position.z = 10;
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
