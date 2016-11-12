var MicroCache = function()
{
	var _values = {};
	return {
		get: function(key)
		{
			return _values[key];
		},
		contains: function(key)
		{
			return key in _values;
		},
		remove: function(key)
		{
			delete _values[key];
		},
		set: function(key, value)
		{
			_values[key] = value;
		},
		values: function()
		{
			return _values;
		},
		getSet: function(key, value)
		{
			if (!this.contains(key))
			{
				this.set(key, typeof value == 'function' ? value() : value)
			}
			return this.get(key);
		}
	}
}







function Events(target)
{
	var events = {},
		empty = [];
	target = target || this;

	// on: listen to events
	target.on = function(type, func, ctx)
	{
		(events[type] = events[type] || []).push([func, ctx])
	}

	// off: stop listening to event / specific callback
	target.off = function(type, func)
	{
		type || (events = {})
		var list = events[type] || empty,
		i = list.length = func ? list.length : 0;
		while (i--) 
		{
			func == list[i][0] && list.splice(i, 1)
		}
	}
		/** 
		 * Emit: send event, callbacks will be triggered
		 */
	target.emit = function(type)
	{
		var e = events[type] || empty,
			list = e.length > 0 ? e.slice(0, e.length) : e,
			i = 0,
			j;
		while (j = list[i++])
		{
			j[0].apply(j[1], empty.slice.call(arguments, 1))
		}
	};
}
