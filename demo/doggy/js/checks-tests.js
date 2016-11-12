
// TEST COLLECTIONS

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
