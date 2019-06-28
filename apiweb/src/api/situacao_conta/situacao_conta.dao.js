import ErrorHandler from '../../handlers/error.handler'
import db from '../../db/db'
import { PreparedStatement } from 'pg-promise'
import httpStatus from 'http-status'

export async function buscaSituacaoContaPorNome (descricao) {
	try {
      const informacaoSituacaoConta = new PreparedStatement('buscar-situacao-contas',
      `
      select id from situacao_conta
      where descricao = $1
      `
      )
      informacaoSituacaoConta.values = [descricao]
      const situacaoBuscada = await db.oneOrNone(informacaoSituacaoConta)
      return situacaoBuscada
    } catch (error) {
		throw new ErrorHandler('Erro ao buscar a situação da conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function buscaTodos () {
	try {
      const buscarSituacoes = new PreparedStatement('buscar-situacao-contas-todas', `select id, descricao from situacao_conta`)
      const situacoesBuscadas = await db.manyOrNone(buscarSituacoes)
      return situacoesBuscadas
    } catch (error) {
		throw new ErrorHandler('Erro ao buscar as situações.', httpStatus.BAD_REQUEST, true, error.code)
	}
}