

// dom elements

// initialize ui elements
'use strict';

var log = document.getElementById('log');
var stopwatch = document.getElementById('stopwatch');
var controls = document.getElementById('controls');

var map = document.getElementById('map');

// alternate dummy map for designing

var wump = [['.', ',', '.', '.', 'T', '.', ',', ',', '.', '/'], [',', 'Y', '.', '.', '.', '.', '.', ',', '/', '/'], ['/', ',', '.', '.', '.', '.', '.', '.', ',', ','], ['/', '/', '.', '.', 'Q', '.', '.', '.', '.', '.'], ['i', '/', ',', '.', '.', '.', '.', '.', '.', '.'], ['/', ',', '.', '.', '.', '.', '.', '.', '.', '.'], [',', '.', '.', '.', '.', '.', '.', 'H', '.', '.'], ['.', '.', ',', '.', '.', '.', '.', '.', '.', '.'], ['.', ',', '%', '.', '.', '.', '.', '.', '.', '.'], ['.', ',', ',', '?', ';', '.', 'D', '.', '.', '.']];

//replace 'wump' with 'land' for real generation
for (var i = 0; i < wump.length; i++) {
	map.innerHTML += wump[i].join('') + '<br>';
}

//

// time

// instatiate the void

var time = {};
var world = {};

// seed time and initialize variables

function seedTime() {
	time.seed = Math.ceil(Math.random() * 8764);
	time.clock = time.seed;
	time.alive = 0;
	updateTime();
}

function updateTime() {
	time.day = time.clock % 24;
	time.month = time.clock % 730;
	time.year = time.clock % 8760;
	world.sky = getLabel(time.day, sky.phases);
	world.moon = getLabel(time.month, moon.phases);
	world.season = getLabel(time.year, season.phases);
}

function advanceHour() {
	time.clock++;
	time.alive++;
	updateTime();
}

var rushing;
var rushLeft = 0;
function fastTime(duration) {
	rushLeft += duration;
	if (!rushing) {
		rushing = setInterval(function () {
			rushLeft--;
			time.clock++;
			updateTime();
			if (rushLeft <= 0) {
				clearInterval(rushing);
				rushing = undefined;
			}
		}, 10); // speed in ms
	}
}

// print stopwatch timer

// fast forward nee fwoosh

// special hack sauce to reveal controls
// controls.style.display = 'block'	

/*

advance time 
ticks

minutes
hours

*/

// clock ticker

var ticks = 0,
    ticking,
    timer;

function ticker() {
	timer = setTimeout(addTick, 1000);
	playSandbox();
}

function addTick() {
	ticks++;
	//	if (ticks % 2 == 0)
	//		ticking = 'tock' + '<br>'
	//	else
	//		ticking = 'tick' + '<br>'
	printTimer();
	ticker();
}

function pauseTicker() {
	clearTimeout(timer);
	ticking = 'click';
	printTimer();
}

function stopTicker() {
	clearTimeout(timer);
	ticks = 0;
	ticking = 'bzzt';
	printTimer();
}

function printTimer() {
	stopwatch.innerHTML = ticks;
	log.innerHTML += ticking + ' ';
}

// just get something on the fucking screen

function playSandbox() {

	var chance = 12;
	var what = Math.ceil(Math.random() * chance);

	//	log.innerHTML += what

	if (what < chance / 2) doYa();else doNa();

	function doYa() {
		peeps.rabbit.health -= 1;
		if (peeps.rabbit.health <= 0) {
			log.innerHTML += 'STAAAAAAHP CHIPPY WINS ';
		} else {
			log.innerHTML += '<br>' + 'YA ';
		}
	}

	function doNa() {
		peeps.chipmunk.health -= 1;
		if (peeps.chipmunk.health <= 0) {
			log.innerHTML += 'STAAAAAAHP WABBIT WINS ';
		} else {
			log.innerHTML += '<br>' + 'NA ';
		}
	}

	log.innerHTML += 'wabbit' + peeps.rabbit.health + '<br>' + 'chippy' + peeps.chipmunk.health + '<br>';
} // el play sandbox

