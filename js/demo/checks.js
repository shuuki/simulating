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

		var check = actors.map(agilityPlusRollSpeed).sort().reverse();
		var initiative = actors[check[0][1]].name;
		var players = [actors[check[0][1]], actors[check[1][1]]];

		return { players, initiative };
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

		return { dodged, winner };
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
		return { attacked, damage };
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
	fear: function (actors) 
	{
		var nerve = actors[0].get('nerve');
		var threat = actors[1].get('threat');
		var fright = nerve - threat;
		var check = rollRange(fright, nerve);
		var afraid = check > 0 ? false : true; 

		return { afraid };
	},
	escape: function (actors)
	{
		// fear and dodge
	},
	reaction: function (actors)
	{
		// decide if attack or not
	},
	loot: function (actors)
	{
		
	}
};

// action.do('type', [players])

///////////////

// DECISIONS

function decision (players, tick)
{	
	var players = players;
	var tick = tick || 0;
	var active = true;

  if (tick < 1)
  {
    var initiative = action.do('initiative', players);
    players = initiative.players;
		//console.log(players, initiative)
  }

	var protagonist = players[0].name;
	var antagonist = players[1].name;

	console.log('GO ' + protagonist)
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

		console.log(players[0].name + ' attacks!!!')
		console.log(antagonist + ' takes ' + attack.damage + ' damage')

		if (players[1].get('life') <= 0)
		{
			active = false;
			players[1].kill();

			console.log(antagonist + ' died!!!')
		}
	}
	else
	{
		console.log(protagonist + 'does nothing!!!')
	}

	// reverse player order for next round
  players = [players[1], players[0]];

	return { players, active };
}

///////////////
