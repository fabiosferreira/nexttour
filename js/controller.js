meuApp.controller('DemoCtrl',function($scope){
  $scope.itinerario = {
    origem: '',
    dataCheg: null, 
    dataPart: null,
    categoria: 'CA',  
    night: false

  }; 

  $scope.categorias = ('Parques,Comida,Religião,Fitness,Cultura,Compras,Estudos e Pesquisas').split(',').map(function(categoria) {
    return {abbrev: categoria};
  });

  $scope.buscar = function(){
    
    alert("buscar");
  }
});