var peeps = {
	rabbit: { 'health': 6, 'agility': 3 },
	chipmunk: { 'health': 4, 'agility': 4 }
};

//     __       __              
//    / /  ___ / /__  ___ _______
//   / _ \/ -_) / _ \/ -_) __(_-<
//  /_//_/\__/_/ .__/\__/_/ /___/
//            /_/               
// 												helpers

//iterate over index of flavor text objects and print to log
function printIndex(reference) {
	for (var i in reference) {
		if (reference.hasOwnProperty(i)) {
			log.innerHTML += '<br>' + i + ' ' + reference[i];
		}
	}
	return 'nothing';
}

// get values from index of flavor text objects
function getLabel(interval, labels) {
	var phase = _.pluck(labels, 'bound');
	for (var i = 0; i < phase.length; i++) {
		if (interval < phase[i]) {
			return labels[i].label;
		}
	}
	return 'void';
}

// toggle visibility of a dom element
function toggleVisibility(id) {
	var e = document.getElementById(id);
	if (e.style.display == 'block') {
		e.style.display = 'none';
	} else {
		e.style.display = 'block';
	}
}

//       __     __     
//   ___/ /__ _/ /____ _
//  / _  / _ `/ __/ _ `/
//  \_,_/\_,_/\__/\_,_/
//                  data

// to add more raw data for flavor text, use this format:
// flavor = { phases : [ {bound: 0, label: 'zero'}, {bound: 1, label: 'one'} ] }

// composition of the firmament

var sky = {
	phases: [{ bound: 5, label: 'night' }, { bound: 7, label: 'dawn' }, { bound: 11, label: 'morning' }, { bound: 13, label: 'noon' }, { bound: 15, label: 'afternoon' }, { bound: 19, label: 'evening' }, { bound: 21, label: 'twilight' }, { bound: 24, label: 'night' }]
};

var moon = {
	phases: [{ bound: 89, label: 'new' }, { bound: 179, label: 'crescent' }, { bound: 269, label: 'first quarter' }, { bound: 359, label: 'gibbous' }, { bound: 449, label: 'full' }, { bound: 539, label: 'disseminating' }, { bound: 629, label: 'last quarter' }, { bound: 720, label: 'balsamic' }]
};

var season = {
	phases: [{ bound: 2191, label: 'summer' }, { bound: 4382, label: 'autumn' }, { bound: 6572, label: 'winter' }, { bound: 8764, label: 'spring' }]
};

/*


   __             __
  / /__ ____  ___/ /
 / / _ `/ _ \/ _  / 
/_/\_,_/_//_/\_,_/  
                    

                     
  __ _  ___ ____  ___
 /  ' \/ _ `/ _ \(_-<
/_/_/_/\_,_/ .__/___/
          /_/        


                              __         
 ___ ___  _______  __ _____  / /____ ____
/ -_) _ \/ __/ _ \/ // / _ \/ __/ -_) __/
\__/_//_/\__/\___/\_,_/_//_/\__/\__/_/   
                                         



   ____      __   __ 
  / _(_)__ _/ /  / /_
 / _/ / _ `/ _ \/ __/
/_//_/\_, /_//_/\__/ 
     /___/           




*/

function actor(name, health, attacks) {
	this.name = name;
	this.health = health;
	this.attacks = {
		'damage': damage,
		'cost': cost,
		'cooldown': cooldown
	};
}

function attack(damages, amount, cost, cooldown, chance) {
	this.damages = damages;
	this.amount = amount;
	this.cost = cost;
	this.cooldown = cooldown;
	this.chance = chance;

	return;
}

function action() {}

//damage multiplier

attacks = {
	bite: {
		cost: 1,
		damage: 2,
		cooldown: 2
	},
	scratch: {
		cost: 1,
		damage: 1,
		cooldown: 1
	},
	grapple: {
		cost: 2,
		damage: 1,
		cooldown: 3
	}
};

cooldown * 1000;

