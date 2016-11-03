
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
		var encountering = false;
		var tick = 0;
		if (Data.entity.hasOwnProperty(e))
		{
			var opponent = makeBeing(Data.entity[e]);
			var players = [this.player, opponent];
			//console.log('encounter', i, players)

			encountering = true;

			while (encountering === true)
			{
				// automatically break after 9 ticks
				if (tick > 9)
				{
					console.log('encounter timed out')
					encountering = false;
				}

				var update = decision(players, tick);
				players = update.players;
				encountering = update.active;

				tick += 1;
			}
		}
		if (this.player.get('alive') === false)
		{
			console.log('game over')
			this.active = false;
		}
		else {
			// continue walk
			this.active = true;			
		}
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

function decision (players, tick)
{	
	var players = players;
	var tick = tick;
	var active = true;

  if (tick < 1)
  {
    var initiative = action.do('initiative', players);
    players = initiative.players;
		//console.log(players, initiative)
  }
	
	var protagonist = players[0].name;
	var antagonist = players[1].name;

	console.log('TURN OF ' + protagonist)
	console.log(protagonist, players[0].get('life'), antagonist, players[1].get('life'))
	
  //var reaction = action.do('reaction', players);
  var fear = action.do('fear', players);
	var attack = action.do('attack', players);
	var dodge = action.do('dodge', players);
	//console.log(reaction)
  //console.log(fear)
  //console.log(attack)
  //console.log(dodge)

	if (fear.afraid === true && dodge.dodged === true)
	{
		active = false;
		console.log(protagonist + ' fled!!!')
	}
	else if (attack.attacked === true && attack.damage !== false && attack.damage > 0)
	{
		players[1].change('life', -attack.damage)
		console.log(antagonist + ' takes ' + attack.damage + ' damage')
		if (players[1].get('life') <= 0)
		{
			active = false;
			players[1].death();
			console.log(antagonist + ' died!!!')
		}
	}
	else
	{
		console.log('nothing!!!')
	}

	// reverse players for next round
  players = [players[1], players[0]];

	return { players, active };
}

///////////////
