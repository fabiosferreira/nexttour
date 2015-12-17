/*==================================================================================
Função para esperar para realizar novas requisições devido ao limite por segundo
imposto pela API do Google.
==================================================================================*/
function sleep(milliseconds) {	
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds)
			break;
	}
}