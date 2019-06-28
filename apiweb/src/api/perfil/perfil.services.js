/*
import dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import db from '../../db/db'
import { AUTH_LOGIN, UPDATE_PERFIL_SENHA, UPDATE_PERFIL_HASH, SELECT_PERFIL_HASH, SELECT_ESTABELECIMENTO_FISICA, SELECT_ESTABELECIMENTO_JURIDICA, UPDATE_PERFIL, SELECT_PERFIL_ID, UPDATE_PERFIL_STATUS, UPDATE_PERFIL_APARELHO, UPDATE_PERFIL_APARELHO_DESVINCULA, AUTH_VALIDACAO_PERFIL } from './perfil.queries'
import { PreparedStatement } from 'pg-promise'
import listaErros from '../../erros/lista.erros'
import ErrorHandler from '../../handlers/error.handler'
import camelize from 'camelize'
import DataHandler from '../../handlers/data.handler'
import httpStatus from 'http-status'

if (process.env.NODE_ENV === 'development') dotenv.config()

const SECRET = process.env.PARCIOM_JWT_SECRET || 'secret'

export function auth () {
	return {
		login: async (codigo, senha) => {
			try {
				const pstm = new PreparedStatement('auth-login', AUTH_LOGIN, [codigo, senha])
				const perfil = await db.one(pstm)
				return camelize(perfil)
			} catch (error) {
				throw new ErrorHandler(listaErros.PERFIL_INEXISTENTE.mensagem, listaErros.PERFIL_INEXISTENTE.httpStatus, { tituloErro: listaErros.PERFIL_INEXISTENTE.titulo }, listaErros.PERFIL_INEXISTENTE.codigo)
			}
		},
		validacao: async (codigo, senha, tx = null) => {
			try {
				tx = await validaTX(tx)
				const pstm = new PreparedStatement('auth-validacao', AUTH_LOGIN, [codigo, senha])
				const perfil = await tx.one(pstm)
				return camelize(perfil)
			} catch (error) {
				throw new ErrorHandler(listaErros.SENHA_INCORRETA.mensagem, listaErros.SENHA_INCORRETA.httpStatus, { tituloErro: listaErros.SENHA_INCORRETA.titulo }, listaErros.SENHA_INCORRETA.codigo)
			}
		},
		validacaoPerfil: async (codigo, senha, tx = null) => {
			try {
				tx = await validaTX(tx)
				const pstm = new PreparedStatement('auth-validacao-perfil', AUTH_VALIDACAO_PERFIL, [codigo, senha])
				const perfil = await tx.one(pstm)
				return camelize(perfil)
			} catch (error) {
				throw new ErrorHandler(listaErros.SENHA_INCORRETA.mensagem, listaErros.SENHA_INCORRETA.httpStatus, { tituloErro: listaErros.SENHA_INCORRETA.titulo }, listaErros.SENHA_INCORRETA.codigo)
			}
		}
	}
}
export async function geraToken (perfil) {
	perfil = camelize(perfil)
	const token = jwt.sign({ token: perfil }, SECRET, { expiresIn: '365d' })
	return { token }
}
export async function atualizaSenha (perfil) {
	try {
		const informacaoPerfil = new PreparedStatement('update-perfil-senha', UPDATE_PERFIL_SENHA)
		informacaoPerfil.values = [perfil.senha, perfil.hash, perfil.idPerfil]
		const perfilAtualizado = await db.oneOrNone(informacaoPerfil)
		return new DataHandler(httpStatus.CREATED, 'Senha atualizada com sucesso', camelize(perfilAtualizado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao atualizar a senha. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function desvinculaAparelho (idPerfil) {
	try {
		console.log('--- service 1.0 ---')
		const informacaoPerfil = new PreparedStatement('update-perfil-aparelho-desvincula', UPDATE_PERFIL_APARELHO_DESVINCULA)
		console.log('--- service 1.1 ---')
		informacaoPerfil.values = [idPerfil]
		console.log('--- service 1.2 ---')
		const perfilAtualizado = await db.oneOrNone(informacaoPerfil)
		console.log('--- service 1.3 ---')
		return new DataHandler(httpStatus.CREATED, 'Aparelho atualizado com sucesso', camelize(perfilAtualizado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao atualizar o aparelho. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function atualizaAparelho (params) {
	try {
		const informacaoPerfil = new PreparedStatement('update-perfil-aparelho', UPDATE_PERFIL_APARELHO)
		informacaoPerfil.values = [params.idAparelho, params.plataforma, params.idPerfil]
		const perfilAtualizado = await db.oneOrNone(informacaoPerfil)
		return new DataHandler(httpStatus.CREATED, 'Aparelho atualizado com sucesso', camelize(perfilAtualizado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao atualizar o aparelho. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function adicionaHash (hashPerfil) {
	try {
		const informacaoPerfil = new PreparedStatement('update-perfil-hash', UPDATE_PERFIL_HASH)
		informacaoPerfil.values = [hashPerfil.hash, hashPerfil.idPerfil]
		const perfilAtualizado = await db.oneOrNone(informacaoPerfil)
		return new DataHandler(httpStatus.OK, 'Perfil atualizado com sucesso', camelize(perfilAtualizado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao adicionar a hash. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function buscaPerfilPorHash (hash) {
	try {
		const informacaoPerfil = new PreparedStatement('select-perfil-hash', SELECT_PERFIL_HASH)
		informacaoPerfil.values = [hash]
		const perfilBuscado = await db.oneOrNone(informacaoPerfil)
		return new DataHandler(httpStatus.OK, 'Perfil encontrado com sucesso', camelize(perfilBuscado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao buscar o perfil. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function perfilEstabelecimentoFisica (id) {
	try {
		const pstm = new PreparedStatement('perfil-estabelecimento-fisica', SELECT_ESTABELECIMENTO_FISICA, [id])
		const estabelecimento = await db.one(pstm)
		return new DataHandler(httpStatus.OK, 'Estabelecimento encontrado', camelize(estabelecimento.retorno))
	} catch (error) {
		throw new ErrorHandler(`Erro ao buscar o estabelecimento. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function atualizaPerfil (perfil) {
	try {
		const informacaoPerfil = new PreparedStatement('update-perfil', UPDATE_PERFIL)
		informacaoPerfil.values = [perfil.codigo, perfil.senha, perfil.tipo, perfil.statusPerfil, perfil.plataforma, perfil.versao, perfil.versaoApp, perfil.id]
		const perfilAtualizado = await db.oneOrNone(informacaoPerfil)
		return new DataHandler(httpStatus.OK, 'Perfil atualizado com sucesso', camelize(perfilAtualizado))
	} catch (error) {
		throw new ErrorHandler(`Erro ao atualizar o perfil. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function perfilEstabelecimentoJuridica (id) {
	try {
		const pstm = new PreparedStatement('perfil-estabelecimento-juridica', SELECT_ESTABELECIMENTO_JURIDICA, [id])
		const estabelecimento = await db.one(pstm)
		return new DataHandler(httpStatus.OK, 'Estabelecimento encontrado', camelize(estabelecimento.retorno))
	} catch (error) {
		throw new ErrorHandler(`Erro ao buscar o estabelecimento. Detalhe(s): ${error.detail}`, httpStatus.BAD_REQUEST, true, error.code)
	}
}
export async function buscaPerfilPorId (id, tx = null) {
	try {
		tx = await validaTX(tx)
		const pstm = new PreparedStatement('select-perfil-id', SELECT_PERFIL_ID, [id])
		const perfil = await tx.oneOrNone(pstm)
		return new DataHandler(httpStatus.OK, 'Perfil encontrado', camelize(perfil))
	} catch (error) {
		throw new ErrorHandler(`Erro ao buscar o perfil.`, httpStatus.BAD_REQUEST, true, error.code)
	}
}

async function validaTX (tx = null) {
	if (tx === null || tx === undefined || tx === false) {
		tx = Object.assign(db)
	}
	return tx
}
*/
