
///////////////

// ACTIVITY LOG

var activity = {
	history: [],
	log: function (message)
	{
		var time = new Date().getTime();
		this.history.push({ time, message });

		return this;
	},
	clear: function ()
	{
		this.history = [];

		return this;
	},
	recall: function ()
	{
		return this.history;
	},
	getMessages: function ()
	{
		function message (e)
		{
			return e.message;
		}

		var messages = this.recall().map(message);

		return messages;
	}
};

///////////////

// RANDOMNESS

function roll (max)
{
	var outcome = Math.random() * max;
	return outcome;
}

function rollRange(min, max)
{
	var outcome =	Math.floor(Math.random() * (max - min + 1)) + min;
	return outcome;
}

//console.log(roll(6))
//console.log(rollRange(1, 20))

///////////////

// DATA ACCESS

makeEnviron = function (set, subset)
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

		// use reduce instead
		// see https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter
		//set.subset.reduce()
		//var sum = rockets.reduce(function(val, elem) {
		//		return val + elem.launches;
		//	}, 0);
		//console.log(conditions)



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

//makeEnviron(Data.biome, 'plains')
//console.log(makeEnviron(Data.weather, 'summer'))

makeBeing = function (data)
{
	console.log(data)
	var being = Object.create(Being);
	being.assign(data);

	if (data.items)
	{
		// iterate through items and add equipment
		for (var e = 0; e < data.items.length; e++)
		{
			var item = Data.equipment[data.items[e]] || false;			
			being.equip(item);
		}
		// clean up
		delete being.items;
	}

	return being;
}

//makeBeing(Data.entity['S'])

///////////////

function makeClone(obj)
{
  if (obj === null || typeof obj !== 'object')
  {
  return obj;
  }

  var temp = obj.constructor();
  for (var key in obj)
  {
    temp[key] = makeClone(obj[key]);
  }
  return temp;
}
