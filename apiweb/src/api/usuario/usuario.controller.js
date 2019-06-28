import { salvar, logar, ativarDesativar, alterarSenha, atualizaDeviceToken, atualizarUsuario, buscaUsuarioPorEmail } from '../usuario/usuario.dao'
import DataHandler from '../../handlers/data.handler'
import httpStatus from 'http-status'
import camelize from 'camelize'
import ErrorHandler from '../../handlers/error.handler'
import randomstring from 'randomstring'
import nodemailer from 'nodemailer'
export async function cadastrar (req, res, next) {
	try {
		let usuarioCadastrado = await salvar(req.body)
		let resposta = new DataHandler(httpStatus.OK, 'Usuário salvo com sucesso', camelize(usuarioCadastrado))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function efetuaLogin (req, res, next) {
	try {
		let usuarioConsultado = await logar(req.body)
		if (!usuarioConsultado.ativo) await ativarDesativar(true, usuarioConsultado)
		usuarioConsultado.device_token = req.body.deviceToken
		await atualizaDeviceToken(usuarioConsultado)
		let resposta = new DataHandler(httpStatus.OK, 'Usuário logado com sucesso', camelize(usuarioConsultado))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function alteraAtivar (req, res, next) {
	try {
		let usuarioAtualizado = await ativarDesativar(req.body.ativo, req.body)
		let resposta = new DataHandler(httpStatus.OK, 'Operação realizada com sucesso', usuarioAtualizado)
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function trocarSenha (req, res, next) {
	try {
		let usuarioAlterado
		let usuarioConsultado = await logar(req.body)
		if (usuarioConsultado) {
			usuarioAlterado = await alterarSenha(req.body.novaSenha, usuarioConsultado)
		}
		let resposta = new DataHandler(httpStatus.OK, 'Senha alterada com sucesso.', usuarioAlterado)
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function atualizaUsuario (req, res, next) {
	try {
		let usuario = req.body
		let usuarioAtualizado
		let usuarioConsultado = await logar(usuario)
		if (usuarioConsultado && usuarioConsultado.id === usuario.id) {
			usuarioAtualizado = await atualizarUsuario(usuario)
			let resposta = new DataHandler(httpStatus.OK, 'Usuário atualizado com sucesso', camelize(usuarioAtualizado))
			res.json(resposta)
		} else {
			throw new ErrorHandler('Erro ao atualizar o usuário', httpStatus.BAD_REQUEST)
		}
	} catch (error) {
		next(error)
	}
}

export async function esqueciSenha (req, res, next) {
	try {
		let usuarioAlterado
		let usuarioConsultado = await buscaUsuarioPorEmail(req.body.email)
		if (usuarioConsultado) {
			let senhaRandomica = randomstring.generate(7);
			usuarioAlterado = await alterarSenha(senhaRandomica, usuarioConsultado)
			await enviaEmail(req.body.email, senhaRandomica)
		} else {
			throw new ErrorHandler('Erro ao alterar a senha', httpStatus.BAD_REQUEST)
		}
		let resposta = new DataHandler(httpStatus.OK, 'Usuário atualizado com sucesso', camelize(usuarioAlterado))
		res.json(resposta)
	} catch (error) {
		next(error)
	}
}

export async function enviaEmail(email, novaSenha) {
	var transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: 'elpossuido@hotmail.com',
			pass: 'B2F86gf541'
		}
	});
	
	var mailOptions = {
		from: 'elpossuido@hotmail.com',
		to: email,
		subject: 'Sistema Gerenciamento Financeiro - Recuperação de Senha',
		text: 'Sua senha foi resetada. Entre na sua conta usando a senha '+novaSenha
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}