import { InternetBankingRestServices, AcessoCartoesRestServices } from '../microservices/microservices'

/**
 * @description Realiza o aceite do termo no Microservice
 * @param {json} dadosTermo
 * @returns {json} status do aceite
 */
export async function aceitaTermoObrigatorio (dadosTermo) {
	try {
		return await InternetBankingRestServices.post('termos/aceitar', dadosTermo)
	} catch (exception) {
		let msg = exception.message
		if (exception.response) msg = exception.response.data.mensagem
		else if (exception.request) msg = 'Não foi possível obter uma resposta ao tentar realizar o aceite do termo. Por favor, tente novamente.'

		throw new Error(msg)
	}
}

/**
 * @description Realiza a inserção do cliente na acesso
 * @param {json} payloadInserirCliente
 * @returns {json} status de adesão cliente
 */
export async function requisicaoAdesaoInserirCliente (payloadInserirCliente) {
	let retorno
	try {
		retorno = await AcessoCartoesRestServices.post('aquisicao/solicitar/adesao', payloadInserirCliente)
	} catch (exception) {
		let msg = exception.message
		if (exception.response) msg = exception.response.data.mensagem
		else if (exception.request) msg = 'Não foi possível obter uma resposta ao tentar realizar a adesão do cliente. Por favor, tente novamente.'

		throw new Error(msg)
	}

	if (!retorno || !retorno.data) throw new Error('Não foi possível processar o retorno da inserção do cliente. Por favor, tente novamente.')
	return retorno.data
}

/**
 * @description Realiza a solicitação para um novo cartão identificado na acesso
 * @param {json} payloadSolicitarCartaoIdentificado
 * @returns {json} status da solicitação do cartão identificado
 */
export async function requisicaoSolicitarCartaoIdentificado (payloadSolicitarCartaoIdentificado) {
	let retorno
	try {
		retorno = await AcessoCartoesRestServices.post('aquisicao/solicitar/cartao-identificado', payloadSolicitarCartaoIdentificado)
	} catch (exception) {
		let msg = exception.message
		if (exception.response) msg = exception.response.data.mensagem
		else if (exception.request) msg = 'Não foi possível obter uma resposta ao tentar realizar a solicitação do cartão identificado. Por favor, tente novamente.'

		throw new Error(msg)
	}

	if (!retorno || !retorno.data) throw new Error('Não foi possível processar o retorno da solicitação do cartão identificado. Por favor, tente novamente.')
	return retorno.data
}

/**
 * @description Retorna os cartões do usuário na acesso
 * @param {json} payloadConsultaDosCartoes
 * @returns {json} status da consulta dos cartões
 */
export async function requisicaoConsultaDosCartoes (payloadConsultaDosCartoes) {
	let retorno
	try {
		retorno = await AcessoCartoesRestServices.post('portador/consultar/cartoes', payloadConsultaDosCartoes)
	} catch (exception) {
		let msg = exception.message
		if (exception.response) msg = exception.response.data.mensagem
		else if (exception.request) msg = 'Não foi possível obter uma resposta ao tentar realizar a consulta dos cartões. Por favor, tente novamente.'

		throw new Error(msg)
	}

	if (!retorno || !retorno.data) throw new Error('Não foi possível processar o retorno da consulta dos cartões. Por favor, tente novamente.')
	return retorno.data
}
