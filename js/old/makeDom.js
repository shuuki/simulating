function makeDom(id, parentid)
{
	if (!id)
	{
		throw 'no id specified'
	}
	if (document && document.body)
	{
		// check for existing element with the same id and delete if found
		var existing = document.getElementById(id);
		if (existing && existing.parentNode)
		{
			existing.parentNode.removeChild(existing);
		}

		var display = document.createElement('div');

		display.id = id;
		document.body.appendChild(display);
		display = document.getElementById(id);

		return display;
	}
	else
	{
		throw 'no document present'
	}
}
