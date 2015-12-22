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

        //infowindow = new google.maps.InfoWindow();
        scope.infoWindow = new google.maps.InfoWindow();
        this.buscaLocal(scope);
    }

    factory.buscaLocal = function(scope){        
        scope.infowindow.close();
        scope.marker.setVisible(false);
        scope.places = []; 
        scope.atracoes = [];
        scope.rating = 4.5;

        var place = scope.gPlace.getPlace();
        var type = [];
        var self = this;
        
        scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: ['park', 'stadium', 'amusement_park', 'museum'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'locais');
        }
        );

        /*scope.service.nearbySearch({
            location: place.geometry.location,
            radius: 10000,      
            types: [],
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
        );*/
        sleep(5000);
        scope.service.textSearch({
            location: place.geometry.location,
            radius: 10000,
            query: ['atractions'],                
            zoom:17
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status,pagination,scope, 'atracoes');
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
            types: ['food', 'restaurant', 'cafe', 'bakery'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'comida');
        }
        );            
        /*scope.service.nearbySearch({
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
        );*/ 
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
            types: ['bar', 'night_club'],
            zoom:17,
        }, this.callback = function(results, status, pagination){
            self.guardaLocais(results,status, pagination, scope, 'noite');
        }
        );            
        /*scope.service.nearbySearch({
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
        );*/
    }

    factory.montaItinerario = function(scope){
      scope.atividades = [];
      var qtde_dias = Math.ceil((scope.itinerario.dataPart.getTime()-scope.itinerario.dataCheg.getTime())/1000/60/60/24);      

      for (var i = 0; i < scope.atracoes.length; i++) {
        var existe = false;

        for (var x = 0; x < scope.places.length; x++) {
          if (scope.places[x].place_id==scope.atracoes[i].place_id){
            existe=true;
            break;
          }
        };
        
        if (!existe)
          scope.places.push(scope.atracoes[i]);        
      };

      //Ordenando os pontos de interesse de acordo com o número de reviews
      scope.places = scope.places.sort(function(a,b) {
        if(a.user_ratings_total > b.user_ratings_total) return -1;
        if(a.user_ratings_total < b.user_ratings_total) return 1;
        return 0;
      });

      //Duas atividades por dia
      if (qtde_dias < 5){
          for (var i = 0, x=0; i < qtde_dias; i++, x+=2) {
            var dia = {     
              data: (scope.itinerario.dataCheg.getDate()+i)+ "/" + (scope.itinerario.dataCheg.getMonth() + 1) + "/" + scope.itinerario.dataCheg.getFullYear(),         
              local: [scope.places[x], scope.places[x+1]],
              comida: scope.comida[i],
              noite: scope.noite[i]
            };
            scope.atividades.push(dia);
          }
      //Uma atividade por dia
      }else{
          for (var i = 0; i < qtde_dias; i++) {
            var dia = {   
              data: (scope.itinerario.dataCheg.getDate()+i)+ "/" + (scope.itinerario.dataCheg.getMonth() + 1) + "/" + scope.itinerario.dataCheg.getFullYear(),         
              local: [scope.places[i]],
              comida: scope.comida[i],
              noite: scope.noite[i]
            };
            scope.atividades.push(dia);
          }
      }      
    }
    /*Função que pega os pontos de interesse de acordo com as opções do usuário e 
      os guarda em uma lista. Os dados são ordenados de acordo com a avaliação dos 
      usuário e o número de reviews.
    */
    factory.guardaLocais = function(results, status, pagination, scope, tipo) {       
      var self = this;
      var locais=[]; 
      var rating = scope.rating;     

      if (tipo=='comida'){        
        locais = scope.comida;             
      }else if (tipo=='noite'){
        locais = scope.noite;  
        if (scope.rating!=4){
          rating = 4.2;
        }                  
      }else if (tipo=='atracoes'){
        locais = scope.atracoes;              
      }else{
        locais = scope.places;   
        //cidades pequenas
        if (results.length < 19){
          rating = 4;
          scope.rating = 4;
        }          
      }
      
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(tipo+status);
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
            if (result.place_id == locais[x].place_id || result.name==locais[x].name){
              existe = true;
              break;
            }               
          }

          if (existe)
            continue;

          //Seleciona apenas os pontos de interesse com avaliação superior a 4.5
          if (result.rating >= rating && result.geometry.location !=null){                        

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
      
      if (tipo=='comida'){        
        scope.comida = locais;
      }else if (tipo=='noite'){
        scope.noite = locais;              
      }else if (tipo=='atracoes'){
        scope.atracoes = locais;              
      }else{
        scope.places = locais;
      }
    }

    //Adicionando marcador do ponto de interesse no mapa
    factory.addMarker = function(scope, place) {
      var icon = place.icon;
      if (place.photos !=undefined){
        icon = place.photos[0].getUrl({
            'maxWidth': 100,
            'maxHeight': 100
        });
      }
      
      var marker = new google.maps.Marker({
        map: scope.map,
        position: place.geometry.location,
        optimized:false,
        icon: {
          url: icon,
          anchor: new google.maps.Point(10, 10),          
        }
      });

     
      google.maps.event.addListener(marker, 'click', function() {


        scope.service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }                       
          var infotext = "<div><div style='float:left;'>" +
                    "<span style='font-size:18px;font-weight:bold;'>"+result.name+"</span><hr>";          

          var pos = result.formatted_address.indexOf(",", result.formatted_address.indexOf(",")+1);
          end1 = result.formatted_address.substring(0, pos);
          end2 = result.formatted_address.substring(pos+1);
          infotext +=end1+"<br>";
          infotext +=end2+"<br>";
         
          if (result.formatted_phone_number != null){
            infotext += result.formatted_phone_number+"<br>";
          }
          
          if (result.opening_hours !== undefined){
            if (result.opening_hours.open_now){
              infotext+="<div class='aberto'>Aberto Agora</div>";
            }else{
              infotext+="<div class='fechado'>Fechado Agora</div>";
            }
          }

          infotext +="<a href='"+result.website+"' target='_blank'>" + result.name+
                    "</div><div class='imagemBox'><img src='" +icon+
                    "'></img></div></div>";                    
          scope.infowindow.setContent(infotext);

          scope.infowindow.open(scope.map, marker);
          
        });
        
      });

      var myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function () {
        //this assigns an id to the markerlayer Pane, so it can be referenced by CSS
        this.getPanes().markerLayer.id='markerLayer'; 
      };
      myoverlay.setMap(scope.map);      
 
    }

    return factory;
  });