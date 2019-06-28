import httpStatus from 'http-status'
import { adesaoCliente } from './adesaoClienteService'
import { insereLogErroRetornoAcesso } from '../acesso.repository'
import ErrorHandler from '../../../handlers/error.handler'
import {
	ADESAO_RESPOSTA_SUCESSO_EXISTENTE
} from '../acesso.constants'
import { logInfo, logError } from '../acesso.logs'
import { validarCampo } from '../acesso.validation'

/**
 * @description Realiza a busca do Token de Adesão do Cliente
 * @param {uuid} idEstabelecimento
 * @returns {string} Token de Adesão do Cliente
 */
export async function buscarTokenAdesaoCliente (idEstabelecimento) {
	logInfo('Entering buscarTokenAdesaoCliente()', idEstabelecimento)
	let token
	try {
		const responseAdesaoCliente = await adesaoCliente(idEstabelecimento)

		// Salva os dados na tabela de logs
		if (await validarCampo(responseAdesaoCliente) && responseAdesaoCliente.ResultCode === ADESAO_RESPOSTA_SUCESSO_EXISTENTE) {
			token = responseAdesaoCliente.Data
		} else {
			// Insere um novo registro na tabela de Logs de retornos da Acesso
			await insereLogErroRetornoAcesso(idEstabelecimento, responseAdesaoCliente)
			throw new Error('Não foi possível retornar o Token de Adesão.')
		}
	} catch (exception) {
		let msg = exception.message

		logError('Error buscarTokenAdesaoCliente()', msg)
		throw new ErrorHandler(msg, httpStatus.BAD_REQUEST, true, exception.code)
	}

	logInfo('Returning buscarTokenAdesaoCliente()', token)
	return token
}
