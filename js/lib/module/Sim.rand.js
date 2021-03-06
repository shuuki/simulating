/** randomness */

// tools for making entropy
// inspired by dice and cards

Sim.rand = {
  // roll a random whole number between 0 and a maximum
  roll: function(max)
  {
    return Math.floor(Math.random() * max);
  },
  // pick a random element from an array
  pick: function(list)
  {
    return list[Math.floor(Math.random() * list.length)];
  },
  // shuffle
  // from mike bostock via frankmitchell.org/2015/01/fisher-yates
  shuffle: function(list)
  {
    var m = list.length,
      t, i;
    // while there are elements to shuffle...
    while (m)
    {
      // pick a remaining element...
      i = Math.floor(Math.random() * m--);
      // and swap it with the current element
      t = list[m];
      list[m] = list[i];
      list[i] = t;
    }
    return list;
  }
}
