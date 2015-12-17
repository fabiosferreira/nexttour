/*==================================================================================
Fábrica com funções responsáveis por manipular os pontos de interesse do usuário.
==================================================================================*/
meuApp.factory('placesFactory', function($rootScope){
    var factory = {}

    //Função padrão para busca de pontos de interesse
    factory.adicionaLocal = function(scope) {
        scope.infowindow.close();
        scope.marker.setVisible(false);
        scope.places = [];
        var place = scope.gPlace.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            scope.map.fitBounds(place.geometry.viewport);
        } else {
            scope.map.setCenter(place.geometry.location);
            scope.map.setZoom(17);  // Why 17? Because it looks good.
        }

        infowindow = new google.maps.InfoWindow();
        this.buscaLocal(scope);
    }

    factory.buscaLocal = function(scope){        
        scope.infowindow.close();
        scope.marker.setVisible(false);
        scope.places = [];  

        var place = scope.gPlace.getPlace();
        var type = [];
        var self = this;
        
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['park'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'locais');
        }
        );

        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['amusement_park'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'locais');
        }
        );

        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['museum'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'locais');
        }
        );

        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['stadium'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'locais');
        }
        );
        
        scope.service.textSearch({
            location: place.geometry.location,
            radius: 10000,
            query: ['atractions'],
                //types: ['park']
                zoom:17
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status,pagination,scope, 'locais');
            }
        );
    }

    factory.buscaComida = function(scope){        
        scope.infowindow.close();
        scope.marker.setVisible(false);
        scope.comida = [];  

        var place = scope.gPlace.getPlace();        
        var self = this;
        
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['food'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'comida');
        }
        );            
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['restaurant'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'comida');
        }
        ); 
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['cafe'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'comida');
        }
        ); 
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['bakery'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'comida');
        }
        ); 
    }

    factory.buscaNoite = function(scope){        
        scope.infowindow.close();
        scope.marker.setVisible(false);
        scope.noite = [];  

        var place = scope.gPlace.getPlace();        
        var self = this;
        
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['bar'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'noite');
        }
        );            
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['casino'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'noite');
        }
        ); 
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['night_club'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'noite');
        }
        );          
    }

    factory.montaItinerario = function(scope){
      scope.atividades = [];
      var qtde_dias = Math.ceil((scope.itinerario.dataPart.getTime()-scope.itinerario.dataCheg.getTime())/1000/60/60/24);
      console.log(qtde_dias);
      
      //Duas atividades por dia
      if (qtde_dias < 5){
          for (var i = 1, x=1; i <= qtde_dias; i++, x+=2) {
            var dia = {     
              data: (scope.itinerario.dataCheg.getDate()+i-1)+ "/" + (scope.itinerario.dataCheg.getMonth() + 1) + "/" + scope.itinerario.dataCheg.getFullYear(),         
              local: [scope.places[x], scope.places[x+1]],
              comida: scope.comida[i],
              noite: scope.noite[i]
            };
            scope.atividades.push(dia);
          }
      //Uma atividade por dia
      }else{
          for (var i = 1; i <= qtde_dias; i++) {
            var dia = {   
              data: (scope.itinerario.dataCheg.getDate()+i-1)+ "/" + (scope.itinerario.dataCheg.getMonth() + 1) + "/" + scope.itinerario.dataCheg.getFullYear(),         
              local: [scope.places[i]],
              comida: scope.comida[i],
              noite: scope.noite[i]
            };
            scope.atividades.push(dia);
          }
      }
      console.log(scope.atividades);
    }
    /*Função que pega os pontos de interesse de acordo com as opções do usuário e 
      os guarda em uma lista. Os dados são ordenados de acordo com a avaliação dos 
      usuário e o número de reviews.
    */
    factory.guardaLocais = function(results, status, pagination, scope, tipo) {       
      var self = this;
      var locais=[];

      if (tipo=='comida'){        
        locais = scope.comida;        
      }else if (tipo=='noite'){
        locais = scope.noite;              
      }else{
        locais = scope.places;              
      }
      
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }  

      if(pagination.hasNextPage){
        pagination.nextPage();        
      }

      var limit= 10;

      //Percorrendo o resultado da busca
      for (var i = 0, result; result = results[i]; i++) {
          var existe = false;          

          //Verificando se o ponto de interesse já foi adicionado à lista
          for ( var x = 0; x < locais.length; x ++) {                       
            if (result.place_id == locais[x].place_id){
              existe = true;
              break;
            }
          }

          if (existe)
            continue;

          //Seleciona apenas os pontos de interesse com avaliação superior a 4.5
          if (result.rating >= 4.5 && result.geometry.location !=null){                        

            if (locais.length%limit == 0){
              sleep(1000);
              limit--;
            }

            //Obtendo maiores informações sobre o ponto de interesse
            scope.service.getDetails(result, function (r, s) {                                        
              if (r!=null){
                locais.push(r);
                self.addMarker(scope,r);                
              }
            });
          }else{
            continue;
          } 
      }

      //Ordenando os pontos de interesse de acordo com o número de reviews
      locais = locais.sort(function(a,b) {
        if(a.user_ratings_total > b.user_ratings_total) return -1;
        if(a.user_ratings_total < b.user_ratings_total) return 1;
        return 0;
      });

      console.log(tipo);
      for ( var y = 0; y < locais.length; y ++) {        
        console.log(locais.length+"- "+
          locais[y].name+" - "+locais[y].rating+" - "+locais[y].user_ratings_total);
      }

      if (tipo=='comida'){
        scope.comida = locais;
      }else if (tipo=='noite'){
        scope.noite = locais;              
      }else{
        scope.places = locais;
      }
    }

    //Adicionando marcador do ponto de interesse no mapa
    factory.addMarker = function(scope, place) {
      var marker = new google.maps.Marker({
        map: scope.map,
        position: place.geometry.location,
        icon: {
          url: 'http://maps.gstatic.com/mapfiles/circle.png',
          anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(10, 17)
        }
      });

      google.maps.event.addListener(marker, 'click', function() {

        scope.service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }    
          console.log("InfoWindow")  ;
          console.log(scope.infowindow);
          scope.infowindow.setContent(result.name);
          scope.infowindow.open(scope.map, marker);
        });
      });
    }

    return factory;
  });