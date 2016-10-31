
///////////////

var Walk = {
	time: 0,
	refresh: 240,
	init: function (type)
	{
		this.type = type;
		this.active = true;
		this.time = 0;
		this.step = 0;
		this.background = Object.create(Field).init(16);
		this.foreground = Object.create(Field).init(16);
		this.player = makeBeing(Data.entity['@']);

		return this;
	},
	update: function (time, scene)
	{
		this.updated = false;
		this.time += time.delta;
		this.now = time.lastUpdated;
		
		if (!this.active)
		{
			this.time = 0;
		}
		if (this.active && this.time >= this.refresh)
		{
			// generate landscape spaces
			var spawn = makeEnviron(Data.biome, this.type);
			//console.log(spawn)

			this.background.add(spawn.background);
			this.foreground.add(spawn.foreground);

			// update time
			this.time -= this.refresh;
			this.step += 1;
			this.updated = true;

			// check head of foreground for entity encounter
			if (this.foreground.isOccupied(this.step))
			{
				// pause walk
				this.active = false;
				this.encounter(this.foreground.check(this.step), this.step)
			}

		}
	},
	draw: function (time, scene)
	{
		if (this.updated)
		{
			this.foreground.draw(this.step)
			this.background.draw(this.step)
		}
	},
	encounter: function (e, i)
	{
		if (Data.entity.hasOwnProperty(e))
		{
			var players = [makeBeing(Data.entity[e]), this.player];
			console.log('encounter', i, players, action.do('initiative', players))
			console.log(action.do('scare', players))
			console.log(action.do('dodge', players))
			
			// initiative
			// reaction
				// scare
					// dodge
					
			
			//console.log(e, Data.entity[e])
			//var type = Data.entity[e].type;
			//console.log(type + ' stuff')
		}
		// continue walk
		this.active = true;
	}
}

//var foo = Object.create(Walk)
//foo.init('plains')

///////////////

var Field = {
	init: function (width)
	{
		this.width = width;
		this.area = [];
		var i = width;
		while (i > 0) {
			i--;
			this.area.push('_');
		}

		return this;
	},
	add: function (v)
	{
		this.area.push(v)

		return this;
	},
	draw: function (pos)
	{		
		var view = this.area.slice(pos, pos + this.width).join('');
		this.view = view;

		console.log(view)

		//return view;
		return this;
	},
	isOccupied: function (i)
	{
		if (this.area[i] === '_' )
		{
			return false;
		}
		else {
			return true;
		}
	},
	check: function(i)
	{
		if (this.area[i])
		{
			return this.area[i];
		}
		else {
			return false;
		}
	},
	last: function ()
	{
		var last = this.area.length - 1;
		return last;
	}
}

//var bar = Object.create(Field).init(12)
//bar.draw(0).add('V').draw(1).add('-').draw(2)

///////////////

function roll (max)
{
	var outcome = Math.random() * max;
	return outcome;
}

// console.log(roll(6))

///////////////

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

///////////////
