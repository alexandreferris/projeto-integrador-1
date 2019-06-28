import httpStatus from 'http-status'
import { aceitarTermoObrigatorio, insercaoDeCliente } from './services/adesaoClienteService'
import { solicitacaoDeCartaoIdentificado, verificacaoTaxaCartaoSolicitacao } from './services/solicitacaoDeCartaoIdentificadoService'
import { consultaDeCartoes, verificarSePerfilPossuiCadastroAcesso } from './services/consultarCartoesService'
import DataHandler from '../../handlers/data.handler'

/**
 * @description Realiza o aceite do termo de uso da Acesso e a inserção do novo Cliente na Acesso
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {post} req.body
 * @returns {ErrorHandler/DataHandler}
 */
export async function inserirCliente (req, res, next) {
	try {
		const { idEstabelecimento, idTermo, tempo, longitude, latitude } = req.body

		// Realiza o aceite do termo de uso da Acesso
		let parametrosTermo = {
			idEstabelecimento,
			idTermo,
			tempo,
			longitude,
			latitude
		}

		await aceitarTermoObrigatorio(parametrosTermo)

		// Realiza a adesão do cliente
		let retorno = await insercaoDeCliente(idEstabelecimento)

		res.json(retorno)
	} catch (exception) {
		next(exception)
	}
}

/**
 * @description Realiza a solicitação de um novo cartão identificado para o Cliente na Acesso
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {post} req.body
 * @returns {ErrorHandler/DataHandler}
 */
export async function solicitarCartaoIdentificado (req, res, next) {
	try {
		const { idEstabelecimento } = req.body

		// Realiza a Solicitação de Cartão Identificado
		let retorno = await solicitacaoDeCartaoIdentificado(idEstabelecimento)

		res.json(retorno)
	} catch (exception) {
		next(exception)
	}
}

/**
 * @description Realiza a consulta dos cartões do Cliente na Acesso
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {get} req.params
 * @returns {ErrorHandler/DataHandler}
 */
export async function consultarCartoes (req, res, next) {
	try {
		const { idEstabelecimento } = req.params

		// Realiza a Consulta dos Cartões
		let retorno = await consultaDeCartoes(idEstabelecimento)

		res.json(retorno)
	} catch (exception) {
		next(exception)
	}
}

/**
 * @description Consulta se esse cliente tem movimentação ou saldo na conta, para saber se sera cobrada taxa para a solicitacao do cartão 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {get} req.params
 * @returns {ErrorHandler/DataHandler}
 */
export async function verificarSituacaoTaxaCartaoSolicitado (req, res, next) {
	try {
		const { idEstabelecimento } = req.params
		let respostaTipoDeTaxa = await verificacaoTaxaCartaoSolicitacao(idEstabelecimento)
		let retorno = new DataHandler(httpStatus.OK, 'Tipo de Taxa buscada com sucesso.', respostaTipoDeTaxa)
		res.json(retorno)
	} catch (exception) {
		next(exception)
	}
}
/**
 * @description Consulta a situacão do estabelecimento referente a Acesso para saber que fluxo seguir
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {get} req.params
 * @returns {ErrorHandler/DataHandler}
 */
export async function verificarFluxoMeusCartoes (req, res, next) {
	try {
		const { idEstabelecimento, idPerfil } = req.params
		let fluxoStatus = await verificarSePerfilPossuiCadastroAcesso(idPerfil, idEstabelecimento)
		let retorno = new DataHandler(httpStatus.OK, 'Fluxo de Meus Cartões retornado com sucesso.', { fluxo: fluxoStatus })
		res.json(retorno)
	} catch (exception) {
		next(exception)
	}
}
