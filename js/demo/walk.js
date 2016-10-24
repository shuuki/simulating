
///////////////

var Walk = {
	time: 0,
	init: function (type)
	{
		this.type = type;
		this.active = true;
		this.time = 0;
		this.step = 0;
		this.refresh = 240;
		this.background = Object.create(Field).size(16);
		this.foreground = Object.create(Field).size(16);
	},
	update: function(time, scene)
	{
		this.updated = false;
		this.time += time.delta;
		
		if (!this.active)
		{
			this.time = 0;
		}
		if (this.active && this.time >= this.refresh)
		{
			// generate landscape spaces
			var spawn = makeA(Data.biome, this.type);
			console.log(spawn)
			this.background.add(spawn.background);
			this.foreground.add(spawn.foreground);
			//this.foreground.area[0] = '@';

			// update time
			this.time -= this.refresh;
			this.step += 1;
			this.updated = true;

			// check head of foreground for entity encounter
			if (this.foreground.isOccupied(0))
			{
				this.active = false;
				this.encounter(this.foreground.check(0))
			}

		}
	},
	draw: function(time, scene)
	{
		if (this.updated) {
			console.log(this.foreground.draw())
			console.log(this.background.draw())
			//this.bg.innerHTML = this.background.draw();
			//this.fg.innerHTML = this.foreground.draw();
		}
	},
	encounter: function(e)
	{
		console.log('encounter', e, Data.entity[e])
		var type = Data.entity[e].type;
		console.log(type + ' stuff')

		this.active = true;
	}
}

//var foo = Object.create(Walk)
//foo.init('plains')

///////////////

var Field = {
	
	size: function (width)
	{
		this.area = [];
		this.width = width;
		var i = width;
		while (i > 0) {
			i--;
			this.area.push('_');
		}
		return this;
	},
	add: function (v)
	{
		this.area.shift()
		this.area.push(v)
		return this;
	},
	draw: function ()
	{
		var view = this.area.join('');
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
	}
}

//var bar = Object.create(Field).size(12)
//bar.draw().add('V').draw().add('-').draw()

///////////////

function makeDom(id, parentid)
{
	if (!id)
	{
		throw 'no id specified'
	}
	if (document && document.body)
	{
		// check for existing element with the same id and delete if found
		var existing = document.getElementById(id);
		if (existing && existing.parentNode)
		{
			existing.parentNode.removeChild(existing);
		}

		var display = document.createElement('div');

		display.id = id;
		document.body.appendChild(display);
		display = document.getElementById(id);
		return display;
	}
	else
	{
		throw 'no document present'
	}
}

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

//console.log(makeA(Data.biome, 'desert'))
//console.log(makeA(Data.biome, 'plains'))
//console.log(makeA(Data.weather, 'summer'))


///////////////
