
console.log('|----------------|')


// dice roller 



function traverse(set, fn)
{
	for (var i in set)
	{
		var type = typeof (set[i]);
		if (type) {
			// apply passed function to non-functions and non-objects
			if (type !== 'function' && type !== 'object') {
				fn.apply(this, [i, set[i]]);  
			}
			// recurse traversal on objects 
			if (type === 'object')
			{
				traverse(set[i], fn);
			}
		}
	}
}

function debug(key, value)
{
	console.log(key + ': ' + value);
}



function roll(max) {
	var outcome =	Math.random() * max;
	return outcome;
}



function makeA(set, subset)
{	
  // get elements within the passed set and its collection
	var elements = Object.keys(set[subset]);
  var selected = {};

	// grab subset attributes
	for (var i = 0; i < elements.length; i++)
	{
		var currentElement = elements[i];
		var conditions = Object.keys(set[subset][elements[i]]);
		var conditionChance = 0;	

		// add up chance of each element's condition
		for (var j = 0; j < conditions.length; j++)
		{
			conditionChance += set[subset][elements[i]][conditions[j]]
		}

		// save the total chance for all conditions
		var conditionTotal = conditionChance;

		// make a roll bound by the condition total chance
		var conditionRoll = roll(conditionTotal);

		//console.log(currentElement, conditionChance, conditionRoll)

		// run through conditions again to find current state
		for (var k = 0; k < conditions.length; k++)
		{
			// subtract condition values from roll
      var increment = set[subset][elements[i]][conditions[k]];
			conditionRoll -= increment;
      //console.log(conditions[k], increment, conditionRoll)

      // once roll value drops below zero, save selection and break
			if (conditionRoll <= 0)
			{
				//console.log(conditions[k] + ' selected')
				selected[elements[i]] = conditions[k];
        break;
			}
		}
	}
  return selected;
}




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

console.log(makeA(biome, 'desert'))
console.log(makeA(biome, 'plains'))


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

//console.log(makeA(weather, 'summer'))





console.log('ohai')


function Time(refresh)
{
	// set default times
  this.playing = null;
	this.steps = 0;
	this.stepsRemaining = 0;
  this.lastUpdated = new Date().getTime();
  this.refresh = refresh || 1000;
}

Time.prototype.update = function()
{
  // update clock
  var now = new Date().getTime();
  this.delta = now - this.lastUpdated;

  console.log('update', this.steps, this.delta)
  console.log(makeA(biome, 'plains'))

  this.lastUpdated = now;
  
  return this;
}

Time.prototype.draw = function()
{
  //console.log('draw step');
}

Time.prototype.advance = function(steps)
{
	this.stepsRemaining += steps;
	if (!this.playing)
	{
		this.playing = setInterval(this.step.bind(this), this.refresh);
	}
}

Time.prototype.step = function()
{
  
  if (this.stepsRemaining > 0) {
    this.stepsRemaining--;
    this.steps++;
  }
  if (this.stepsRemaining <= 0)
  {
    clearInterval(this.playing);
    this.playing = null;
    this.stepsRemaining = 0;
  }
  
  this.update();
}



var verse = new Time(500);
verse.advance(600)



function Line(size) {
  this.size = size;
  this.map = new Array(size);
  
}

Line.prototype = {
  add: function()
  {
    
  }
}
