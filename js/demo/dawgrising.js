// angel says to the dawg: 'listen. listen to the earth.'


// dom

var dom = {
	interface: document.getElementById('interface'),
	timer: document.getElementById('timer'),
	weather: document.getElementById('weather')
}


// time constructor

function Time()
{
	// set default times
	this.clock = 0;
	this.seed = 0;
	this.alive = 0;
	this.shifting;
	this.shiftRemaining = 0;
}

Time.prototype.spin = function(spin)
{
	// pick a random hour in a year
	var spin = spin || Math.ceil(Math.random() * 8764);
	
	// update clocks
	this.clock = spin;
	this.seed = spin;
	this.alive = 0;

	// stop shifting if in progress
	this.shifting;
	this.shiftRemaining = 0;

	this.update();
}

Time.prototype.update = function()
{
	// update all internal increments
	this.day = this.clock % 24;
	this.month = this.clock % 720;
	this.year = this.clock % 8764;

	// update environment
	this.sky = this.checkSky(this.day);
	this.moon = this.checkMoon(this.month);
	this.season = this.checkSeason(this.year);
	this.weather = this.checkWeather(this.season);
	
	// draw new values
	this.draw();
}

Time.prototype.draw = function()
{
	dom.timer.innerHTML = '';
	traverse(this, print);
}

Time.prototype.checkSky = function(timeDay)
{	
	var currentSky;
	
	var sky = [
		'night',
		'dawn',
		'morning',
		'afternoon',
		'evening',
		'twilight'
	];

	if (timeDay < 5) { currentSky = sky[0] }
	else if (timeDay < 7) { currentSky = sky[1] }
	else if (timeDay < 11) { currentSky = sky[2] }
	else if (timeDay < 15) { currentSky = sky[3] }
	else if (timeDay < 19) { currentSky = sky[4] }
	else if (timeDay < 21) { currentSky = sky[5] }
	else if (timeDay < 24) { currentSky = sky[0] }
	
	return currentSky;
}

Time.prototype.checkMoon = function(timeMonth)
{
	var currentMoon;
	
	var moon = [ 
		'new',
		'crescent',
		'first quarter',
		'gibbous',
		'full',
		'disseminating',
		'last quarter',
		'balsamic'
	];

	if (timeMonth < 89) {currentMoon = moon[0]}
	else if (timeMonth < 179) { currentMoon = moon[1] }
	else if (timeMonth < 269) { currentMoon = moon[2] }
	else if (timeMonth < 359) { currentMoon = moon[3] }
	else if (timeMonth < 449) { currentMoon = moon[4] }
	else if (timeMonth < 539) { currentMoon = moon[5] }
	else if (timeMonth < 629) { currentMoon = moon[0] }
	else if (timeMonth < 720) { currentMoon = moon[0] }

	return currentMoon;
}

Time.prototype.checkSeason = function(timeYear)
{
	var currentSeason;

	var season = [
		'summer', 
		'autumn',
		'winter',
		'spring'
	];

	if (timeYear < 2191) {currentSeason = season[0]}
	else if(timeYear < 4382) {currentSeason = season[1]}
	else if(timeYear < 6572) {currentSeason = season[2]}
	else if(timeYear < 8764) {currentSeason = season[3]};
	
	return currentSeason;
}

Time.prototype.tick = function(delta)
{
	// add tick delta to internal counters
	this.clock += delta;
	this.alive += delta;

	this.update();
}

Time.prototype.shift = function()
{
	this.shiftRemaining--;
	this.clock++;

	if (this.shiftRemaining <= 0)
	{
		clearInterval(this.shifting);
		this.shifting = null;
		this.shiftRemaining = 0;
	}

	this.update();
}

Time.prototype.fastForward = function(delta)
{
	// A cooler fwoosh /d
	this.shiftRemaining += delta;
	if (!this.shifting)
	{
		this.shifting = setInterval(this.shift.bind(this), 4000);
	}
}

