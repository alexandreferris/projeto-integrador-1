import { buscaTodos } from '../situacao_conta/situacao_conta.dao'
import DataHandler from '../../handlers/data.handler'
import httpStatus from 'http-status'
import camelize from 'camelize'

export async function listaTodos (req, res, next) {
	try {
		let listaSituacoes = await buscaTodos()
		let resposta = new DataHandler(httpStatus.OK, 'Situações buscadas com sucesso', camelize(listaSituacoes))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}