var dawg = {

	'aggression': 1,
	'curiosity': 1,
	'boldness': 1,

	'charm': 1,
	'cunning': 1,
	'insight': 1,

	'notoriety': 1,
	'bodycount': 1,
	'lived': 0,

	'health': 4,
	'maxHealth': 6,
	'stamina': 8,
	'maxStamina': 8,
	'agility': 6,

	'constitution': 4,
	'resolve': 3
};

var bandit = {
	health: 4,
	maxHealth: 4
};

var beast = {
	name: 'Beast',
	type: '',
	stats: {

		health: 6,
		healthMax: 6,
		stamina: 4,
		staminaMax: 6,

		agility: 4,
		resolve: 3,
		constitution: 5,
		resistance: 2

	}
};

var rabbit = {
	name: 'Rabbit',
	health: 2, healthMax: 3,
	stamina: 4, staminaMax: 6,
	agility: 8
};

/*


// what it damages
// and by how much
// multiplier optional


cooldown * 1000

//damage multiplier





// always has to be a wildcard, a chance for the unexpected


attacks = {
	bite : {
		cost : 1,
		damage: 2,
		cooldown: 2
	},
	scratch: {
		cost : 1,
		damage: 1,
		cooldown: 1
	},
	grapple : {
		cost : 2,
		damage: 1,
		cooldown: 3
	}
}


*/

// test
function testStats() {
	log.innerHTML += beast.stats.health + Object.keys(beast.stats).join(' ') + Object.keys(beast.attacks).join(' ');
}

/*

new actor(rabbit, )
new actor(chimpunk, )
new actor(frog, )


// health / health = 
//var beast = new actor();

*/

var attack = function attack() {};

var fight = function fight(player, actor) {

	return player.health / actor.health;
};

function printFight() {
	log.innerHTML += fight(dawg, bandit) + ' ';
}

function clearFight() {
	hits.innerHTML = '';
}

/*
tick

grab actors


instigator

target

actions

	attack
		types
	defend
	wait
	flee
	submit
	kill
	loot
	leave



tock
*/

/*



boldness => intimidation
attack => defense
agility => agility
action => stamina 




attack - defense = damage
chance to save agility + 1d20



function () {
	return 
}

agent/patient

function match(instigator, ) {

	function checkStats() {
		return
	}

}







function runChecks() {
	// if fight is happening
	// 
	log.innerHTML += ' + '
}





attack type

ranged
close

bite does damage, costs stamina

growl is chance to intimidate

new attack growl 

attack intimidation takes 0 stamina





pc style vs npc style
npc is ai director style, decision trees
pc just checks what actions are possible




for each entity


function checkStats() {}

function checkFriendliness() {
	alignment
	notoriety
}

function checkDominance() {}

function checkAttack() {
	attack
	defense
	recovery
}






clock always has to be going

build group of actors
	NPCs, humans + animals
	friendliness check
	initiative check
	attack loop check


struggle for dominance

in case of opening, take it, or it's a roll

attacks damage health, cost stamina

when paralyzed enemy regains stamina

fight for health and stamina

get to the end of health, dead

get to the end of stamina, disabled

kill or leave? 

notoriety percentage

some things to think about
friendliness / notoriety
gifts / dialogue
disposition

back off
get close
incapacitated

if (stamina < 1)
	incapacitated

thing between waiting and fleeing, retreating
thing more than yielding, incapacitated

actions

get stats

check reaction
return reaction

check initiative
Available Actions
Do Action
Check Health
Check Stamina

resolve

	

attack: {
	'damage' : ,
	'cost' : ,
	'cooldown' : , 
}


333.3ms
constitution

fight clock:
3:1 quick beats
4:1 middle beats



switch timer sketch

switch () {
	case 'start' : 
		break;
	case 'stop' : 
		break;
	case 'wipe' : 
		break;
	default:
	;
}


*/

// dice rolls

//var rolls = document.getElementById( 'rolls' );

var rollList = [];

function roll(sides) {
	var die;
	die = Math.ceil(Math.random() * sides);
	rollList.push(die);
	log.innerHTML += rollList[rollList.length - 1] + ' ';
}

function clearLog() {
	rollList = [];
	log.innerHTML = ' ';
}

/*

var economy = {
	// add something
	// something is lost
	// more is lost earlier
	// unlock better ways of gathering
	// or it's just what's running
}

*/

