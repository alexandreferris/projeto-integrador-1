import ErrorHandler from '../../handlers/error.handler'
import db from '../../db/db'
import { PreparedStatement } from 'pg-promise'
import httpStatus from 'http-status'

export async function salvarConta (conta) {
	try {
        if (conta.valorPagamento === "") conta.valorPagamento = 0.0
        const informacaoConta = new PreparedStatement('salvar-conta',
        `INSERT INTO conta (descricao, valor_pagamento, fixa, quantidade_parcelas, id_usuario, dia_cobranca, id_categoria, valor_variavel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
        )
        informacaoConta.values = [conta.descricao, conta.valorPagamento, conta.fixa, conta.quantidadeParcelas, conta.idUsuario, conta.diaCobranca, conta.idCategoria, conta.valorVariavel]
		    const contaSalva = await db.oneOrNone(informacaoConta)
        return contaSalva
    } catch (error) {
		throw new ErrorHandler('Erro ao salvar a conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function buscaContaPorMes (idUsuario, dataInicio, dataFim) {
	try {
        const informacaoConta = new PreparedStatement('buscar-contas',
        `
        select 
        conta.descricao as descricao_conta,conta.quantidade_parcelas, conta.id as id_conta, conta.valor_variavel,
        historico_conta.numero_parcela,historico_conta.data_vencimento, historico_conta.valor_pago, historico_conta.id as id_historico_conta,
        categoria.descricao as descricao_categoria,
        situacao_conta.descricao as descricao_situacao_conta
        from conta
        inner join historico_conta on historico_conta.conta_id = conta.id
        inner join categoria on categoria.id = conta.id_categoria
        inner join situacao_conta on situacao_conta.id = historico_conta.id_situacao
        where conta.id_usuario = $1 AND (historico_conta.data_vencimento BETWEEN $2 AND $3) AND (historico_conta.id_situacao <> 2)
        `
        )
        informacaoConta.values = [idUsuario, dataInicio, dataFim]
		    const contaBuscada = await db.manyOrNone(informacaoConta)
        return contaBuscada
    } catch (error) {
		throw new ErrorHandler('Erro ao buscar a conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function efetuaCancelamentoConta (idConta) {
	try {
        const informacaoConta = new PreparedStatement('cancelar-conta',
        `UPDATE conta SET ativo = false WHERE id = $1 RETURNING *`
        )
        informacaoConta.values = [idConta]
        const contaAtualizada = await db.oneOrNone(informacaoConta)
        return contaAtualizada
    } catch (error) {
		throw new ErrorHandler('Erro ao cancelar a conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function listaContaCobranca (diaVencimento, dataVencimento) {
	try {
        const informacaoConta = new PreparedStatement('buscar-contas-cobranca',
        `
        select conta.descricao, historico_conta.numero_parcela, historico_conta.valor_pago, usuario.nome, usuario.device_token, historico_conta.data_vencimento from conta 
        inner join historico_conta on historico_conta.conta_id = conta.id
        inner join usuario on usuario.id = conta.id_usuario
        where 
        conta.dia_cobranca = $1 and conta.ativo = true 
        and historico_conta.data_vencimento = $2 and historico_conta.id_situacao = 3
        and usuario.ativo = true
        `
        )
        informacaoConta.values = [diaVencimento, dataVencimento]
		    const listaContas = await db.manyOrNone(informacaoConta)
        return listaContas
    } catch (error) {
		throw new ErrorHandler('Erro ao buscar a conta', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function listaContaVencidaCobranca (dataVencimento) {
	try {
        const informacaoConta = new PreparedStatement('buscar-contas-vencidas-cobranca',
        `
        select  historico_conta.data_pagamento, conta.descricao, historico_conta.numero_parcela, historico_conta.valor_pago, usuario.nome, usuario.device_token, historico_conta.data_vencimento from conta 
        inner join historico_conta on historico_conta.conta_id = conta.id
        inner join usuario on usuario.id = conta.id_usuario
        where 
        conta.ativo = true 
        and historico_conta.data_vencimento < $1 and historico_conta.id_situacao = 3 and historico_conta.data_pagamento is null
        and usuario.ativo = true
        `
        )
        informacaoConta.values = [dataVencimento]
		    const listaContas = await db.manyOrNone(informacaoConta)
        return listaContas
    } catch (error) {
		throw new ErrorHandler('Erro ao buscar a conta', httpStatus.BAD_REQUEST, true, error.code)
	  }
}

export async function buscaRelatorioComFiltro (params) {
  try {
    let query = 
    `
    select situacao_conta.descricao as situacao_descricao, conta.descricao, historico_conta.numero_parcela, historico_conta.valor_pago, usuario.nome, usuario.device_token, historico_conta.data_vencimento, conta.id from conta 
    inner join historico_conta on historico_conta.conta_id = conta.id
    inner join usuario on usuario.id = conta.id_usuario
    inner join situacao_conta on situacao_conta.id = historico_conta.id_situacao
    where conta.id_usuario = `+params.idUsuario

    if (params.dataInicio && params.dataFim) {
      query+= ` AND (historico_conta.data_vencimento BETWEEN '`+params.dataInicio+`' AND '`+params.dataFim+`')`
    }
    if (params.idSituacao) {
      query+= ` AND (historico_conta.id_situacao = `+params.idSituacao+`)`
    }
    query+= ` ORDER BY conta.id, historico_conta.numero_parcela ASC`
    const listaContas = await db.manyOrNone(query)
    return listaContas
  } catch (error) {
	  throw new ErrorHandler('Erro ao buscar os relatórios', httpStatus.BAD_REQUEST, true, error.code)
	}
}