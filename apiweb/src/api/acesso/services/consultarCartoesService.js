import { buscarTokenAdesaoCliente } from './tokenService'
import { buscarDadosCPFeTipoDoEstabelecimentoPorId, insereLogErroRetornoAcesso, buscaAcessoCadastroPerfil } from '../acesso.repository'
import { requisicaoConsultaDosCartoes } from '../acesso.rest'
import { criaResponseConsultarCartoesComCodigoDeResultado, validarCampo, validaDadosCPFeTipoEstabelecimento } from '../acesso.validation'
import {
	ADESAO_REC_ID,
	ADESAO_NOME_CANAL,
	ADESAO_LINGUAGEM,
	ESTABELECIMENTO_PESSOA_FISICA,
	ADESAO_TIPO_CLIENTE_PESSOA_FISICA,
	ADESAO_TIPO_CLIENTE_PESSOA_JURIDICA,
	ID_EMPRESA_PARCEIRO,
	CONSULTA_CARTOES_SUCESSO,
	TIPO_ERRO_LOG_CONSULTAR_CARTOES,
	NUMERO_MINIMO_DE_CARTOES
} from '../acesso.constants'
import { logInfo, logError } from '../acesso.logs'
import httpStatus from 'http-status'
import ErrorHandler from '../../../handlers/error.handler'
/**
 * @description Realiza a consulta dos cartões na Acesso, trata o retorno da Acesso e caso necessário salva o status de erro da Acesso no banco de dados
 * @param {*} idEstabelecimento
 * @returns {ErrorHandler/DataHandler}
 */
export async function consultaDeCartoes (idEstabelecimento) {
	logInfo('Entering consultaCartoes()', idEstabelecimento)
	let response
	try {
		const responseConsultarCartoes = await buscaListaDeCartoesPorEstabelecimento(idEstabelecimento)

		// Cria a resposta de Retorno
		response = await criaResponseConsultarCartoesComCodigoDeResultado(responseConsultarCartoes)

		if (await validarCampo(responseConsultarCartoes) && responseConsultarCartoes.ResultCode !== CONSULTA_CARTOES_SUCESSO) {
			// Insere um novo registro na tabela de Logs de retornos da Acesso
			await insereLogErroRetornoAcesso(idEstabelecimento, responseConsultarCartoes, TIPO_ERRO_LOG_CONSULTAR_CARTOES)
		}
	} catch (exception) {
		const msg = exception.message
		logError('Error consultaCartoes()', msg)
		throw new ErrorHandler(msg, httpStatus.BAD_REQUEST, true, exception.code)
	}

	return response
}

/**
 * @description Realiza a busca do Token de Adesao do Cliente, monta o payload e envia os dados para a API da Acesso
 * @param {*} idEstabelecimento
 * @returns response de status e cartões da acesso
 */
async function buscaListaDeCartoesPorEstabelecimento (idEstabelecimento) {
	logInfo('Entering buscaListaDeCartoesPorEstabelecimento()', idEstabelecimento)
	try {
		// Retorna o Token de Adesao
		const tokenAdesao = await buscarTokenAdesaoCliente(idEstabelecimento)

		// Cria payload para envio a API da Acesso
		const payloadConsultarCartoes = await criarPayloadConsultarCartoes(tokenAdesao, idEstabelecimento)

		// Realiza o envio do payload para o serviço da API da Acesso
		const responseConsultarCartoes = await requisicaoConsultaDosCartoes(payloadConsultarCartoes)

		logInfo('Returning buscaListaDeCartoesPorEstabelecimento()', responseConsultarCartoes)
		return responseConsultarCartoes
	} catch (exception) {
		const msg = exception.message
		logError('Error buscaListaDeCartoesPorEstabelecimento()', msg)
		throw new Error(msg)
	}
}

/**
 * @description Realiza a busca dos dados necessários do estabelecimento para criar o payload
 * @param {string} tokenAdesao
 * @param {uuid} idEstabelecimento
 * @returns payload
 */
async function criarPayloadConsultarCartoes (tokenAdesao, idEstabelecimento) {
	logInfo('Entering criarPayloadConsultarCartoes()', idEstabelecimento)
	let estabelecimento
	try {
		// Realiza busca dos dados do estabelecimento
		estabelecimento = await buscarDadosCPFeTipoDoEstabelecimentoPorId(idEstabelecimento)

		// Realiza a validação dos campos necessários
		await validaDadosCPFeTipoEstabelecimento(estabelecimento)
	} catch (exception) {
		let msg = exception.message

		logError('Error criarPayloadConsultarCartoes()', msg)
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
			IdEmpresaParceiro: ID_EMPRESA_PARCEIRO,
			TokenAdesao: tokenAdesao,
			TpCliente: (estabelecimento.tipo === ESTABELECIMENTO_PESSOA_FISICA) ? ADESAO_TIPO_CLIENTE_PESSOA_FISICA : ADESAO_TIPO_CLIENTE_PESSOA_JURIDICA
		},
		IpCliente: null,
		Language: ADESAO_LINGUAGEM,
		NomeCanal: ADESAO_NOME_CANAL,
		RecId: ADESAO_REC_ID
	}

	logInfo('Returning criarPayloadConsultarCartoes()', payload)
	return payload
}
/**
 * @description Verifica se o perfil tem cadastro na Acesso e baseado na resposta retorna um caminho a ser seguido
 * Tendo cadastro e tendo cartões - retorna CONSULTAR
 * Tendo cadastro mas nao tendo cartões ainda - retorna SOLICITAR
 * Não tendo cadastro na ACESSO - retorna TERMO
 * @param {*} idPerfil
 * @param {*} idEstabelecimento
 * @returns {ErrorHandler/String}
 */
export async function verificarSePerfilPossuiCadastroAcesso (idPerfil, idEstabelecimento) {
	logInfo('Entering verificarSePerfilPossuiCadastroAcesso()', idPerfil + ',' + idEstabelecimento)
	if (!await validarCampo(idPerfil)) throw new Error(`Perfil inválido`)
	if (!await validarCampo(idEstabelecimento)) throw new Error(`Estabelecimento inválido`)
	let cartoesConsultados
	try {
		let acessoCadastro = await buscaAcessoCadastroPerfil(idPerfil)
		if (await validarCampo(acessoCadastro) && await validarCampo(acessoCadastro.acessoCadastro) && acessoCadastro.acessoCadastro === 'SIM') {
			cartoesConsultados = await consultaDeCartoes(idEstabelecimento)
			if (cartoesConsultados.conteudo.cartoes.length >= NUMERO_MINIMO_DE_CARTOES) {
				return 'CONSULTAR'
			}
			return 'SOLICITAR'
		}
		return 'TERMO'
	} catch (exception) {
		logError('Error verificarSePerfilPossuiCadastroAcesso()', exception.message)
		throw new ErrorHandler(exception.message, httpStatus.BAD_REQUEST, true, exception.code)
	}
}
