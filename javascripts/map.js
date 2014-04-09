//var calendarEventosUrl = 'https://www.google.com/calendar/feeds/r16skd2s2pdratmf1j6aqaannk%40group.calendar.google.com/public/full?max-results=50';
//	calendarSitiosUrl = 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50';
//	calendarSitiosUrl = 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50';

var	calendars = [
	{"id" : 'https://www.google.com/calendar/feeds/7eq4jtb1bpjppvdu1tc91v3a4c%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Eventos",
	 "colorcssclass": "color-blue"},
	 {"id" : 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Sitios",
	 "colorcssclass": "color-red"},
	 {"id" : 'https://www.google.com/calendar/feeds/6lagf1dq9g8e550h0e5qmh70ck%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Ruta Slow",
	 "colorcssclass": "color-green"}] ;

var	tile_bruclinId = 'ighbal.rkjoflxr',
	tile_transMadId = 'ighbal.6t6b6gvi',
 	osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>',
    brucLink = '<a href="http://updiversity.github.io/">UpDiversity</a>',
    transThunderUrl = 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
    thunAttrib = '&copy; ' + osmLink + ' Contributors & ' + thunLink,
    brucAttrib = ' Contributors & ' + brucLink;

var categories = {},
    categories_meta = {},
    overlayMaps = {},
    markers_category = {},
    leaflet_meta = {},
    random_category_index = '';
    overlayMaps_status = {};

//load google shared data
//load_spreadsheet(id_spreadsheet, mapData);

var transThunderLayer = L.tileLayer(transThunderUrl , {attribution: thunAttrib,  format:'png64'}),
    bruclinLayer = L.mapbox.tileLayer(tile_bruclinId, {format:  'png64'}),
    transMadLayer = L.mapbox.tileLayer(tile_transMadId);

var groupTransportLayer = L.layerGroup([transThunderLayer, transMadLayer]);
var groupBruclinLayer = L.layerGroup([bruclinLayer]);

var map = L.map('map');

var baseLayers = {
	"Transport": groupTransportLayer,
	"Bruclin": groupBruclinLayer.addTo(map)
	};

//var controlLayers = L.control.layers(baseLayers).addTo(map);
	
L.control.locate().addTo(map);
	
function mapData(myData){
		
	var bruclinEventos2014Layer = L.markerClusterGroup({
			iconCreateFunction: function (cluster) {										
				return L.divIcon({ className: "count-icon" , iconSize: [30, 30] });
			},
			maxClusterRadius:1
			});

	var bruclinEventosLayer = L.mapbox.featureLayer().setGeoJSON(myData);

	bruclinEventosLayer.eachLayer(function(marker){
		 marker.setIcon(new L.divIcon({
	         className: 'count-icon',
	         html: '<b>' + marker.feature.properties.id + '</b>',
	         iconSize: [30,30]
	     }));
	     bruclinEventos2014Layer.addLayer(marker);
	});
		
	map.fitBounds(bruclinEventosLayer.getBounds());
	controlLayers.addOverlay(bruclinEventos2014Layer, "Eventos");
	
};

var markers = new L.MarkerClusterGroup({
	iconCreateFunction: function (cluster) {
		
		var overlaysCount = 0;
		var category_index;
		var i=0;
		for (var val in overlayMaps_status) {
			overlayMaps_status[val] ? overlaysCount++ : overlaysCount;
			if (overlayMaps_status[val]) category_index = i;
			i++;
		};
		
		if (overlaysCount == 1) {
			iconColorClass = calendars[category_index].colorcssclass;
			return L.divIcon({ className: 'count-icon' + ' ' + iconColorClass , iconSize: [30, 30], html:'...' });
		} else {
			return L.icon({ iconUrl: 'icons/bruclinmadrid.svg', iconSize: [30, 30] });
		}
		
		},
		maxClusterRadius:1
	});
	


var categories = {};
for (var cal in calendars) {
	var categories_index = style_calendar(calendars[cal]);
	categories[categories_index] = new L.layerGroup().addTo(map);
};
    
for(var index in categories) {
    markers_category[index] = [];
 	overlayMaps[index] = categories[index];
 	overlayMaps_status[index] = true;
}

var control = L.control.layers(baseLayers, overlayMaps, {
	position:'topleft'	
});

control.addTo(map);

map.addLayer(markers);
for (var row in control._layers) {
    leaflet_meta[L.Util.stamp(control._layers[row].layer)] = control._layers[row].name;
}
map.on('overlayadd', function (a) {
    markers.clearLayers();
	var category_index = leaflet_meta[L.Util.stamp(a.layer)];
	overlayMaps_status[category_index]=true;
	for (cat in categories) {
		if (overlayMaps_status[cat]) markers.addLayers(markers_category[cat]);
	};
});

map.on('overlayremove', function (a) {
	markers.clearLayers();
	var category_index = leaflet_meta[L.Util.stamp(a.layer)];
	overlayMaps_status[category_index]=false;
	for (cat in categories) {
		if (overlayMaps_status[cat]) markers.addLayers(markers_category[cat]);
	};		
});

function main_execute(myData, cal) {
                
        var markersCategoryLayer = L.mapbox.featureLayer().setGeoJSON(myData);
     
     	category_index = style_calendar(cal);
		markersCategoryLayer.eachLayer(function(marker){
			icon = new L.divIcon({
		         className: 'count-icon' + ' ' + cal.colorcssclass,
		         html: '<b>' + marker.feature.properties.id + '</b>',
		         iconSize: [30,30],
		    });
			marker.setIcon(icon);
			markers.addLayer(marker);
			markers_category[category_index].push(marker);
		});

		map.fitBounds(markersCategoryLayer.getBounds());

}

function style_calendar(cal) {
	//alert ("<li><i class='legend-i" + " " + cal.colorcssclass + "'></i>" + cal.name+"</li>");
	return "<i class='legend-i" + " " + cal.colorcssclass + "'></i>"  + cal.name;
}
//load_calendar(calendarEventosUrl,mapData);

for (var cal in calendars) {
	load_calendar(calendars[cal],main_execute);
	};