// 2d array
var edge = 10;

// base 1d map array
var base = [];

for (var x = 1; x <= edge * edge; x++) {
	base.push('.');
}

// convert 1d list to 2d matrix

function listToMatrix(list, bound) {
	var matrix = [],
	    x,
	    y;
	for (x = 0, y = -1; x < list.length; x++) {
		if (x % bound === 0) {
			y++;
			matrix[y] = [];
		}
		matrix[y].push(list[x]);
	}
	return matrix;
}

var land = listToMatrix(base, edge);

//  hard coding some things
//  [y][x]
land[4][3] = '@';
land[6][6] = 'H';
land[2][1] = 'Y';
land[9][3] = '?';
land[8][2] = '&';

/* idea scratchpad
var terrainGenerator = {
		//>	random for top level
		//	>	random for next level
		//		>	etc
};
var terrainOutput = [[]];
*/

/*
//////////////////////////////////////////////////
// map configuration
//////////////////////////////////////////////////

var mapGrid = [],
		mapX = 12,
		mapY = 12;

//////////////////////////////////////////////////
// landscape configuration
//////////////////////////////////////////////////

var biomeChance = [0.15, 0.1, 0.15, 0.05, 0.02, 0.03, 0.01, 0.01, 0.01, 0.01, 0.01, 0.025, 0.025, 0.03];
var biomeSprite = [',', '/', ';', 'i', 'T', 'Y', '$', '&', '%', '?', 'h', 'L', 'H', '.'];

//////////////////////////////////////////////////
// generate landscape array
//////////////////////////////////////////////////

for (var i = 0; i < mapX * mapY; i++) {
	function getSprite() {
		var dice = Math.random();
		var s = 0;
		var lastIndex = biomeChance.length - 1;

		for (var i = 0; i < lastIndex; ++i) {
			s += biomeChance[i];
			if (dice < s)
				return biomeSprite[i];
		}
		return biomeSprite[lastIndex];					// otherwise give water}
	}
	mapGrid.push(getSprite());								// add new tile to map array
}

//////////////////////////////////////////////////
// print out map
//////////////////////////////////////////////////

var weird;
for (var i = 0; i < mapGrid.length; i++) {
		document.write(mapGrid[i]);
		if (((i + 1) % mapX) === 0) {
				weird = mapGrid[i];
				document.write("<br>");
		}
}

*/

/*
class gameState {
	constructor() {
		this.parent = null;
	}
	initialize() {}
	pause() {}
	resume() {}
	dispose() {}
	handleEvent(event) {}
	draw(deltaTime) {}
	step(deltaTime) {}
}
*/

