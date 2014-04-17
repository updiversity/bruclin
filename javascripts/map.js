//var calendarEventosUrl = 'https://www.google.com/calendar/feeds/r16skd2s2pdratmf1j6aqaannk%40group.calendar.google.com/public/full?max-results=50';
//	calendarSitiosUrl = 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50';
//	calendarSitiosUrl = 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50';

var	calendars = [
	 {"id" : 'https://www.google.com/calendar/feeds/ac3di8tnckg1dq0n935kk1gbos%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Sitios",
	 "colorcssclass": "color-red"},
	{"id" : 'https://www.google.com/calendar/feeds/7eq4jtb1bpjppvdu1tc91v3a4c%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Eventos",
	 "colorcssclass": "color-blue"},
	 {"id" : 'https://www.google.com/calendar/feeds/6lagf1dq9g8e550h0e5qmh70ck%40group.calendar.google.com/public/full?max-results=50',
	 "name": "Ruta Slow",
	 "colorcssclass": "color-green"}] ;
	 
var indexLatLonArtistasBarrioMap = [
	{"id":68 , "coordinates": [-3.73645,40.411091]},
	{"id":69 , "coordinates": [-3.728126,40.413418]},
	{"id":70 , "coordinates": [-3.72791,40.41177]},
	{"id":71 , "coordinates": [-3.73265,40.41098]},
	{"id":72 , "coordinates": [-3.72705,40.412273]},
	{"id":73 , "coordinates": [-3.72744,40.41214]},
	{"id":74 , "coordinates": [-3.72735,40.412449]},
	{"id":75 , "coordinates": [-3.72788,40.412472]},
	{"id":76 , "coordinates": [-3.72545,40.413132]},
	{"id":77 , "coordinates": [-3.725898,40.412907]},
	{"id":78 , "coordinates": [-3.73479,40.41037]},
	{"id":79 , "coordinates": [-3.725755,40.412876]},
	{"id":80 , "coordinates": [-3.72486,40.41288]},
	{"id":81 , "coordinates": [-3.7305,40.4118]},
	{"id":82 , "coordinates": [-3.72615,40.413238]},
	{"id":83 , "coordinates": [-3.725755,40.412876]},
];

var iconColorClass="color-blue";

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
	
var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
        });
        map.addControl(sidebar);
        
var visible = sidebar.isVisible();

L.control.locate().addTo(map);
	
map.on('click', function () {
            sidebar.hide();
       });

var markers = new L.MarkerClusterGroup({
	iconCreateFunction: function (cluster) {		
		var childMarkers = cluster.getAllChildMarkers();
		
		return L.divIcon({ 
			className: 'count-icon' + ' ' + iconColorClass , 
			iconSize: [30, 30], 
			html: '<b>' + childMarkers[0].feature.properties.id + '</b>'});
		},
		maxClusterRadius:1,
		spiderfyOnMaxZoom: false,
		zoomToBoundsOnClick: false
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
	collapsed:false	
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

markers.on('clusterclick', function (a) {
    var childMarkers = a.layer.getAllChildMarkers();
    var info = '';
    for (var x in childMarkers) {
    	info = info + format_marker_info(childMarkers[x]);
    };
	sidebar.setContent(info);
	
	if (visible == false) {
		sidebar.show();
	}; 
});

function main_execute(myData, cal) {
                                
        //alert(JSON.stringify(myData));
                                
        var markersCategoryLayer = L.mapbox.featureLayer().setGeoJSON(myData);
     
     	category_index = style_calendar(cal);
		markersCategoryLayer.eachLayer(function(marker){
			marker.feature.properties.id = get_marker_id(marker.feature.geometry.coordinates) ;
			icon = new L.divIcon({
		         className: 'count-icon' + ' ' + iconColorClass,
		         html: '<b>' + marker.feature.properties.id + '</b>',
		         iconSize: [30,30],
		    });
			marker.setIcon(icon);
			marker.on('click', function () {
				this.closePopup();
				sidebar.setContent(format_marker_info(this));
            	if (visible == false) {
					sidebar.show();
				}; 
        	});	
			markers.addLayer(marker);
			markers_category[category_index].push(marker);
		});

		map.fitBounds(markersCategoryLayer.getBounds());

}

function style_calendar(cal) {
	return "<i class='legend-i" + " " + cal.colorcssclass + "'></i>"  + cal.name;
}

function get_marker_id(latlon) {
	var id = JSON.search(indexLatLonArtistasBarrioMap,"//*/*"
            		+ "[coordinates[1] =" + latlon[0] + "]"
            		+ "[coordinates[2] =" + latlon[1]  + "]"
            		+ "/id"           		
					);
	if (id.length == 0) {
		var newId = new Number(JSON.search(indexLatLonArtistasBarrioMap,"//*[last()]/id")) + 1 ;
		indexLatLonArtistasBarrioMap.push({"id":newId, "coordinates": [latlon[0],latlon[1]]});
	} else {
		var newId = id[0];
	}
	return newId;			
}

function format_marker_info(marker) {
    	
    var startTime = DateFormat.format.date(marker.feature.properties.agenda.startTime,"D, HH:mm");
    var endTime = DateFormat.format.date(marker.feature.properties.agenda.endTime, "D, HH:mm");
    	
    var info =
      '<table class="tg"><tr>'
      + ' <th class="tg-0ki0">&gt;' + startTime + '<br>&nbsp; ' + endTime + '&lt;</th>'
	  +	'<th class="tg-031e">' 
	  + '<p><b>' +  marker.feature.properties.title + '</b><p>'
	  + '<p>' + marker.feature.properties.description + '<p>'
	  + '</th>'
      + '</tr></table>';
    	
	return info;
}

for (var cal in calendars) {
	load_calendar(calendars[cal],main_execute);
	};


