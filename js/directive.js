/*==================================================================================
Diretiva para permitir integrear a funcionalidade autocomplete da API do Google
Places diretamente na tag HTML (Sem precisar selecionar o elemento com getElement...).
==================================================================================*/
meuApp.directive('googleplace', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			var options = {
				types: [],
				componentRestrictions: {}
			};


			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			scope.gPlace.bindTo('bounds', scope.map);				

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				scope.$apply(
					scope.adicionaLocal()					
				);
			});
		}
	};
});