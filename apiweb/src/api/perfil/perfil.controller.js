/*
import httpStatus from 'http-status'
import { auth, geraToken, atualizaSenha, buscaPerfilPorHash, perfilEstabelecimentoFisica, perfilEstabelecimentoJuridica, atualizaPerfil, atualizaAparelho, desvinculaAparelho } from './perfil.services'
import { buscaEstabelecimentoJuridicaPorPerfil, buscaEstabelecimentoFisicaPorPerfil, buscaVinculoEstabelecimentoFisica, buscaEstabelecimentoPorPerfil } from '../estabelecimento/estabelecimento.service'
import { buscaAgenteEstabelecimento } from '../agente/agente.service'
import { retiraNull } from '../validacao/validacao.service'
import DataHandler from '../../handlers/data.handler'
import ErrorHandler from '../../handlers/error.handler'
import { Microservices } from '../microservices/microservices'

export async function desvinculaDispositivo (req, res, next) {
	try {
		console.log('--- service 0.0 ---')
		let idPerfil = req.params.idPerfil
		console.log('--- service 0.1 ---')
		let perfilAtualizado = await desvinculaAparelho(idPerfil)
		console.log('--- service 0.2 ---')
		perfilAtualizado.conteudo = await retiraNull(perfilAtualizado.conteudo)
		console.log('--- service 0.3 ---')
		res.status(httpStatus.OK).json(perfilAtualizado)
	} catch (error) {
		next(error)
	}
}
export async function validaSessao (req, res, next) {
	try {
		const { codigo, senha } = req.body
		let perfil = await auth().validacao(codigo, senha)
		let resposta = new DataHandler(httpStatus.OK, 'Sessao validada com sucesso', perfil)
		res.status(httpStatus.OK).json(resposta)
	} catch (error) {
		next(error)
	}
}
export async function autenticar (req, res, next) {
	const { codigo, senha, idAparelho, plataforma } = req.body
	try {
		const perfil = await auth().login(codigo, senha)
		let estabelecimento
		let perfilAtualizado = perfil
		if (perfil.tipo === 'ESTABELECIMENTO_PESSOA_JURIDICA') {
			estabelecimento = await buscaEstabelecimentoJuridicaPorPerfil(perfil.id)
		} else if (perfil.tipo === 'ESTABELECIMENTO_PESSOA_FISICA') {
			estabelecimento = await buscaEstabelecimentoFisicaPorPerfil(perfil.id)
		} else {
			throw new ErrorHandler('O estabelecimento informado não é Pessoa Física ou Jurídica', 400, {}, 'AUTH-001')
		}
		// atualiza o id do aparelho se o login estiver sido efetuado com sucesso
		if (perfil && idAparelho) {
			let params = { 'idPerfil': perfil.id, 'idAparelho': idAparelho, 'plataforma': plataforma }
			perfilAtualizado = await atualizaAparelho(params)
		}
		const retorno = { 'perfil': perfilAtualizado, 'estabelecimento': estabelecimento.conteudo }
		const token = await geraToken(retorno)
		const resposta = new DataHandler(httpStatus.OK, 'Login efetuado com sucesso', token)
		res.status(httpStatus.OK).json(resposta)
	} catch (error) {
		next(error)
	}
}
export async function alterarSenha (req, res, next) {
	try {
		const novaSenhaPerfil = { 'senha': req.body.senha, 'idPerfil': req.params.idPerfil }
		const perfil = (await atualizaSenha(novaSenhaPerfil)).conteudo
		let estabelecimento
		if (perfil.tipo === 'ESTABELECIMENTO_PESSOA_JURIDICA') {
			estabelecimento = await buscaEstabelecimentoJuridicaPorPerfil(perfil.id)
		} else if (perfil.tipo === 'ESTABELECIMENTO_PESSOA_FISICA') {
			estabelecimento = await buscaEstabelecimentoFisicaPorPerfil(perfil.id)
		}
		const retorno = { 'perfil': perfil, 'estabelecimento': estabelecimento.conteudo }
		const token = await geraToken(retorno)
		res.status(httpStatus.OK).json(token)
	} catch (error) {
		next(error)
	}
}
export async function verificaHash (req, res, next) {
	try {
		let hash = req.body.hash
		let senha = req.body.senha
		let estabelecimentoBuscado, nome, email
		let perfil = await buscaPerfilPorHash(hash)
		if (perfil.conteudo) {
			let perfilAtualiza = { 'idPerfil': perfil.conteudo.id, 'hash': null, 'senha': senha }
			let perfilAtualizado = (await atualizaSenha(perfilAtualiza)).conteudo
			if (perfilAtualizado) {
				let estabelecimento = await buscaEstabelecimentoPorPerfil(perfil.conteudo.id)
				if (estabelecimento.conteudo.tipo === 'ESTABELECIMENTO_PESSOA_FISICA') {
					estabelecimentoBuscado = await buscaEstabelecimentoFisicaPorPerfil(perfil.conteudo.id)
					nome = estabelecimentoBuscado.conteudo.nome
					email = estabelecimentoBuscado.conteudo.email
				} else if (estabelecimento.conteudo.tipo === 'ESTABELECIMENTO_PESSOA_JURIDICA') {
					estabelecimentoBuscado = await buscaEstabelecimentoJuridicaPorPerfil(perfil.conteudo.id)
					nome = estabelecimentoBuscado.conteudo.nomeSocio
					email = estabelecimentoBuscado.conteudo.email
				}
				let objEmail = { email: email, nome: nome }
				await Microservices.post('/mail/senha/alterada', objEmail)
				res.status(httpStatus.OK).json(new DataHandler(httpStatus.CREATED, 'Senha atualizada com sucesso'))
			} else {
				throw new ErrorHandler('Erro ao alterar a senha! Verifique os campos e tente novamente.', httpStatus.BAD_REQUEST, null, null)
			}
		} else {
			throw new ErrorHandler('Erro! Hash inválida.', httpStatus.BAD_REQUEST, null, null)
		}
	} catch (error) {
		next(error)
	}
}
export async function alteraPerfil (req, res, next) {
	try {
		let perfil = req.body
		const idPerfil = req.params.idPerfil
		perfil.idPerfil = idPerfil
		const perfilAtualizado = await atualizaPerfil(perfil)
		res.status(httpStatus.OK).json(perfilAtualizado)
	} catch (error) {
		next(error)
	}
}
export async function perfilEstabelecimento (req, res, next) {
	console.log('==== [PERFIL] - 0 ====')
	console.log(req.decoded.token.perfil)
	const id = req.decoded.token.perfil.conteudo.id
	const tipo = req.decoded.token.perfil.conteudo.tipo
	try {
		switch (tipo) {
		case 'ESTABELECIMENTO_PESSOA_FISICA':
			let estabelecimentoFisica = await perfilEstabelecimentoFisica(id)
			let vinculo = await buscaVinculoEstabelecimentoFisica(estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.idEstabelecimento)
			if (!vinculo.conteudo) {
				estabelecimentoFisica.conteudo.perfil.vinculo = false
			} else {
				estabelecimentoFisica.conteudo.perfil.vinculo = true
			}
			if (estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.codigoConvite) {
				let agente = await buscaAgenteEstabelecimento(estabelecimentoFisica.conteudo.estabelecimento.id)
				if (agente.conteudo) {
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.idAgente = agente.conteudo.codigoAgente
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.nomeAgente = agente.conteudo.nome
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.numeroAgente = '+' + agente.conteudo.ddi + ' (' + agente.conteudo.ddd + ') ' + agente.conteudo.numero
				} else {
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.idAgente = ''
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.nomeAgente = ''
					estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.numeroAgente = ''
				}
			} else {
				estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.idAgente = ''
				estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.nomeAgente = ''
				estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica.numeroAgente = ''
			}
			estabelecimentoFisica.conteudo.perfil.visualizouSolicitarCartao = false
			estabelecimentoFisica.conteudo.estabelecimento = await retiraNull(estabelecimentoFisica.conteudo.estabelecimento)
			estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica = await retiraNull(estabelecimentoFisica.conteudo.estabelecimentoPessoaFisica)
			res.status(httpStatus.OK).json(estabelecimentoFisica)
			break
		case 'ESTABELECIMENTO_PESSOA_JURIDICA':
			let estabelecimentoJuridica = await perfilEstabelecimentoJuridica(id)
			if (estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.codigoConvite) {
				let agente = await buscaAgenteEstabelecimento(estabelecimentoJuridica.conteudo.estabelecimento.id)
				if (agente.conteudo) {
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.idAgente = agente.conteudo.codigoAgente
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.nomeAgente = agente.conteudo.nome
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.numeroAgente = '+' + agente.conteudo.ddi + ' (' + agente.conteudo.ddd + ') ' + agente.conteudo.numero
				} else {
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.idAgente = ''
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.nomeAgente = ''
					estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.numeroAgente = ''
				}
			} else {
				estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.idAgente = ''
				estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.nomeAgente = ''
				estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica.numeroAgente = ''
			}
			estabelecimentoJuridica.conteudo.perfil.vinculo = false
			estabelecimentoJuridica.conteudo.perfil.visualizouSolicitarCartao = false
			estabelecimentoJuridica.conteudo.estabelecimento = await retiraNull(estabelecimentoJuridica.conteudo.estabelecimento)
			estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica = await retiraNull(estabelecimentoJuridica.conteudo.estabelecimentoPessoaJuridica)

			console.log('==== [PERFIL] - 1 ====')
			console.log(estabelecimentoJuridica.conteudo)
			console.log('==== [PERFIL] - 2 ====')
			console.log(estabelecimentoJuridica.conteudo.nomeEmpresa)
			console.log('==== [PERFIL] - 3 ====')
			console.log(estabelecimentoJuridica.conteudo.nomeEmpresa.nomeEmpresa)
			// estabelecimentoJuridica.conteudo.nomeEmpresa.nomeEmpresa = estabelecimentoJuridica.conteudo.nomeEmpresa.nomeEmpresa // retiraNull(estabelecimentoJuridica.conteudo.nomeEmpresa)
			console.log('==== [PERFIL] - 4 ====')
			console.log(estabelecimentoJuridica.conteudo.nomeEmpresa)
			// throw new ErrorHandler('Teste', httpStatus.BAD_REQUEST)
			res.status(httpStatus.OK).json(estabelecimentoJuridica)
			break
		}
	} catch (error) {
		next(error)
	}
}
export async function efetuaIndicacao (req, res, next) {
	try {
		const indicacao = req.body
		let retorno = new DataHandler(httpStatus.CREATED, 'Indicação efetuada com sucesso')
		res.status(httpStatus.OK).json(retorno)
	} catch (error) {
		next(error)
	}
}
*/
