///////////////
// DATA

var Data = {};

// BIOMES 

Data.biome = {
	desert: {
		background: {
      //'_' : 1,
      //'T' : 0.1,
      //'H' : 0.1,
			//'A' : 0.1,
			//'L' : 0.1,
			//'Y' : 0.1
			'.' : 0.06,
      ',' : 0.02,
			';' :  0.01,
			'_' : 1,
			',' : 0.15,
			'/' : 0.10,
			';' : 0.15,
			'i' : 0.05,
			'T' : 0.02,
			'Y' : 0.03,
			'h' : 0.01,
			'L' : 0.025,
			'H' : 0.025,
			'.' : 0.03
		},
    foreground: {
      '_' : 5,
			'&' : 0.03,
      '%' : 0.02,
      '?' : 0.01,
      '$' : 0.01,
      '!' : 0.01
		},
	},
  plains: {
		background: {
			//'_' : 1,
			'⁔' : 12,
			'‿' : 12,
			'﹏' : 11,
			'෴' : 2,
			'ᛮ' : 2,
			'Ҩ' : 1,
			'︿' : 1,
		},
    foreground: {
      '_' : 5,
			'R' : 0.06,
			'S' : 0.04,
			'B' : 0.02
			//'Ѧ' : 1,
			//'Ϫ' : 0.001,
		},
	},
};

// WEATHER

Data.weather = {
	summer: {
		temp: {
			cold: 0,
			cool: 0,
			mild: 0,
			warm: 1,
			hot: 12,
			scorching: 78
		},
		precip: {
			dry: 55,
			humid: 11,
			rain: 11,
			snow: 1
		},
		wind: {
			calm: 53,
			breezy: 12,
			windy: 12,
			gusty: 15
		},
		clouds: {
			clear: 55,
			hazy: 5,
			cloudy: 14,
			overcast: 4
		}
	},
	autumn: {
		temp: {
			cold: 0,
			cool: 12,
			mild: 22,
			warm: 22,
			hot: 35,
			scorching: 1
		},
		precip: {
			dry: 57,
			humid: 12,
			rain: 8,
			snow: 2
		},
		wind: {
			calm: 59,
			breezy: 32,
			windy: 1,
			gusty: 1
		},
		clouds: {
			clear: 57,
			hazy: 4,
			cloudy: 12,
			overcast: 9
		}
	},
	winter: {
		temp: {
			cold: 52,
			cool: 38,
			mild: 1,
			warm: 0,
			hot: 0,
			scorching: 0
		},
		precip: {
			dry: 57,
			humid: 13,
			rain: 5,
			snow: 9
		},
		wind: {
			calm: 80,
			breezy: 10,
			windy: 0,
			gusty: 0
		},
		clouds: {
			clear: 57,
			hazy: 3,
			cloudy: 12,
			overcast: 12
		}
	},
	spring: {
		temp: {
			cold: 0,
			cool: 14,
			mild: 36,
			warm: 19,
			hot: 22,
			scorching: 0
		},
		precip: {
			dry: 51,
			humid: 15,
			rain: 6,
			snow: 1
		},
		wind: {
			calm: 0,
			breezy: 66,
			windy: 11,
			gusty: 15
		},
		clouds: {
			clear: 51,
			hazy: 5,
			cloudy: 15,
			overcast: 10
		}
	}
};

// ENTITIES

Data.entity = {
	'@': {
		name: 'DAWG',
		type: 'animal',
		stats: {
			life: 6,
			agility: 4,
			nerve: 3,
			threat: 3
		},
		items: ['dawgBite', 'dawgHide']
	},
	'S': {
		name: 'SQUIRREL',
		type: 'animal',
		stats: {
			life: 3,
			agility: 3,
			nerve: 1,
			threat: 1
		},
		items: ['smallBite', 'smallHide']
	},
	'R': {
		name: 'RABBIT',
		type: 'animal',
		stats: {
			life: 3,
			agility: 5,
			nerve: 1,
			threat: 1
		},
		items: ['smallBite', 'smallHide']
	},
	'B': {
		name: 'BEAR',
		type: 'animal',
		stats: {
			life: 7,
			agility: 4,
			nerve: 3,
			threat: 5
		},
		items: ['bearBite', 'bearHide']
	},
	'D': {
		name: 'BIG DOG',
		type: 'animal'
	},
	'd': {
		name: 'LITTLE DOG',
		type: 'animal'
	},
	'&': {
		name: 'ANIMAL BONES',
		type: 'loot'
	},
	'%': {
		name: 'HUMAN BONES',
		type: 'loot'
	},
	'$': {
		name: 'STUFF',
		type: 'loot'
	},
	'!': {
		name: 'HUMAN',
		type: 'human'
	},
};

// unicode? http://jrgraphix.net/r/Unicode/0370-03FF
// /* DANGER EXOTIC WHITESPACE AHEAD //ideographic space: '　' // DANGER */
// ღხფฬป৶
// _⁔‿ҨѦᛮϪץ﹏︿෴
// ϡψᾂҔѮӜᴕᠠᘚጰᘏ

// EQUIPMENT

Data.equipment = {
	dawgBite: {
		type: 'weapon',
		name: 'TEETH',
		action: 'BITE',
		damage: { min: 1, max: 3, to: 'life' }
	},
	smallBite: {
		type: 'weapon',
		name: 'TEETH',
		action: 'NIP',
		damage: { min: 0, max: 2, to: 'life' }
	},
	bearBite: {
		type: 'weapon',
		name: 'TEETH',
		action: 'MAUL',
		damage: { min: 2, max: 6, to: 'life' }
	},
	dawgHide: {
		type: 'armor',
		name: 'DAWG HIDE',
		defense: 2
	},
	smallHide: {
		type: 'armor',
		name: 'SMALL HIDE',
		defense: 1
	},
	bearHide: {
		type: 'armor',
		name: 'BEAR HIDE',
		defense: 3
	}
};
