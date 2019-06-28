import db from '../../db/db'
import { BUSCA_INFORMACOES_ESTABELECIMENTO_POR_ID, UPDATE_PERFIL_CADASTRADO_ACESSO, INSERT_LOG_ERRO_RETORNO_ACESSO, BUSCA_DADOS_SOLICITAR_CARTAO_IDENTIFICADO_DO_ESTABELECIMENTO_POR_ID, BUSCA_TAXA_CARTAO_SOLICITADO, BUSCA_ACESSO_CADASTRO_PERFIL } from './acesso.queries'
import { PreparedStatement } from 'pg-promise'
import camelize from 'camelize'

/**
 * @param {uuid} idEstabelecimento
 * @param {db} transaction
 * @returns {json} Estabelecimento
 */
export async function buscarInformacoesEstabelecimentoPorId (idEstabelecimento, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('busca-informacoes-estabelecimento-por-id', BUSCA_INFORMACOES_ESTABELECIMENTO_POR_ID, [idEstabelecimento])
		const resultado = await transaction.one(query)
		return camelize(resultado.retorno)
	} catch (exception) {
		throw new Error(`Erro ao tentar buscar o estabelecimento por ID. Detalhe(s): ${exception.message}`)
	}
}

/**
 * @param {uuid} idEstabelecimento
 * @param {db} transaction
 * @returns {json} Estabelecimento (CPF / Tipo)
 */
export async function buscarDadosCPFeTipoDoEstabelecimentoPorId (idEstabelecimento, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('buscar-dados-cpf-e-tipo-do-estabelecimento-por-id', BUSCA_DADOS_SOLICITAR_CARTAO_IDENTIFICADO_DO_ESTABELECIMENTO_POR_ID, [idEstabelecimento])
		const resultado = await transaction.one(query)
		return camelize(resultado)
	} catch (exception) {
		throw new Error(`Erro ao tentar buscar os dados do estabelecimento por ID. Detalhe(s): ${exception.message}`)
	}
}

/**
 * @param {uuid} idEstabelecimento
 * @param {db} transaction
 */
export async function atualizaPerfilUsuarioCadastradoAcesso (idEstabelecimento, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('update-perfil-cadastrado-acesso', UPDATE_PERFIL_CADASTRADO_ACESSO, [idEstabelecimento])
		await transaction.query(query)
	} catch (exception) {
		throw new Error(`Erro ao tentar atualizar o perfil cadastrado acesso. Detalhe(s): ${exception.message}`)
	}
}

/**
 * @param {uuid} idEstabelecimento
 * @param {json} resultadoInserirCliente
 * @param {string} tipoErroLog
 * @param {db} transaction
 */
export async function insereLogErroRetornoAcesso (idEstabelecimento, resultadoInserirCliente, tipoErroLog, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('insert-log-erro-retorno-acesso', INSERT_LOG_ERRO_RETORNO_ACESSO, [idEstabelecimento, resultadoInserirCliente.ResultCode, resultadoInserirCliente, tipoErroLog])
		await transaction.query(query)
	} catch (exception) {
		throw new Error(`Erro ao tentar inserir os registros de log de erro do retorno da acesso. Detalhe(s) ${exception.message}`)
	}
}

async function validaTransaction (transaction = null) {
	if (transaction === null || transaction === undefined || transaction === false) {
		transaction = Object.assign(db)
	}
	return transaction
}

/**
 * @description
 * Chama a funcão no banco que verifica que tipo de taxa será cobrada ao estabelecimento para a emissão do cartão
 * A conta com saldo maior ou igual a R$ 100,00 ou já movimentou mais que R$ 100,00 - retorna ISENTO
 * A conta movimentou menos de R$ 100,00, mas possui saldo maior ou igual que R$ 19,90 - retorna TAXA_SOLICITACAO
 * Não movimentou mais que R$ 100,00 e não tem saldo disponível maior ou igual a R$ 19,90 - retorna RECARGA
 * @param {uuid} idEstabelecimento
 * @param {db} transaction
 * @returns {ErrorHandler/json}
 */
export async function buscarTaxaCartaoSolicitacao (idEstabelecimento, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('funcao-retorna-tipo-taxa-cartao', BUSCA_TAXA_CARTAO_SOLICITADO, [idEstabelecimento])
		const respostaTipoDeTaxa = await transaction.one(query)
		return camelize(respostaTipoDeTaxa)
	} catch (exception) {
		throw new Error(`Erro ao buscar a taxa de solicitação do cartão.`)
	}
}
/**
 * @description
 * Faz a consulta para retornar o campo acesso_cadastro, que registra se o estabelecimento vinculado ao perfil esta cadastrado na acesso
 * @param {uuid} idPerfil
 * @param {db} transaction
 * @returns {ErrorHandler/json}
 */
export async function buscaAcessoCadastroPerfil (idPerfil, transaction = null) {
	try {
		transaction = await validaTransaction(transaction)
		const query = new PreparedStatement('funcao-retorna-acesso-cadastro-perfil', BUSCA_ACESSO_CADASTRO_PERFIL, [idPerfil])
		const respostaAcessoCadastro = await transaction.one(query)
		return camelize(respostaAcessoCadastro)
	} catch (exception) {
		throw new Error(`Erro ao verificar se estabelecimento contém cadastro na acesso.`)
	}
}
