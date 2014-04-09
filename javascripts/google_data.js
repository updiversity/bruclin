function load_spreadsheet(id, callback) {
    reqwest({
    	url:"https://spreadsheets.google.com/feeds/list/" + id + "/1/public/values?alt=json-in-script&callback=callback",
    	type:'jsonp',
    	jsonpCallback: 'callback',
    	success: response
    	});
    
    function response(x) {
    	var features = [],
            latfield = '',
            lonfield = '';
        if (!x || !x.feed) return features;
        // Identificación de los campos con la latitud y la longitud
        for (var f in x.feed.entry[0]) {
            if (f.match(/\$geolat/i)) latfield = f;
            if (f.match(/\$geolon/i)) lonfield = f;
        }
        // Creación de las marcas
        for (var i = 0; i < x.feed.entry.length; i++) {
            var entry = x.feed.entry[i];
            var feature = {
            	type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
                properties: {
                }
                
            };
            // Carga las propiedades de cada marca
            for (var y in entry) {
                if (y === latfield) feature.geometry.coordinates[1] = parseFloat(entry[y].$t);
                else if (y === lonfield) feature.geometry.coordinates[0] = parseFloat(entry[y].$t);
                else if (y.indexOf('gsx$') === 0) {
                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
                }
            }
            if (feature.geometry.coordinates.length == 2) features.push(feature);
        }
        
    	return callback(features);
    };
  	
};