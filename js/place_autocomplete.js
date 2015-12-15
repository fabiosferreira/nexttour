var map;
var infowindow;
var service;
var marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -21.2196987, lng: -43.8041078},
    zoom: 13,
    disableDefaultUI: true         
  });



  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('pac-input'));

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


    service = new google.maps.places.PlacesService(map);
      service.radarSearch({
      location: place.geometry.location,
      radius: 30000,
      //query: 'attractions'
      types: ['store']
    }, callback);

    //marker.setIcon(/** @type {google.maps.Icon} */({
      /*url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));

    console.log(place.geometry.location)
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);*/
  });
}

function obterDetalhes(x){
  console.log("Teste");
  var request = {        
    placeId: x
  };

  var resultado;
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function (r, s) {
        //if (s == google.maps.places.PlacesServiceStatus.OK) {
          //createMarker(r);
        //}
        
        
        resultado = r;
        console.log(resultado.name);
  });

  
  return resultado;
}

function callback(results, status) {

  for (var i =0; i < 30; i++) {
    r = obterDetalhes(results[i].place_id);

    console.log(i);
    //console.log(r)  ;
      
  }
}

function createMarker(place) {
  //var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);    
  });
}