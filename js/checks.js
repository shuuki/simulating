function roll(max)
{
	var outcome = Math.ceil(Math.random() * max);
	return outcome;
}

// 

var activity = {
	history: [],
	log: function (message)
	{
		var time = new Date().getTime();
		this.history.push({time, message});
	},
	recall: function ()
	{
		return this.history;
	},
	clear: function ()
	{
		this.history = [];
		return this;
	}
};

// action.do('type', [players])

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

		var speedPlusRollSpeed = function (actor, index) {	
			var speed = actor.stats.speed;
			return [speed + roll(speed), index, actor.name];
		};

		var initiative = actors.map(speedPlusRollSpeed).sort().reverse();
		var resolve = initiative[0][1];
		var winner = actors[resolve].name;

		return {initiative, winner};
	},
	dodge: function (actors)
	{
		// takes two actors: dodger, other
		// does a roll
		// returns success or failure

		var rollSpeed = function (actor, index) {	
			var speed = actor.stats.speed;
			return roll(speed);
		};

		var check = actors.map(rollSpeed);
		var dodge = check[0] - check[1] > 0 ? true : false;
		var winner = dodge === true ? actors[0].name : actors[1].name;

		return {dodge, winner};
	},
	attack: function (actors)
	{
		// takes two actors: attacker, other

		// weapon damage

		//actors[i].equipment.weapon.damage.max etc

		// takes something out of stats
		// evaluate success or failure
		// return attack info

		// does a roll

		var check = roll(20) - roll(20);

		return check;
	}
};

// types

var Being = {
	// NAME
	name: function (name)
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
		this.stats = stats;
		this.stats.alive = true;
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
	kill: function ()
	{
		this.stats.alive = false;
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
	equipment: {},
	equipped: function (type)
	{
		return this.equipment[type] || this.equipment;
	},
	equip: function(item)
	{
		this.equipment[item.type] = item;
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

var Weapon = {
	type: 'weapon',
	build: function(dam, name, action)
	{
		this.name = name;
		this.action = action;
		this.damage = {
			min: dam[0],
			max: dam[1],
			to: dam[2]
		}
		return this;
	}
};

// collections

var weapon = {
	dawgBite: Object.create(Weapon)
		.build('TEETH', 'BITE', [1, 3, 'life']),

	smallBite: Object.create(Weapon)
		.build('TEETH', 'NIP', [0, 2, 'life'])
};

var being = {
	dawg: Object.create(Being)
		.name('DAWG')
		.make({ life: 6, speed: 4 })
		.equip(weapon.dawgBite),
		//.give('fire'),)

	squirrel: Object.create(Being)
		.name('SQUIRREL')
		.make({ life: 2, speed: 3 })
		.equip(weapon.smallBite),
		//.give('eyes'),

	rabbit: Object.create(Being)
		.name('RABBIT')
		.make({ life: 3, speed: 5 })
		.equip(weapon.smallBite)
};

// 



var dsr = [being.dawg.check(), being.squirrel.check(), being.rabbit.check()]
console.log( action.do('initiative', dsr) )//.join(' ') )

var sd = [ being.squirrel.check(), being.dawg.check() ]
//action.do('dodge', sd)
