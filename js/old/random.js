var random = {
	pick: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	roll: function(max) {
		return Math.floor(Math.random() * max);
	},
	shuffle: function(array) {
	  var m = array.length,
			t, i;
	  while (m) {
	    i = Math.floor(Math.random() * m--);
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }
	  return array;
	}
}
