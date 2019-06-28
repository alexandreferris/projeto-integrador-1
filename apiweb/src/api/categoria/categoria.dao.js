import ErrorHandler from '../../handlers/error.handler'
import db from '../../db/db'
import { PreparedStatement } from 'pg-promise'
import httpStatus from 'http-status'

export async function buscaTodos () {
  try {
    const informacaoCategoria = new PreparedStatement('listar-todas-categorias',
      'SELECT id, descricao FROM categoria'
    )
    const categoriasBuscadas = await db.manyOrNone(informacaoCategoria)
    return categoriasBuscadas
  } catch (error) {
    throw new ErrorHandler('Erro ao buscar as categorias', httpStatus.BAD_REQUEST, true, error.code)
  }
}