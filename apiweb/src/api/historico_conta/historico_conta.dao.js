import ErrorHandler from '../../handlers/error.handler'
import db from '../../db/db'
import { PreparedStatement } from 'pg-promise'
import httpStatus from 'http-status'
import { buscaSituacaoContaPorNome } from '../situacao_conta/situacao_conta.dao'

export async function salvarHistoricoConta (historicoConta) {
	try {
        const informacaoHistoricoConta = new PreparedStatement('salvar-historico-conta',
        `INSERT INTO historico_conta (numero_parcela, criado_em, conta_id, data_vencimento, id_situacao, valor_pago, data_pagamento) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6) RETURNING *`
        )
        informacaoHistoricoConta.values = [historicoConta.numeroParcela, historicoConta.idConta, historicoConta.dataVencimento, historicoConta.idSituacao, historicoConta.valorPago, historicoConta.dataPagamento]
		    const historicoContaSalvo = await db.oneOrNone(informacaoHistoricoConta)
        return historicoContaSalvo
    } catch (error) {
		throw new ErrorHandler('Erro ao salvar o historico da conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function calculaValorGastoPorPeriodo (idUsuario, dataInicio, dataFim) {
	try {
        let idSituacaoContaPendente = (await buscaSituacaoContaPorNome('PENDENTE')).id 
        const informacaoConta = new PreparedStatement('buscar-gastos-contas',
        `
        select SUM(historico_conta.valor_pago) as valor_gasto
        from conta
        inner join historico_conta on historico_conta.conta_id = conta.id
        where conta.id_usuario = $1 AND (historico_conta.data_vencimento BETWEEN $2 AND $3) AND historico_conta.id_situacao = $4
        `
        )
        informacaoConta.values = [idUsuario, dataInicio, dataFim, idSituacaoContaPendente]
		    const contaBuscada = await db.one(informacaoConta)
        return contaBuscada
    } catch (error) {
		throw new ErrorHandler('Erro ao calcular o valor gasto', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function calculaValorPagoPorPeriodo (idUsuario, dataInicio, dataFim) {
	try {
    let idSituacaoContaPaga = (await buscaSituacaoContaPorNome('PAGO')).id 
    const informacaoConta = new PreparedStatement('buscar-gastos-contas',
    `
    select SUM(historico_conta.valor_pago) as valor_gasto
    from conta
    inner join historico_conta on historico_conta.conta_id = conta.id
    where conta.id_usuario = $1 AND (historico_conta.data_vencimento BETWEEN $2 AND $3) AND historico_conta.id_situacao = $4
    `
    )
    informacaoConta.values = [idUsuario, dataInicio, dataFim, idSituacaoContaPaga]
    const contaBuscada = await db.one(informacaoConta)
    return contaBuscada
    } catch (error) {
		throw new ErrorHandler('Erro ao calcular o valor pago', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function cancelaHistoricoConta (idSituacaoContaPendente, idConta) {
	try {
        let idSituacaoContaPaga = (await buscaSituacaoContaPorNome('PAGO')).id 
        const informacaoHistoricoConta = new PreparedStatement('cancelar-historico-conta',
        `UPDATE historico_conta SET id_situacao = $1 
        where id_situacao != $2 and conta_id = $3
        RETURNING *`
        )
        informacaoHistoricoConta.values = [idSituacaoContaPendente, idSituacaoContaPaga, idConta]
        const historicoContaAtualizada = await db.manyOrNone(informacaoHistoricoConta)
        return historicoContaAtualizada
    } catch (error) {
		throw new ErrorHandler('Erro ao cancelar a conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function confirmaPagamentoHistoricoConta (params) {
	try {
        let sql=' '

        if (params.valorVariavel > 0) { sql=', valor_pago = '+params.valorPago+' ' }
        const informacaoHistoricoConta = new PreparedStatement('cancelar-historico-conta',
        `UPDATE historico_conta SET id_situacao = 1 `+sql+`
        where id = $1
        RETURNING *`
        )
        informacaoHistoricoConta.values = [params.idHistoricoConta]
        const historicoContaAtualizada = await db.oneOrNone(informacaoHistoricoConta)
        return historicoContaAtualizada
    } catch (error) {
		throw new ErrorHandler('Erro ao atualizar a parcela', httpStatus.BAD_REQUEST, true, error.code)
	}
}