/*

////////////////////////////////
// a cooler fwoosh /d

var tardis = document.getElementById("tardis");
tardis.onclick = fwoosh;



var fwooshing;
var fwooshRemaining = 0;

function fastForward(x) {
	fwooshRemaining += x;
	if (!fwooshing) {
		fwooshing = setInterval(function() {
			fwooshRemaining--;
			timeClock++;
			updateTime();
			if (fwooshRemaining <= 0) {
				clearInterval(fwooshing);
				fwooshing = undefined;
			}
		}, 10);// fwoosh speed in ms
	}
}

function fwoosh() {
	fastForward(Math.ceil(Math.random()*720));
}

////////////////////////////////






////////////////////////////////
// seasons + weather

var weather =
{
	'summer' : [
		{ type: 'temp', bound: 91, range: { 0: 'cold', 0: 'cool', 0: 'mild', 1: 'warm', 13: 'hot', 91: 'scorching' }},
		{ type: 'precip', bound: 67, range: { 55: 'dry', 66: 'rain', 67: 'snow' }},
		{ type: 'wind', bound: 92, range: { 53: 'calm', 65: 'breezy', 77: 'windy', 92: 'gusty' }},
		{ type: 'clouds', bound: 78, range: { 55: 'clear', 60: 'hazy', 74: 'cloudy', 78: 'overcast' }}
	],
	'autumn' : [
		{ type: 'temp', bound: 92, range: { 0: 'cold', 12: 'cool', 34: 'mild', 56: 'warm', 91: 'hot', 92: 'scorching' }},
		{ type: 'precip', bound: 67, range: { 57: 'dry', 65: 'rain', 67: 'snow' }},
		{ type: 'wind', bound: 93, range: { 59: 'calm', 91: 'breezy', 92: 'windy', 93: 'gusty' }},
		{ type: 'clouds', bound: 82, range: { 57: 'clear', 61: 'hazy', 73: 'cloudy', 82: 'overcast' }}
	],
	'winter' : [
		{ type: 'temp', bound: 91, range: { 52: 'cold', 90: 'cool', 91: 'mild', 0: 'warm', 0: 'hot', 0: 'scorching' }},
		{ type: 'precip', bound: 71, range: { 57: 'dry', 62: 'rain', 71: 'snow' }},
		{ type: 'wind', bound: 90, range: { 80: 'calm', 90: 'breezy', 0: 'windy', 0: 'gusty' }},
		{ type: 'clouds', bound: 84, range: { 57: 'clear', 60: 'hazy', 72: 'cloudy', 84: 'overcast' }}
	],
	'spring' : [
		{ type: 'temp', bound: 91, range: { 0: 'cold', 14: 'cool', 50: 'mild', 69: 'warm', 91: 'hot', 0: 'scorching' }},
		{ type: 'precip', bound: 58, range: { 51: 'dry', 57: 'rain', 58: 'snow' }},
		{ type: 'wind', bound: 92, range: { 0: 'calm', 66: 'breezy', 77: 'windy', 92: 'gusty' }},
		{ type: 'clouds', bound: 81, range: { 51: 'clear', 56: 'hazy', 71: 'cloudy', 81: 'overcast' }}
	]
};


var currentSeason,
		currentTemp,
		currentPrecip,
		currentWind,
		currentClouds;


////////////////////////////////

// angel says to the dawg: "listen. listen to the earth."



// some notes
// needs, todo

// need time buffer, iterate through for update after actions
// visible, not visible for sun and moon
// if timeAlive = 8 years, old dawg : ages? 
// sun
// weather
// drag butt
// eat grass


//cellular automata script
/*


// this variable will be used to store the various unconnected caverns 
var caverns = [];

// begin looping through the map 
for (var x = 1; x < this.size.x; x++) {
    for (var y = 1; y < this.size.y; y++) {
        var cavern = [];
        var totalCavern = [];

        if (this.data[x][y].type != "dirty floor") { // we've already been over this tile or it is already part of a cavern, 
            // no need to check it 
            continue;
        }

        cavern.push(this.data[x][y]);
        totalCavern.push(this.data[x][y]);

        while (cavern.length > 0) {
            var n = cavern.pop();

            if (n.type == "dirty floor") { // set a flag on the tile indicating it has already been checked 
                n.setType("floor");

                for (var i = 0; i < 8; i++) {
                    var curTile = this.data[n.position.x + x_array[i]][n.position.y + y_array[i]];
                    if (curTile.type == "dirty floor") {
                        cavern.push(curTile);
                        totalCavern.push(curTile);
                    }
                }
            }
        }

        // add this cavern 
        caverns.push(totalCavern);

        // sort the caverns
        caverns.sort(function (a, b) {
            return (b.length - a.length);
        });
    }
}
// remove the largest cavern, as it is the main cavern
caverns.shift();

// now that we've got the unconnected caverns, change their tile type 
if (caverns.length > 0) {
    for (var i = 0; i < caverns.length; i++) {
        for (var j = 0; j < caverns[i].length; j++) {
            caverns[i][j].setType("wall");
        }
    }
}

*/

