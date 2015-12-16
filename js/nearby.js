var map;
var infoWindow;
var service;
var places=[];
/*amusement_park
aquarium
art_gallery
bakery
bar
cafe
casino
food
gym
hindu_temple
library
mosque
movie_theater
museum
night_club
park
restaurant
shopping_mall
spa
stadium
synagogue
university
zoo*/

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
//    center: {lat: -21.2196987, lng: -43.8041078},
    center: {lat: 12.237441, lng: -4.905296},

    zoom: 2,
    disableDefaultUI: true         
  });
  
  

  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('origem'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  infowindow = new google.maps.InfoWindow();
  marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    places = [];
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
      location: place.geometry.location,
      radius: 10000,      
      types: ['park'],
      zoom:13,
   }, callback);

  service.textSearch({
      location: place.geometry.location,
      radius: 10000,
      query: ['atractions'],
      //types: ['park']
      zoom:13
  }, callback);
  //map.addListener('idle', performSearch);
});
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds)
      break;
  }
}

function callback(results, status,pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }  

  if(pagination.hasNextPage){
    pagination.nextPage();
  }

  var limit= 10;

  for (var i = 0, result; result = results[i]; i++) {
    var existe = false;
    for ( var x = 0; x < places.length; x ++) {
      if (result.place_id == places[x].place_id){
        existe = true;
        break;
      }
    }

    if (existe)
      continue;
    
    if (result.rating >= 4.5){
      //console.log(places.length+"- "+result.name+" - "+result.rating+" - "+result.user_ratings_total);
      
      if (places.length%limit == 0){
        sleep(1000);
        limit--;
      }
        
      service.getDetails(result, function (r, s) {        
        //console.log(r);
        
        places.push(r);
        
        //places.push(r);
        
        addMarker(r);
      });
    }else{
      continue;
    } 

  }
  places = places.sort(function(a,b) {
    if(a.user_ratings_total > b.user_ratings_total) return -1;
    if(a.user_ratings_total < b.user_ratings_total) return 1;
    return 0;
  });
  
  for ( var y = 0; y < places.length; y ++) {
    console.log(places.length+"- "+places[y].name+" - "+places[y].rating+" - "+places[y].user_ratings_total);
  }
}


function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'http://maps.gstatic.com/mapfiles/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      console.log(result);
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}
