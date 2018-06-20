
var seafield = [
	  { sname: "SF04", name: "SF04", lat: 56.083519, lon: -3.160206, height: 4.0 }
	, { sname: "SF06", name: "SF06", lat: 56.083250, lon: -3.160367, height: 6.0 }
	, { sname: "SF7", name: "SF08", lat: 56.083092, lon: -3.160400, height: 8.0 }
	, { sname: "SF09", name: "SF09", lat: 56.083039, lon: -3.160419, height: 9.0 }
	, { sname: "SF18", name: "SF18", lat: 56.082191, lon: -3.160905, height: 18.0 }
];

var lighthouses = [
	  { sname: "enlh", name: "Elie&nbsp;Ness&nbsp;(ENLH)", lat: 56.183956, lon: -2.812719, height: 15.0 }
	, { sname: "fdlh", name: "Fidra&nbsp;(FDLH)", lat: 56.073214, lon: -2.785130, height: 34.0 }
	, { sname: "brlh", name: "Bass&nbsp;Rock&nbsp;(BRLH)", lat: 56.076100, lon: -2.640700, height: 46.0 }
	, { sname: "imlh", name: "Isle&nbsp;of&nbsp;May&nbsp;(IMLH)", lat: 56.185617, lon: -2.557478, height: 73.0 }
	//, { sname: "iklh", name: "Inchkeith&nbsp;(IKLH)", lat: 56.033224, lon: -3.136630, height: 67.0 }
];

$(document).ready(function() {
	$("table#seafield-locations-auto").each(function() {
		var html = $(this).html();
		html += rowsOutputForTable(seafield);
		$(this).html(html);
	});
	$("table#lighthouses-locations-auto").each(function() {
		var html = $(this).html();
		html += rowsOutputForTable(lighthouses);
		$(this).html(html);
	});
	$("table#distances-auto").each(function() {
		var html = $(this).html();
		html += rowsOutputForDistances();
		$(this).html(html);
	});
	$("div#toc").each(function() {
		var html = $(this).html();
		html += toc();
		$(this).html(html);
	});
	$("a.anchor-scroll").anchorScroll({
		scrollSpeed: 800,
		offsetTop: 10,
		onScroll: function() {},
		scrollEnd: function() {}
	});
});

function toc() {
	var output = "";
	var prefix = "";
	var tdstyle = "";
	var total_count = 0;
	var main_count = 0;
	var sub_count  = 0;
	var headings = $("h2, h3, h4");
	var len = headings.length;
	headings.each(function(idx) {
		var curr = $(this);
		var prop = curr.prop("tagName");
		var html = curr.html();
		curr.attr("id", "title" + idx);
		if(prop == "H2") {
			main_count++;
			sub_count = 0;
			prefix = main_count.toString();
			tdstyle = "";
		}
		else {
			sub_count++;
			prefix = main_count.toString() + "." + sub_count.toString();
			tdstyle = ' style="padding-left: 20px;"';
		}
		if(total_count == 0) {
			output += '<table class="borderless">';
		}
		output += '<tr><td><em>' + prefix + '</em></td>' +
				'<td'+ tdstyle + '>' +
				'<em><a class="anchor-scroll" id="link' + idx + '" href="#title' + idx + '">' + html + '</a></em>' +
				'</td></tr>';
		total_count++;
		if(total_count >= len) {
			output += "</table>";
		}
	});
	return output;
}

function locationLink(name, lat, lon) {
	return '<a target="_blank" href="https://www.google.co.uk/maps/?t=k&q=loc:' +
		lat + "+" + lon + '">' + name + '</a>';
}

function rowsOutputForTable(which) {
	var output = "";
	if(!Array.isArray(which)) {
		return output;
	}
	for(var idx = 0; idx < which.length; idx++) {
		var data =  which[idx];
		var d = horizon_from_height(data['height']);
		var link = locationLink(data['name'], data['lat'], data['lon']);
		output += "<tr>";
		output += '<td class="seafield_data_row_name">' + link + '</td>';
		output += '<td class="seafield_data_row_lat">' + data['lat'].toString() + '</td>';
		output += '<td class="seafield_data_row_lon">' + data['lon'].toString() + '</td>';
		output += '<td class="seafield_data_row_height">' + data['height'].toString() + '</td>';
		output += '<td class="seafield_data_row_distance">' + d.toFixed(3).toString() + '</td>';
		output += "</tr>";
	}
	return output;
}

function rowsOutputForDistances() {
	var output = "";
	for(var seafield_idx = 0; seafield_idx < seafield.length; seafield_idx++) {
		var s = seafield[seafield_idx];
		var obs = new LatLon(s['lat'], s['lon']);
		var obs_hzn = horizon_from_height(s['height']);
		if(seafield_idx > 0) {
			output += '<tr><td colspan="7"><hr/></td></tr>';
		}
		for(var lh_idx = 0; lh_idx < lighthouses.length; lh_idx++) {
			var target = lighthouses[lh_idx];
			var critical = "";
			var below_value = "-";
			var below_prefix = '<span style="color: blue;">';
			var above_prefix = "";
			var lh = new LatLon(target['lat'], target['lon']);
			var lh_hzn = horizon_from_height(target['height']);
			var distance = obs.distanceTo(lh) / 1000;
			var bearing = obs.bearingTo(lh);
			var horizon_2_horizon = lh_hzn + obs_hzn;
			var below = height_from_horizon(distance - obs_hzn);
			var above = target['height'] - below;
			if(horizon_2_horizon >= distance) { // overlapping horizons?
				below_value = below.toFixed(1).toString();
				critical = '<span style="color: green;"><strong>Yes</strong><span>';
				above_prefix = '<span style="color: green;">';
			}
			else { // no, not overlapping, hidden below horizon
				critical = '<span style="color: red;"><strong>No</strong><span>';
				above_prefix = '<span style="color: red;">';
			}
			var s_name = locationLink(s['name'], s['lat'], s['lon']);
			var l_name = locationLink(target['name'], target['lat'], target['lon']);
			output += "<tr>" +
				"<td>" + s_name + "</td>" +
				"<td>" + l_name + "</td>" +
				"<td>" + distance.toFixed(3).toString() + "</td>" +
				"<td>" + critical + "</td>" +
				"<td><span style='color:blue;'>" + bearing.toFixed(0).toString() + "&deg;</span></td>" +
				"<td>" + below_prefix + below_value + "</span></td>" +
				"<td>" + above_prefix + above.toFixed(1).toString() + "</span></td>" +
				"</tr>";
		}
	}
	return output;
}

