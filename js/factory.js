meuApp.factory('crudTarefa', function($rootScope){
  var factory = {}

  var tbTarefas = localStorage.getItem("tbTarefas");// Recupera os dados armazenados

  tbTarefas = JSON.parse(tbTarefas); // Converte string para objeto

  if(tbTarefas == null) // Caso não haja conteúdo, iniciamos um vetor vazio
    tbTarefas = [];
  
  factory.adicionaTarefa = function(tarefa){    
    //formatando a data
    var d = tarefa.data.getDate();
    var m =  tarefa.data.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = tarefa.data.getFullYear();

    tarefa.data = d + "/" + m + "/" + y;    
    tbTarefas.push(tarefa);

    localStorage.setItem("tbTarefas", JSON.stringify(tbTarefas));

    if (tarefa.tarefa)
      alert("Tarefa adicionada!"); 
    else{
      alert("Lembrete adicionado!")
    }
    window.location.reload();  
  }

  factory.removeTarefa = function(tarefa){ 
    var index = -1;

    for (var item in tbTarefas) {
        if (tbTarefas[item].descricao == tarefa.descricao)
            index=item;
    }
    
    tbTarefas.splice(index, 1);
    localStorage.setItem("tbTarefas", JSON.stringify(tbTarefas));
    alert("Registro removido da agenda.");
    window.location.reload();
  }
  return factory;
});