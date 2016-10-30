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
		var dodged = check[0] - check[1] > 0 ? true : false;
		var winner = dodged === true ? actors[0].name : actors[1].name;

		return {dodged, winner};
	},
	attack: function (actors)
	{
		// takes two actors: attacker, other
		// evaluate success or failure of dodge check
		// if attack succeeds, calculate damage
		// return attack info

		var dodge = this.do('dodge', [actors[1], actors[0]]);
		var attacked = dodge.dodged === false ? true : false;
		var damage = attacked === true ? this.do('damage', actors) : 0;

		return {attacked, damage};
	},
	damage: function (actors) 
	{
		// takes two actors: attacker, other
		// makes a roll inside damage range of attacker's weapon
		// returns weapon damage

		var wep = actors[0].equipped('weapon').damage;
		var damage = Math.round(roll(wep.max - wep.min) + wep.min);

		return damage;
	}
};

// action.do('type', [players])

///////////////

// TYPES

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
		this.stats = {};
		this.stats = Object.assign(this.stats, stats);
		this.stats.alive = true;
		this.equipment = {};
		this.inventory = [];
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

// var foo = Object.create(Being).name('FOO').give('fire').give('eyes');


var Weapon = {
	type: 'weapon',
	name: null,
	action: null,
	damage: {},
	build: function(name, action, dam)
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

//var bit = smallBite: Object.create(Weapon).build('TEETH', 'NIP', [0, 2, 'life'])

// COLLECTIONS

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
	squirrel: Object.create(Being)
		.name('SQUIRREL')
		.make({ life: 3, speed: 3 })
		.equip(weapon.smallBite),
	rabbit: Object.create(Being)
		.name('RABBIT')
		.make({ life: 3, speed: 5 })
		.equip(weapon.smallBite)
};

// 

var dsr = [being.dawg.check(), being.squirrel.check(), being.rabbit.check()]
//console.log( action.do('initiative', dsr) )//.join(' ') )

var sd = [ being.squirrel, being.dawg ]
//action.do('dodge', sd)

var ds = [ being.dawg, being.squirrel ]

var rs = [ being.rabbit, being.squirrel ]

///////////////
