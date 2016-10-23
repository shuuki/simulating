var spark = 0;
var fire = 0;

function lighterClick(number) {
	spark = spark + number;

	document.getElementById("spark").innerHTML = spark;
	var edge = Math.sqrt(spark * fire);
	$('#graph').height(edge).width(edge)
	
	var fireCost = Math.floor(10 * Math.pow(1.1, fire));
	
	var lightness = spark / fireCost <= 1 ? spark / fireCost : 1 ;
	
	var color = 'hsla(' + fire + ',90%,' + lightness * 100 + '%,1)';
	$('#graph').css('background', color)
	
};

function growFire()
{
	var fireCost = Math.floor(10 * Math.pow(1.1, fire));

	if (spark >= fireCost)
	{
		fire++;
		spark = spark - fireCost;
		
		document.getElementById('fire').innerHTML = fire;
		document.getElementById('spark').innerHTML = spark;
	}
	var nextCost = Math.floor(10 * Math.pow(1.1, fire));
	document.getElementById('fireCost').innerHTML = nextCost;
}

window.setInterval(function() {

	lighterClick(fire);
	

}, 500);
