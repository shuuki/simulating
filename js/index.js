
// load events

window.addEventListener('load', function()
{
	Sim.test();
	Sim.init({
		//id: 'display',
		//width: 320,
		//height: 200,
		seed: flatland
	});
	Sim.start();
}, false);



// seed

var flatland = {
	test: 'seed loaded'
}
