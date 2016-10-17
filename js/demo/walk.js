// 

var sim = new Sim({
	scene: {
		landscape: new Walk('plains')
	}
}).start();

////////////

function Walk(type)
{
	this.type = type;

	this.background = new Field(16);
	this.foreground = new Field(16);

	this.time = 0;
	this.step = 0;
	this.refresh = 250;
}
Walk.prototype.update = function(time, scene)
{
	this.time += time.delta;
	this.updated = false;

	while (this.time >= this.refresh) {
		var spawn = makeA(biome, this.type);
		this.background.add(spawn.background);
		this.foreground.add(spawn.foreground);

		this.time -= this.refresh;
		this.step += 1;
		this.updated = true;
		
		if (this.foreground.isOccupied(0))
		{
			console.log('encounter')
			//this.refresh = 5000;
		}
		
	}
}
Walk.prototype.render = function(time, scene)
{
	if (this.updated) {
		this.background.draw();
		this.foreground.draw();
	}
}

////////////

function Field(w)
{
	this.w = w;
	this.a = [];

	var x = w;
	while (x > 0) {
		x--;
		this.a.push(' ');
	}
}
Field.prototype.add = function(v)
{
	this.a.shift()
	this.a.push(v)
	return this;
}
Field.prototype.draw = function()
{
	var view = this.a.join('').toString();
	console.log(view)
	return this;
}
Field.prototype.isOccupied = function(i)
{
	if (this.a[i] === ' ')
	{
		return false;
	}
	else {
		return true;
	}
}

// field tests
//var bar = new Field(12)
//bar.draw().add('V').draw().add('-').draw()

////////////

function roll(max)
{
	var outcome = Math.random() * max;
	return outcome;
}
function makeA(set, subset)
{
	// get elements within the passed set and its collection
	var elements = Object.keys(set[subset]);
	var selected = {};

	// grab subset attributes
	for (var i = 0; i < elements.length; i++) {
		var currentElement = elements[i];
		var conditions = Object.keys(set[subset][elements[i]]);
		var conditionChance = 0;

		// add up chance of each element's condition
		for (var j = 0; j < conditions.length; j++) {
			conditionChance += set[subset][elements[i]][conditions[j]]
		}

		// save the total chance for all conditions
		var conditionTotal = conditionChance;

		// make a roll bound by the condition total chance
		var conditionRoll = roll(conditionTotal);

		//console.log(currentElement, conditionChance, conditionRoll)

		// run through conditions again to find current state
		for (var k = 0; k < conditions.length; k++) {
			// subtract condition values from roll
			var increment = set[subset][elements[i]][conditions[k]];
			conditionRoll -= increment;
			//console.log(conditions[k], increment, conditionRoll)

			// once roll value drops below zero, save selection and break
			if (conditionRoll <= 0) {
				//console.log(conditions[k] + ' selected')
				selected[elements[i]] = conditions[k];
				break;
			}
		}
	}
	return selected;
}

//console.log(makeA(biome, 'desert'))
//console.log(makeA(biome, 'plains'))
//console.log(makeA(weather, 'summer'))

////////////

var biome = {
	desert: {
		background: {
      ' ' : 0.1,
      'T' : 0.06,
      'H' : 0.02,
			'Y' : 0.01      
		},
    foreground: {
      ' ' : 1,
      '?' : 0.1,
      '$' : 0.1,
      '!' : 0.1
		},
	},
  plains: {
		background: {
      ' ' : 0.1,
      '.' : 0.06,
      ',' : 0.02,
			';' : 0.01      
		},
    foreground: {
      ' ' : 5,
      '&' : 0.1,
      '%' : 0.1,
      '@' : 0.1
		},
	},
}

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

////////////
