(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    L.marker([44.650690, -63.596537]).addTo(map)
        .bindPopup('This is a sample popup. You can put any html structure in this including extra bus data. You can also swap this icon out for a custom icon. A png file has been provided for you to use if you wish.')
        .openPopup();


     /* Author: Linh Le - W0476946.
       Date: Feb 18, 2024.
       Assignment 3c: transittracker.
       Option 2: Real time Bus data.
    */

    //REQ-1: Demonstrate Retrieval of the Required Raw Transit Data
    
        //Fetch the flight data
        fetch(`https://prog2700.onrender.com/hrmbuses`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            //convertIntoGeoJsonFormat(json);//Convert Raw Data into GeoJSON format
        })
    
    
    //REQ-2: Convert Raw Data into GeoJSON format
    
    function convertIntoGeoJsonFormat(json){ //https://stackoverflow.com/questions/55496909/how-do-you-convert-normal-geographic-json-coming-from-server-into-geojson
      const geoJson= {
          type: "Feature",
          features: DataTransfer.map(item =>{
            return {
              id: item.id,
              geometry: {
                type: "Point",
                coordinates: [item.latitude, item.longitude]
              },
              properties: {
                trip: item.tripId,
                name: item.name,
                timestamp: item.timestamp,
                route: item.routeId,
                speed: item.speed
              }
            }
          })
          
        }

  }

    //REQ-3: Plot Markers on Map to Show Position of each Vehicle

    //REQ-4: Add Auto-Refresh Functionality to the Page

    //REQ-5: Additional Functionality


})()

