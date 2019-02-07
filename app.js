class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}//this[i] verifica os valores dos campos
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')//se ja existir id guarda omvalor no let id

		if(id === null) {//se nao existir id ele cria o campo(key) id com valor 0
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')//guarda valor atual do id
		return parseInt(proximoId) + 1//soma com mais um e retorna 
	}

	gravar(d) {
		let id = this.getProximoId()//executa metodo proximo id e guarda no let id

		localStorage.setItem(id, JSON.stringify(d))//guarda o let id no campo(key) id, converte o parametro (d) que tem notação literal em notação json e guarda tambem o local storage(bd)

		localStorage.setItem('id', id)//atualiza campo(key) id com o novo ultimo id
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa e transformados para literal
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}
			despesa.id=i;
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){
		let despesasfiltradas=Array();
		despesasfiltradas=this.recuperarTodosRegistros();

		if(despesa.ano!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.ano==despesa.ano);//vai filtrando o array e atualizando em caso de true na function
		}
		if(despesa.mes!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.mes==despesa.mes);
		}
		if(despesa.dia!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.dia==despesa.dia);
		}
		if(despesa.tipo!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.tipo==despesa.tipo);
		}
		if(despesa.descricao!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.descricao==despesa.descricao)
		}
		if(despesa.valor!=''){
			despesasfiltradas=despesasfiltradas.filter(d=>d.valor==despesa.valor);
		}
		return despesasfiltradas
	}
	remover(id){
		localStorage.removeItem(id);
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value=''
		mes.value=''
		dia.value=''
		tipo.value=''
		descricao.value=''
		valor.value=''
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(),filtro=false) {

	if(despesas.length==0 && filtro==false){//if o array for o default vazio e o filtro estiver falso que nao é pra filtrar e sim mostrar todos registros entra no if
		despesas = bd.recuperarTodosRegistros();
	}

	//selecionando o elemento tbody da tabela na consulta.html
	let listaDespesas=document.getElementById('listaDespesas')
	listaDespesas.innerHTML=''

	//percorrer o array despesas, listado cada despesa de forma dinamica
	despesas.forEach(function(d){
		//criando a linha(tr)
		let linha=listaDespesas.insertRow()

		//criar as colunas(td)
		linha.insertCell(0).innerHTML=`${d.dia}/${d.mes}/${d.ano}`
		//ajustar o tipo
		switch(d.tipo){
			case '1':d.tipo='Alimentação'
				break
			case '2':d.tipo='Educação'
				break
			case '3':d.tipo='Lazer'
				break
			case '4':d.tipo='Saúde'
				break
			case '5':d.tipo='Transporte'
				break
		}
		linha.insertCell(1).innerHTML=d.tipo
		linha.insertCell(2).innerHTML=d.descricao
		linha.insertCell(3).innerHTML=d.valor
		//criando botao de exclusão
		let btn=document.createElement('button');
		btn.className='btn btn-danger';
		btn.innerHTML='<i class="fas fa-times"></i>';
		btn.id=`id_despesa_${d.id}`;
		btn.onclick=function(){
			let id=this.id.replace('id_despesa_','');
			bd.remover(id);
			window.location.reload();
		}
		linha.insertCell(4).append(btn);
	})
}
 function pesquisardespesa(){
 	let ano=document.getElementById('ano').value
 	let mes=document.getElementById('mes').value
 	let dia=document.getElementById('dia').value
 	let tipo=document.getElementById('tipo').value
 	let descricao=document.getElementById('descricao').value
 	let valor=document.getElementById('valor').value

 	let despesa=new Despesa(ano, mes, dia, tipo, descricao, valor)
 	let despesas=bd.pesquisar(despesa);

 	carregaListaDespesas(despesas, true);//o true manda que o filtro é verdadeiro é pr se fazer a filtragem
}