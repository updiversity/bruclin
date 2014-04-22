var yahooPipeId = '02afcc3cfc4b138c0b75a230a4d11ebd'; 

function load_calendar(cal, callback) {
  
  
  	myUrl='http://pipes.yahoo.com/pipes/pipe.run?_id='+yahooPipeId+'&_render=json&fromurl='+encodeURI(cal.id)+'&_callback=callback';

//	alert(cal.id);
//	alert(myUrl);

    reqwest({
    	url: myUrl,
    	type:'jsonp',
    	jsonpCallback: '_callback',
    	jsonpCallbackName: 'callback',
    	success: response
    	});
 
 
	function response(x){	
						
		var features = [],
            latfield = '',
            lonfield = '';
        if (!x || !x.value) return features;
        // Identificación de los campos con la latitud y la longitud
        var k=0;
        while(!latfield && !lonfield) {
        	k++;
	        for (var f in x.value.items[k]) {
	            if (f.match(/geo:lat/i)) latfield = f;
	            if (f.match(/geo:lon/i)) lonfield = f;
	        }
        }
 
        // Creación de las marcas
        for (var i = 0; i < x.value.items.length; i++) {
            var entry = x.value.items[i];
            var feature = {
            	type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
                properties: {
                	type: cal.name
                }                
            };
                        
            // Carga las propiedades de cada marca
            for (var y in entry) {
                if (y === latfield) feature.geometry.coordinates[1] = parseFloat(entry[y]);
                else if (y === lonfield) feature.geometry.coordinates[0] = parseFloat(entry[y]);
                else if (y === "y:title") feature.properties['title'] = entry[y];
 //               else if (y === "y:id") {
 //               	feature.properties['link'] = entry[y].value;
 //               }
                else if (y === "description") {
                	feature.properties['description'] = entry[y];
                }
                
                else if (y === "gd:when") {
					var when = {};
					when["startTime"] = new Date(entry[y].startTime).toString();
					when["endTime"] = new Date(entry[y].endTime).toString();
                    feature.properties["agenda"]=when;

                }
         		}

            if (feature.geometry.coordinates.length == 2
            		&& feature.properties['title']
            		&& feature.properties['description']
            		&& feature.properties['agenda']) {
//            	alert(JSON.stringify(feature));
//      			alert("//*[title =\'" + feature.properties['title'] + "\']");
      			//alert(feature.properties['title'].replace(/\\/g,""));
//            	alert(
//            		"//*/*"
//            		+ "[properties/title =\'" + feature.properties['title'].replace(/\\/g,"") + "\']"
//            		+ "[properties/description =\'" + feature.properties['description'].replace(/\\/g,"") + "\']"
//            		+ "[geometry/coordinates[1] =" + feature.geometry.coordinates[0] + "]"
//            		+ "[geometry/coordinates[2] =" + feature.geometry.coordinates[1]  + "]"
            		
//            	);
            	//"Exposicion \"Fernando Ventura\""
            	


            	
            	age = JSON.search(features,"//*/*"
            		+ "[properties/title =\'" + feature.properties['title'].replace(/\\/g,"") + "\']"
            		+ "[properties/description =\'" + feature.properties['description'].replace(/\\/g,"") + "\']"
            		+ "[geometry/coordinates[1] =" + feature.geometry.coordinates[0] + "]"
            		+ "[geometry/coordinates[2] =" + feature.geometry.coordinates[1]  + "]"
            		+ "/properties/agenda"           		
					);
	
            	ind = JSON.search(features,"//*/*"
	        		+ "[properties/title =\'" + feature.properties['title'].replace(/\\/g,"") + "\']"
	        		+ "[properties/description =\'" + feature.properties['description'].replace(/\\/g,"") + "\']"
	        		+ "[geometry/coordinates[1] =" + feature.geometry.coordinates[0] + "]"
	        		+ "[geometry/coordinates[2] =" + feature.geometry.coordinates[1]  + "]"
	        		+ "/preceding-sibling::*"           		
					).length;	

            	//
            	
//            	alert("fock1");
//            	alert(JSON.stringify(age));
//            	alert(JSON.stringify(fea));
//            	alert(JSON.stringify(age));
//            	alert(JSON.stringify(ind));

            	
            	if (age.length >0) {
            			age.push(feature.properties.agenda);
            			feature.properties.agenda = age ;

						features[ind]=feature;
//		            	alert("fock2");
//            			alert(JSON.stringify(features));

//		            alert("fock2");
//            		alert(JSON.stringify(res));

					} else {
						features.push(feature);
					};

//					
//		     		alert("fock4");
//            		alert(JSON.stringify(features));
					
//            		res.properties.agenda.push(feature.properties.agenda.when);
//            		alert("Fock");
            	
            	
            	//alert("result:" + JSON.stringify(jsont));
 //           	$("#test").html(JSON.stringify(features));

            	
//           	features.push(feature);
//            	alert("fock5");
//            	alert(JSON.stringify(features));
//            	        			doc = JSON.toXML(feature);
//            	        			alert(Defiant.node.prettyPrint(doc));

            	
            	}
                    	
        }
        
        
//        alert(JSON.stringify(features));

        
        for (i=0; i < features.length; i++) {
        				
        	features[i].properties.id = i+1;
        	if (features[i].properties.agenda.length) {

	        	
	        	sortagenda = features[i].properties.agenda.sort(function(a, b) {

	//  				return 1;      		
	    			return new Date(a.startTime) - new Date(b.startTime);
				});
				
				features[i].properties.agenda = sortagenda;
				
			};

        

        	
 //       	        when['startTime'] = DateFormat.format.date(new Date(entry[y].startTime), "hh.mm" );
 //                   when['endTime'] = DateFormat.format.date(new Date(entry[y].endTime),"hh.mm");
 //                   when['startDay'] = DateFormat.format.date(new Date(entry[y].startTime), "d" );
 //                   when['endDay'] = DateFormat.format.date(new Date(entry[y].endTime),"d");
        	
 //       }
                
	};



    	return callback(features,cal);

};

};