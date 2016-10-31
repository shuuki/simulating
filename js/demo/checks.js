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

// ACTIONS

var action = {
	do: function (type, actors)
	{
		var check = this[type](actors);
		activity.log(check);
		return check;
	},
	initiative: function (actors)
	{
		// takes an array of actors
		// does rolls for each
		// builds sorted array of rolls and indices of actors, from highest to lowest
		// returns object with rolls array and name of the actor with the highest roll
		var agilityPlusRollSpeed = function (actor, index) {
			var agility = actor.stats.agility;
			return [agility + roll(agility), index, actor.name];
		};

		var initiative = actors.map(agilityPlusRollSpeed).sort().reverse();
		var resolve = initiative[0][1];
		var winner = actors[resolve].name;

		return {actors, initiative, winner};
	},
	dodge: function (actors)
	{
		// takes two actors: dodger, other
		// does a roll
		// returns success or failure

		var rollSpeed = function (actor, index) {	
			var agility = actor.stats.agility;
			return roll(agility);
		};

		var check = actors.map(rollSpeed);
		var dodged = check[0] - check[1] > 0 ? true : false;
		var winner = dodged === true ? actors[0].name : actors[1].name;

		return {actors, dodged, winner};
	},
	attack: function (actors)
	{
		// takes two actors: attacker, other
		var dodge = this.do('dodge', [actors[1], actors[0]]);

		// evaluate success or failure of dodge check
		var attacked = dodge.dodged === false ? true : false;

		// if attack succeeds, calculate damage
		var damage = attacked === true ? this.do('damage', actors) :  false;

		// return attack info
		return {actors, attacked, damage};
	},
	damage: function (actors) 
	{
		// takes two actors: attacker, other
		var weapon = actors[0].equipped('weapon').damage || 0;
		var defense = actors[1].equipped('armor').defense || 0;
		//var defense = actors[1].get('defense') || 0;

		// makes a roll inside damage range of attacker's weapon
		var damage = Math.round(roll(weapon.max - weapon.min) + weapon.min);
		damage <= 0 ? damage = 0 : damage = damage;

		// returns weapon damage
		return damage;
	},
	scare: function (actors) 
	{
		var fear = actors[0].get('fear');
		var intimidation = actors[1].get('intimidation');
		var fright =  fear - intimidation;
		var scare = rollRange(fright, fear);

		return {fear, intimidation, fright, scare};

	}
};

// action.do('type', [players])

///////////////

// TYPES

var Being = {
	// NAME
	named: function (name)
	{
		this.name = name;
		return this;
	},
	called: function ()
	{
		return this.name;
	},
	// STATS
	stats: {},
	make: function (stats)
	{
		this.stats = {};
		this.equipment = {};
		this.inventory = [];
		this.stats = Object.assign(this.stats, stats);
		this.stats.alive = true;
		return this;
	},
	assign: function (attributes)
	{
		Object.assign(this, attributes);
		return this;
	},
	is: function ()
	{		
		return this.stats;
	},
	get: function (stat)
	{
		return this.stats[stat];
	},
	change: function (stat, change)
	{
		this.stats[stat] += change;
		return this;
	},
	set: function (stat, value)
	{
		this.stats[stat] = value;
		return this;
	},
	death: function ()
	{
		this.stats.alive = false;
		return this;
	},
	birth: function ()
	{
		this.stats.alive = true;
		return this;
	},
	// INVENTORY
	inventory: [],
	has: function ()
	{
		return this.inventory;
	},
	give: function (items)
	{
		this.inventory = items;
		return this;
	},
	add: function (item)
	{
		this.inventory.push(item);
		return this;
	},
	take: function (item)
	{
		var what = this.inventory.indexOf(item);
		this.inventory.splice(1, what);
		return this;
	},
	// EQUIPMENT
	// adds effects to stats
	equipment: {},
	equipped: function (type)
	{
		return this.equipment[type] || this.equipment;
	},
	equip: function (item)
	{
		if (item)
		{
			this.equipment[item.type] = item;
		}
		return this;
	},
	unequip: function (item)
	{
		if (this.equipment[item.type])
		{
			delete this.equipment[item.type];
		} 
		return this;
	},
	//
	check: function()
	{
		var check = {
			stats: this.is(),
			name: this.called(),
			inventory: this.has(),
			equipment: this.equipped()
		};
		return check;
	}
};

// var foo = Object.create(Being).name('FOO').give('fire');

var Weapon = {
	type: 'weapon',
	build: function(name, action, dam)
	{
		this.name = name;
		this.action = action;
		this.damage = {
			min: dam[0],
			max: dam[1],
			to: dam[2]
		};
		return this;
	}
};

// COLLECTIONS
/*

var weapon = {
	dawgBite: Object.create(Weapon).build('TEETH', 'BITE', [1, 3, 'life']),
	smallBite: Object.create(Weapon).build('TEETH', 'NIP', [0, 2, 'life'])
};

var being = {
	dawg: Object.create(Being)
		.named('DAWG')
		.make({ life: 6, agility: 4, defense: 2 })
		.equip(weapon.dawgBite),
	squirrel: Object.create(Being)
		.named('SQUIRREL')
		.make({ life: 3, agility: 3, defense: 1 })
		.equip(weapon.smallBite),
	rabbit: Object.create(Being)
		.named('RABBIT')
		.make({ life: 3, agility: 5, defense: 1 })
		.equip(weapon.smallBite)
};

// action tests
//var dsr = [being.dawg.check(), being.squirrel.check(), being.rabbit.check()]
//console.log( action.do('initiative', dsr) )//.join(' ') )
var sd = [ being.squirrel, being.dawg ]
var ds = [ being.dawg, being.squirrel ]
var rs = [ being.rabbit, being.squirrel ]
//action.do('dodge', sd)
//action.do('dodge', ds)

*/

///////////////

makeBeing = function (data)
{
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

function rollRange(min, max) {
	var outcome =	Math.floor(Math.random() * (max - min + 1)) + min;
	return outcome;
}
