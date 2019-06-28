import { salvarConta, buscaContaPorMes, efetuaCancelamentoConta, listaContaCobranca, listaContaVencidaCobranca, buscaRelatorioComFiltro } from '../conta/conta.dao'
import { salvarHistoricoConta, calculaValorGastoPorPeriodo, cancelaHistoricoConta, calculaValorPagoPorPeriodo, confirmaPagamentoHistoricoConta } from '../historico_conta/historico_conta.dao'
import { buscaSituacaoContaPorNome } from '../situacao_conta/situacao_conta.dao'
import DataHandler from '../../handlers/data.handler'
import httpStatus from 'http-status'
import camelize from 'camelize'
import moment from 'moment'

export async function cadastrar (req, res, next) {
	try {
		let valorParcela = 0
		let contaCadastrada = await salvarConta(req.body)

		contaCadastrada.dataCobranca = moment().format("YYYY-MM") + '-' + ((req.body.diaCobranca < 10) ? "0" + req.body.diaCobranca : req.body.diaCobranca)
		await cadastraHistoricoConta(camelize(contaCadastrada))
		
		let resposta = new DataHandler(httpStatus.OK, 'Conta salva com sucesso', camelize(contaCadastrada))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function cadastraHistoricoConta (conta) {
	if (conta.quantidadeParcelas > 0 && !conta.fixa) {
		await cadastraHistoricoContaParcelada(conta)
	} else if (conta.fixa) {
		await cadastraHistoricoContaNaoParcelada(conta)
	}
}

export async function cadastraHistoricoContaParcelada (conta) {
	let valorParcela = conta.valorPagamento/conta.quantidadeParcelas
	let dataVencimento
	let dataAtual = moment().format('YYYY-MM-DD')
	if (conta.dataCobranca < dataAtual) {
		dataVencimento = moment(conta.dataCobranca).add(1, 'M').format('YYYY-MM-DD');
	} else {
		dataVencimento = moment(conta.dataCobranca).format('YYYY-MM-DD');
	}
	let idSituacaoContaPendente = (await buscaSituacaoContaPorNome('PENDENTE')).id

	for (let i = 0; i < conta.quantidadeParcelas; i++) {
		if(i > 0) dataVencimento = moment(dataVencimento).add(1, 'M').format('YYYY-MM-DD');
		let historicoConta = {
			numeroParcela: i+1,
			idConta: conta.id,
			dataVencimento: dataVencimento,
			idSituacao: idSituacaoContaPendente,
			valorPago: valorParcela,
			dataPagamento: null
		}
		await salvarHistoricoConta(historicoConta)
	}
}

export async function cadastraHistoricoContaNaoParcelada (conta) {
	let dataAtual = moment().format('YYYY-MM-DD')
	let dataVencimento
	console.log("DATASSS: " + conta.dataCobranca + " _>> " + dataAtual)
	if (conta.dataCobranca < dataAtual) {
		dataVencimento = moment(conta.dataCobranca).add(1, 'M').format('YYYY-MM-DD');
	} else {
		// dataVencimento = moment().format('YYYY-MM-DD');
		dataVencimento = conta.dataCobranca
	}
	let idSituacaoContaPendente = (await buscaSituacaoContaPorNome('PENDENTE')).id

	let historicoConta = {
		numeroParcela: 0,
		idConta: conta.id,
		dataVencimento: dataVencimento,
		idSituacao: idSituacaoContaPendente,
		valorPago: conta.valorPagamento,
		dataPagamento: null
	}
	await salvarHistoricoConta(historicoConta)
}

export async function listarContaPorMes (req, res, next) {
	try {
		let { idUsuario, dataInicio, dataFim } = req.params
		let contasBuscadas = await buscaContaPorMes(idUsuario, dataInicio, dataFim)
		let valorGasto = await calculaValorGastoPorPeriodo(idUsuario, dataInicio, dataFim)
		let valorPago = await calculaValorPagoPorPeriodo(idUsuario, dataInicio, dataFim)
		if (!valorPago.valor_gasto) valorPago.valor_gasto = 0
		if (!valorGasto.valor_gasto) valorGasto.valor_gasto = 0
		let retorno = {
			contas : camelize(contasBuscadas),
			valorGasto: camelize(valorGasto.valor_gasto),
			valorPago: camelize(valorPago.valor_gasto)
		}
		let resposta = new DataHandler(httpStatus.OK, 'Contas buscadas com sucesso', retorno)
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function cancelaConta (req, res, next) {
	try {
		let { idConta } = req.body
		let contaAtualizada = await efetuaCancelamentoConta(idConta)
		let idSituacaoContaCancelado
		if (!contaAtualizada.ativo) {
			idSituacaoContaCancelado = (await buscaSituacaoContaPorNome('CANCELADO')).id
			await cancelaHistoricoConta(idSituacaoContaCancelado, idConta)
		}
		let resposta = new DataHandler(httpStatus.OK, 'Conta cancelada com sucesso', contaAtualizada)
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function verificaContasUsuario (req, res, next) {
	try {
		await buscaContasQueVaoVencer(5)
		await buscaContasQueVaoVencer(3)
		await buscaContasQueVaoVencer(1)
		await buscaContasVencendo()
		await buscaContasVencidas()
		res.json()
	} catch (error) {
		next(error)
	}
}

export async function buscaContasQueVaoVencer (quantidadeDeDiasAntes) {
	try {
		let diaVencimento = moment().add(quantidadeDeDiasAntes, 'day').format('DD');
		let dataVencimento = moment().add(quantidadeDeDiasAntes, 'day').format('YYYY-MM-DD');
		let listaContas = await listaContaCobranca(diaVencimento, dataVencimento)
		let texto
		for (let i = 0; i < listaContas.length; i++) {
			texto = 'Olá '+listaContas[i].nome+ '! A parcela '+listaContas[i].numero_parcela+' de '+listaContas[i].valor_pago+' R$ da sua conta '+listaContas[i].descricao+' vence em '+quantidadeDeDiasAntes+' dia(s). Não se esqueça de pagar!'
			enviarNotificaçãoUsuario(texto, listaContas[i].device_token)
		}
		return true
	} catch (error) {
		next(error)
	}
}

export async function buscaContasVencendo () {
	try {
		let diaVencimento = moment().format('DD');
		let dataVencimento = moment().format('YYYY-MM-DD');
		let listaContas = await listaContaCobranca(diaVencimento, dataVencimento)
		let texto
		for (let i = 0; i < listaContas.length; i++) {
			texto = 'Olá '+listaContas[i].nome+ '! A parcela '+listaContas[i].numero_parcela+' de '+listaContas[i].valor_pago+' R$ da sua conta '+listaContas[i].descricao+' vence hoje. Não se esqueça de pagar!'
			enviarNotificaçãoUsuario(texto, listaContas[i].device_token)
		}
		return true
	} catch (error) {
		next(error)
	}
}

export async function buscaContasVencidas () {
	try {
		let dataVencimento = moment().format('YYYY-MM-DD');
		let listaContas = await listaContaVencidaCobranca(dataVencimento)
		let texto
		for (let i = 0; i < listaContas.length; i++) {
			listaContas[i].data_vencimento = moment(listaContas[i].data_vencimento).format('DD/MM/YYYY')
			texto = 'Olá '+listaContas[i].nome+ '! A parcela '+listaContas[i].numero_parcela+' de '+listaContas[i].valor_pago+' R$ da sua conta '+listaContas[i].descricao+' venceu em '+listaContas[i].data_vencimento+'. Não se esqueça de pagar!'
			enviarNotificaçãoUsuario(texto, listaContas[i].device_token)
		}
		return true
	} catch (error) {
		next(error)
	}
}

export async function listaRelatorioComFiltro (req, res, next) {
	try {
		let contasBuscadas = await buscaRelatorioComFiltro(req.query)
		let resposta = new DataHandler(httpStatus.OK, 'Relatórios buscados com sucesso', camelize(contasBuscadas))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function enviarNotificaçãoUsuario (texto, deviceToken) {

	let playerId = []
	playerId.push(deviceToken)

	let data = { 
		app_id: "44db8546-7bb7-42aa-8ed2-2a0b713b3756",
		contents: {"en": texto},
		include_player_ids: playerId
	};
	let headers = {
	  "Content-Type": "application/json; charset=utf-8"
	};
	
	let options = {
	  host: "onesignal.com",
	  port: 443,
	  path: "/api/v1/notifications",
	  method: "POST",
	  headers: headers
	};
	
	let https = require('https');
	let req = https.request(options, function(res) {  
	  res.on('data', function(data) {
		console.log("Response:");
		console.log(JSON.parse(data));
	  });
	});
	
	req.on('error', function(e) {
	  console.log("ERROR:");
	  console.log(e);
	});
	
	req.write(JSON.stringify(data));
	req.end();
}

export async function pagarConta (req, res, next) {

	try {
		let params = req.body
		if (params.valorPago === null || params.valorPago === '' || !params.valorPago) { params.valorPago = 0 }
		let confirmaPagamento = await confirmaPagamentoHistoricoConta(params)
		res.json(confirmaPagamento)
	} catch(error) {
		next(error)
	}

}