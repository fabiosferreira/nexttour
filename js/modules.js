var meuApp = angular.module( 'nexttour', [ 'ngMaterial' ] )

meuApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('blue');          
});

