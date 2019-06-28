import httpStatus from 'http-status'
import ErrorHandler from '../../../handlers/error.handler'
import { buscarTokenAdesaoCliente } from './tokenService'
import { buscarDadosCPFeTipoDoEstabelecimentoPorId, insereLogErroRetornoAcesso, buscarTaxaCartaoSolicitacao } from '../acesso.repository'
import { requisicaoSolicitarCartaoIdentificado } from '../acesso.rest'
import { criaRespostaSolicitarCartaoIdentificadoDeAcordoComCodigoDeResultado, validarCampo, validaDadosCPFeTipoEstabelecimento } from '../acesso.validation'
import {
	ADESAO_REC_ID,
	ADESAO_LINGUAGEM,
	SOLICITAR_CARTAO_IDENTIFICADO_RESPOSTA_SUCESSO,
	ADESAO_CODIGO_ESPECIE_PRODUTO,
	ADESAO_NOME_CANAL,
	ADESAO_TIPO_ENTREGA_CARTAO_IDENTIFICADO,
	ADESAO_VALOR_CARGA,
	ESTABELECIMENTO_PESSOA_FISICA,
	ADESAO_TIPO_CLIENTE_PESSOA_FISICA,
	ADESAO_TIPO_CLIENTE_PESSOA_JURIDICA,
	TIPO_ERRO_LOG_SOLICITAR_CARTAO_IDENTIFICADO
} from '../acesso.constants'
import { logInfo, logError } from '../acesso.logs'

export async function solicitacaoDeCartaoIdentificado (idEstabelecimento) {
	logInfo('Entering solicitarCartaoIdentificado()', idEstabelecimento)
	let response
	try {
		const responseSolicitacaoCartaoIdentificado = await solicitacaoCartaoIdentificado(idEstabelecimento)

		// Cria a Resposta de Retorno
		response = await criaRespostaSolicitarCartaoIdentificadoDeAcordoComCodigoDeResultado(responseSolicitacaoCartaoIdentificado)

		// Salva os dados na tabela de logs
		if (await validarCampo(responseSolicitacaoCartaoIdentificado) && responseSolicitacaoCartaoIdentificado.ResultCode !== SOLICITAR_CARTAO_IDENTIFICADO_RESPOSTA_SUCESSO) {
			// Insere um novo registro na tabela de Logs de retornos da Acesso
			await insereLogErroRetornoAcesso(idEstabelecimento, responseSolicitacaoCartaoIdentificado, TIPO_ERRO_LOG_SOLICITAR_CARTAO_IDENTIFICADO)
		}
	} catch (exception) {
		const msg = exception.message
		logError('Error solicitarCartaoIdentificado()', msg)
		throw new Error(msg)
	}

	return response
}

export async function solicitacaoCartaoIdentificado (idEstabelecimento) {
	logInfo('Entering solicitacaoCartaoIdentificado()', idEstabelecimento)
	try {
		// Retorna o Token de Adesao
		const tokenAdesao = await buscarTokenAdesaoCliente(idEstabelecimento)

		// Cria payload para envio a API da Acesso
		const payloadSolicitarCartaoIdentificado = await criarPayloadSolicitacaoCartaoIdentificado(tokenAdesao, idEstabelecimento)

		// Realiza o envio do payload para o serviço da API da Acesso
		const responseSolicitarCartaoIdentificado = await requisicaoSolicitarCartaoIdentificado(payloadSolicitarCartaoIdentificado)

		logInfo('Returning solicitacaoCartaoIdentificado()', responseSolicitarCartaoIdentificado)
		return responseSolicitarCartaoIdentificado
	} catch (exception) {
		const msg = exception.message
		logError('Error solicitacaoCartaoIdentificado()', msg)
		throw new Error(msg)
	}
}

export async function criarPayloadSolicitacaoCartaoIdentificado (tokenAdesao, idEstabelecimento) {
	logInfo('Entering criarPayloadSolicitacaoCartaoIdentificado()', idEstabelecimento)
	let estabelecimento
	try {
		// Realiza busca dos dados do estabelecimento
		estabelecimento = await buscarDadosCPFeTipoDoEstabelecimentoPorId(idEstabelecimento)

		// Realiza a validação dos campos necessários
		await validaDadosCPFeTipoEstabelecimento(estabelecimento)
	} catch (exception) {
		let msg = exception.message

		logError('Error criarPayloadSolicitacaoCartaoIdentificado()', msg)
		throw new Error(msg)
	}

	// Monta os parâmetros para envio
	let payload = {
		Browser: null,
		Capabilities: null,
		CodOrigem: null,
		CodTerminal: null,
		Data: {
			CodCliente: estabelecimento.cpf,
			CodEspecieProduto: ADESAO_CODIGO_ESPECIE_PRODUTO,
			TokenAdesao: tokenAdesao,
			TpCliente: (estabelecimento.tipo === ESTABELECIMENTO_PESSOA_FISICA) ? ADESAO_TIPO_CLIENTE_PESSOA_FISICA : ADESAO_TIPO_CLIENTE_PESSOA_JURIDICA,
			TpEntrega: ADESAO_TIPO_ENTREGA_CARTAO_IDENTIFICADO,
			ValorCarga: ADESAO_VALOR_CARGA
		},
		IpCliente: null,
		Language: ADESAO_LINGUAGEM,
		NomeCanal: ADESAO_NOME_CANAL,
		RecId: ADESAO_REC_ID
	}

	logInfo('Returning criarPayloadSolicitacaoCartaoIdentificado()', payload)
	return payload
}
/**
 * @description Valida o id do estabelecimento e faz a consulta no banco de qual taxa que será paga 
 * @param {*} idEstabelecimento
 * @returns {ErrorHandler/json}
 */
export async function verificacaoTaxaCartaoSolicitacao (idEstabelecimento) {
	logInfo('Entering verificaTaxaCartaoSolicitacao()', idEstabelecimento)
	if (!await validarCampo(idEstabelecimento)) throw new Error(`Estabelecimento inválido`)
	let response
	try {
		response = await buscarTaxaCartaoSolicitacao(idEstabelecimento)
		if (!await validarCampo(response)) throw new Error(`Erro ao buscar a taxa de solicitação do cartão.`)
	} catch (exception) {
		logError('Error verificaTaxaCartaoSolicitacao()', exception.message)
		throw new ErrorHandler(exception.message, httpStatus.BAD_REQUEST, true, exception.code)
	}
	return response
}