Time.prototype.checkWeather = function(season)
{	
	// run a check on season
	//var season = this.season;
	var elements = Object.keys(weather[season]);
	currentWeather = {};

	//console.log(season)

	// grab season attributes
	for (var i = 0; i < elements.length; i++)
	{
		var currentElement = elements[i];
		var conditions = Object.keys(weather[season][elements[i]]);
		var conditionChance = 0;	

		// add up each condition chance
		for (var j = 0; j < conditions.length; j++)
		{
			conditionChance += weather[season][elements[i]][conditions[j]]
		}

		// save the total chance for all conditions
		var conditionTotal = conditionChance;

		// make a roll bound by the condition total chance
		var conditionRoll = roll(0, conditionTotal);
		
		//console.log(currentElement, conditionChance, conditionRoll)
		
		// run through conditions again to find current state
		for (var k = 0; k < conditions.length; k++)
		{
			// subtract from roll until it hits zero, then stop
			conditionRoll -= weather[season][elements[i]][conditions[k]]
			if (conditionRoll <= 0)
			{
				//console.log('looks like ' + conditions[k])
				currentWeather[elements[i]] = conditions[k]
				break;
			}
		}

	}

	//console.log('--------------------------')
	//console.log(currentWeather)
	return currentWeather;
}

// there are no lights in radon canyon
var weather = {
	summer: {
		temp: {
			cold: 0,
			cool: 0,
			mild: 0,
			warm: 1,
			hot: 12,
			scorching: 78
		},
		precip: {
			dry: 55,
			humid: 11,
			rain: 11,
			snow: 1
		},
		wind: {
			calm: 53,
			breezy: 12,
			windy: 12,
			gusty: 15
		},
		clouds: {
			clear: 55,
			hazy: 5,
			cloudy: 14,
			overcast: 4
		}
	},
	autumn: {
		temp: {
			cold: 0,
			cool: 12,
			mild: 22,
			warm: 22,
			hot: 35,
			scorching: 1
		},
		precip: {
			dry: 57,
			humid: 12,
			rain: 8,
			snow: 2
		},
		wind: {
			calm: 59,
			breezy: 32,
			windy: 1,
			gusty: 1
		},
		clouds: {
			clear: 57,
			hazy: 4,
			cloudy: 12,
			overcast: 9
		}
	},
	winter: {
		temp: {
			cold: 52,
			cool: 38,
			mild: 1,
			warm: 0,
			hot: 0,
			scorching: 0
		},
		precip: {
			dry: 57,
			humid: 13,
			rain: 5,
			snow: 9
		},
		wind: {
			calm: 80,
			breezy: 10,
			windy: 0,
			gusty: 0
		},
		clouds: {
			clear: 57,
			hazy: 3,
			cloudy: 12,
			overcast: 12
		}
	},
	spring: {
		temp: {
			cold: 0,
			cool: 14,
			mild: 36,
			warm: 19,
			hot: 22,
			scorching: 0
		},
		precip: {
			dry: 51,
			humid: 15,
			rain: 6,
			snow: 1
		},
		wind: {
			calm: 0,
			breezy: 66,
			windy: 11,
			gusty: 15
		},
		clouds: {
			clear: 51,
			hazy: 5,
			cloudy: 15,
			overcast: 10
		}
	}
};


// object traversal

function traverse(collection, operation)
{
	for (var i in collection)
	{
		var type = typeof (collection[i]);
		if (type) {
			// only operate on non-functions and non-objects
			if (type !== 'function' && type !== 'object') {
				operation.apply(this, [i, collection[i]]);  
			}
			// if encountering an object, recurse
			if (type === 'object')
			{
				traverse(collection[i], operation);
			}
		}
	}
}

function debug(key, value)
{
	console.log(key + ': ' + value);
}

function print(key, value)
{
	dom.timer.innerHTML += '<p>' + key + ': ' + value + '<p>';	
}

//traverse(weather, debug);


// dice roller 

function roll(min, max) {
	var outcome =	Math.floor(Math.random() * (max - min + 1)) + min;
	return outcome;
}


// testbed

var test = new Time;
test.spin()

//console.log(checkWeather(test))
