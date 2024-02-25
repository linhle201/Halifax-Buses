
(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    //L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]]).addTo(map)
       // .bindPopup('This is a sample popup. You can put any html structure in this including extra bus data. You can also swap this icon out for a custom icon. A png file has been provided for you to use if you wish.')
        //.openPopup();


     /* Author: Linh Le - W0476946.
       Date: Feb 18, 2024.
       Assignment 3c: transittracker.
       Option 2: Real time Bus data.
    */

    //REQ-1: Demonstrate Retrieval of the Required Raw Transit Data
    //REQ-4: Add Auto-Refresh Functionality to the Page
        let markers = [];
    
        function updatingTheMap(){   //Fetch the flight data
        fetch(`https://prog2700.onrender.com/hrmbuses`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            const filteredTenRoute = json.entity.filter(item => 
                parseInt(item.vehicle.trip.routeId) >= 1 && parseInt(item.vehicle.trip.routeId) <= 10
            );
            console.log(filteredTenRoute);
            let data= convertIntoGeoJsonFormat(filteredTenRoute);//Convert Raw Data into GeoJSON format
            markerOnMap(data);   
        })
        }
        updatingTheMap();
        setInterval(updatingTheMap, 2000);
       
    //REQ-2: Convert Raw Data into GeoJSON format
    function convertIntoGeoJsonFormat(filteredTenRoute){ //https://stackoverflow.com/questions/55887875/how-to-convert-json-to-geojson
        return {
            type: "FeatureCollection",
            features: filteredTenRoute.map(item => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [item.vehicle.position.longitude, item.vehicle.position.latitude]
                },
                properties: {
                    trip: item.vehicle.trip.tripId,
                    bearing: item.vehicle.position.bearing,
                    timestamp: item.vehicle.timestamp,
                    route: item.vehicle.trip.routeId,
                    speed: item.vehicle.position.speed,
                    label: item.vehicle.vehicle.label
                }
            }))
        };
    }

    //REQ-3: Plot Markers on Map to Show Position of each Vehicle
    function markerOnMap(data){

        markers.forEach(marker => map.removeLayer(marker));
         markers = [];

        data.features.forEach(feature => {
            let busIcon = L.icon({ 
                iconUrl: `bus.png`, 
                iconSize: [28, 28], // size of the icon
        iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
       
            });

            let rotateBus = (0+ feature.properties.bearing)-5 ;
            let marker= L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { icon: busIcon, rotationAngle: rotateBus })
                .addTo(map)
                .bindPopup(`<b>Vehicle ID:</b> ${feature.properties.label}<br>
                            <b>Trip ID:</b> ${feature.properties.trip}<br>
                            <b>Route:</b> ${feature.properties.route}<br>
                            <b>Timestamp:</b> ${feature.properties.timestamp}<br>
                            <b>Bearing:</b> ${feature.properties.bearing}<br>
                            <b>occupancyStatus:</b> ${feature.properties.occupancyStatus}<br>
                            <b>Speed:</b> ${feature.properties.speed}`);

        markers.push(marker);
        });
    }
    //REQ-5: Additional Functionality

    
})()

