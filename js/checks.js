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
		var check = this[type](actors)
		activity.log(check);
		return check;
	},
	initiative: function (actors)
	{		
		// takes an array of actors
		// does rolls for each
		// resolves ties
		// returns index of actor with highest roll

		var check = actors.map( function (actor, index) {	
				return [actor.speed + roll(actor.speed), index];
			}).sort().reverse();
		
		return check;
	},
	dodge: function (actors)
	{
		// takes two actors
		// dodger, other
		// takes something out of stats
		// does a roll
		// returns success or failure
	},
	attack: function (actors)
	{
		// takes two actors
		// attacker, other
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
	make: function (life, speed)
	{
		this.stats = {
			alive: true,
			life: life,
			speed: speed
		};
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
		.build([1, 3, 'life'], 'TEETH', 'BITE'),

	smallBite: Object.create(Weapon)
		.build([0, 2, 'life'], 'TEETH', 'NIP')
};

var being = {
	dawg: Object.create(Being)
		.name('DAWG')
		.make(6,4)
		.equip(weapon.dawgBite),

	squirrel: Object.create(Being)
		.name('SQUIRREL')
		.make(2,4)
		.equip(weapon.smallBite)

};

// 

//.give('fire')
//.give('eyes')


var czz = [being.dawg.is(), being.squirrel.is()]
console.log( action.do('initiative', czz).join(' ') )