// dante's weather iteration
/*
button#go Go

.season
ul.properties
////////////////////
// Environments
////////////////////
var goBtn = document.querySelector('#go');
var season = document.querySelector('.season');
var propertiesUl = document.querySelector('.properties');

////////////////////
// Functionality
////////////////////

// Specific to this program. Disaply the given state onto the environment
function display(state)
{
	season.textContent = state.season;
	propertiesUl.innerHTML = '';
	
	// Let's generate DOM nodes from the object of {metric: value} EX: { Temperature: Scortching }
	var listItems = _.map(state.metrics, (value, key) => {
		var li = document.createElement('li');
		li.textContent = key + ': ' + value;
		return li;
	});
	
	// And finally, let's append each one to the properties ul element
	listItems.forEach((li) => { propertiesUl.appendChild(li); });
}

// Given an object of properties => probability with labels, pick a label for each property. Return the new state object.
function rollProperties(propertiesWithProbabilities)
{
	// Since we expect an object of the form:
	*/
/*
{
"property 1": { "label": relativeProbability, "label": relativeProbability, ... },
"property 2": { "label": relativeProbability, "label": relativeProbability, ... },
"property 3" : { "label": relativeProbability, "label": relativeProbability, ... }
}
*/
// We can just map the values of that object (the object filled with label/probability) into simply the selected label!
/*
return _.mapValues(propertiesWithProbabilities, (probabilityObject) => {
	// Start by filtering out 0 probability events. For an object, we use omit to do this
	// @see: http://devdocs.io/lodash/index#omit
	var filteredEvents = _.omit(probabilityObject, (value, key) => { return value <= 0; });
	
	// Calculate the sum of the probabilities
	var sum = _.reduce(filteredEvents, (acc, value) => { return acc + value; }, 0);
	
	// Pick a number from 0 -> sum, inclusive
	var choice = _.random(sum);
	
	// Now to find the bin. We start with 0 sum, and a list of the labels to look at (filtering out 0s!)
	var runningSum = 0;
	var keys = Object.keys(filteredEvents);
	for (var i = 0; i < keys.length; i++)
	{
		var label = keys[i];
		// First, we advance the running sum by the current label's probability
		runningSum += filteredEvents[label];
		
		// We choose a label if the running sum has passed the choice value
		if (runningSum >= choice)
		{
			// A for loop does not create a scop -- that means this return will be the value for the mapValues call at the start!
			return label;
		}
	}
	
	// If we somehow have not chosen an event (should not happen!), the let's just return a random one!
	return _.sample(keys);
});
}
////////////////////
// Event Listeners
////////////////////
goBtn.addEventListener('click', (evt) =>
{
// Pick a season
var season = _.sample(Object.keys(weather));

// Generate the state
var properties = rollProperties(weather[season]);

// Display the results
display({
	season: season,
	metrics: properties
});
});



////////////////////
// THE DATA
////////////////////
var weather = {"Summer":{"Temperature":{"Cold":0,"Cool":0,"Mild":0,"Warm":1,"Hot":12,"Scortching":78},"Precipitation":{"Dry":50,"Rain":11,"Snow":1},"Wind":{"Calm":53,"Breezy":12,"Windy":12,"Gusty":15},"Cloud":{"Clear":55,"Hazy":5,"Cloudy":14,"Overcast":4}},"Autum":{"Temperature":{"Cold":0,"Cool":12,"Mild":22,"Warm":22,"Hot":35,"Scortching":1},"Precipitation":{"Dry":56,"Rain":8,"Snow":2},"Wind":{"Calm":59,"Breezy":32,"Windy":1,"Gusty":1},"Cloud":{"Clear":57,"Hazy":4,"Cloudy":12,"Overcast":9}},"Winter":{"Temperature":{"Cold":52,"Cool":38,"Mild":1,"Warm":0,"Hot":0,"Scortching":0},"Precipitation":{"Dry":57,"Rain":5,"Snow":9},"Wind":{"Calm":80,"Breezy":10,"Windy":0,"Gusty":0},"Cloud":{"Clear":57,"Hazy":3,"Cloudy":12,"Overcast":12}},"Spring":{"Temperature":{"Cold":0,"Cool":14,"Mild":36,"Warm":19,"Hot":22,"Scortching":0},"Precipitation":{"Dry":51,"Rain":6,"Snow":1},"Wind":{"Calm":0,"Breezy":66,"Windy":11,"Gusty":15},"Cloud":{"Clear":51,"Hazy":5,"Cloudy":15,"Overcast":10}}};
*/
