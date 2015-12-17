meuApp.controller('DemoCtrl',function($scope, placesFactory){
  $scope.itinerario = {
    origem: '',
    dataCheg: null, 
    dataPart: null,
    categoria: 'Atrações',  
    night: false
  }; 

  $scope.atividades = [];

  $scope.categorias = ('Atrações,Comida,Religião,Fitness,Cultura,Compras,Estudos e Pesquisas').split(',').map(function(categoria) {
    return {abbrev: categoria};
  });

  $scope.gPlace;
  $scope.places = [];
  $scope.comida = [];
  $scope.noite = [];

  $scope.map = new google.maps.Map(document.getElementById('map'), {
          //    center: {lat: -21.2196987, lng: -43.8041078},
          center: {lat: 12.237441, lng: -4.905296},
          zoom: 2,
          disableDefaultUI: true         
        });
  $scope.infowindow = new google.maps.InfoWindow();
  $scope.marker = new google.maps.Marker({
    map: $scope.map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  $scope.service = new google.maps.places.PlacesService($scope.map);


  $scope.adicionaLocal = function(){
    placesFactory.adicionaLocal($scope);
    sleep(10000);
    placesFactory.buscaComida($scope);  
    sleep(15000);  
    placesFactory.buscaNoite($scope);
    sleep(10000);  
  }

  $scope.buscar = function(){    
    placesFactory.montaItinerario($scope);
  }  
});
