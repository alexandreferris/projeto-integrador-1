import { buscaTodos } from '../categoria/categoria.dao'
import DataHandler from '../../handlers/data.handler'
import httpStatus from 'http-status'
import camelize from 'camelize'

export async function listaTodos (req, res, next) {
	try {
		let listaCategorias = await buscaTodos()
		let resposta = new DataHandler(httpStatus.OK, 'Categorias buscadas com sucesso', camelize(listaCategorias))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}
