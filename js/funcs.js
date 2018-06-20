
function horizon_from_height(metres)
{
	return 3.57 * Math.sqrt(metres);
}

function height_from_horizon(lh_horizon)
{
	var height = (lh_horizon/3.57) * (lh_horizon/3.57);
	return height;
}

/*
function d2r(degrees) 
{
	return degrees * Math.PI / 180;
}

function d2d(lat1, lon1, lat2, lon2) 
{
	var dLat = d2r(lat2-lat1);
	var dLon = d2r(lon2-lon1);
	lat1 = d2r(lat1);
	lat2 = d2r(lat2);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return 6371.0 * c;
}

function bearing(from_lat, from_lon, to_lat, to_lon) 
{
	var d = (to_lon - from_lon) * Math.PI / 180.;
	var y = Math.sin(d) * Math.cos(to_lat * Math.PI / 180.);
	var x = (Math.cos(from_lat * Math.PI / 180.) * Math.sin(to_lat * Math.PI / 180.)) - 
		(Math.sin(from_lat * Math.PI / 180.) * Math.cos(to_lat * Math.PI / 180.) * Math.cos(d));
	var b = (Math.atan2(y, x) * 180) / Math.PI;
	return (b + 360) % 360;
}
*/

