import ErrorHandler from '../../handlers/error.handler'
import db from '../../db/db'
import { PreparedStatement } from 'pg-promise'
import httpStatus from 'http-status'

export async function salvar (usuario) {
	try {
        const informacaoUsuario = new PreparedStatement('salvar-usuario',
        `INSERT INTO usuario (nome, email, senha, device_token, criado_em) VALUES ($1, $2, crypt('senha', $3), $4, CURRENT_DATE) RETURNING *`
        )
        informacaoUsuario.values = [usuario.nome, usuario.email, usuario.senha, usuario.deviceToken]
		const usuarioSalvo = await db.oneOrNone(informacaoUsuario)
        return usuarioSalvo
    } catch (error) {
		throw new ErrorHandler('Erro ao salvar o usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function logar (usuario) {
	try {
        const informacaoUsuario = new PreparedStatement('logar-usuario',
        `SELECT id, nome, email, device_token FROM usuario WHERE email = $1 AND senha = crypt($2, 'senha') LIMIT 1`
        )
        informacaoUsuario.values = [usuario.email, usuario.senha]
		const usuarioBuscado = await db.one(informacaoUsuario)
        return usuarioBuscado
    } catch (error) {
		throw new ErrorHandler('Erro ao logar o usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function ativarDesativar (ativo, usuario) {
	try {
        const informacaoUsuario = new PreparedStatement('desativar-usuario',
        `UPDATE usuario SET ativo = $1 WHERE id = $2 RETURNING *`
        )
        informacaoUsuario.values = [ativo, usuario.id]
        const usuarioAtualizado = await db.oneOrNone(informacaoUsuario)
        return usuarioAtualizado
    } catch (error) {
		throw new ErrorHandler('Erro ao desativar o usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function alterarSenha (novaSenha, usuario) {
	try {
        const informacaoUsuario = new PreparedStatement('alterar-senha',
        `UPDATE usuario SET senha = crypt($1, 'senha') WHERE id = $2 RETURNING *`
        )
        informacaoUsuario.values = [novaSenha, usuario.id]
        const usuarioAtualizado = await db.oneOrNone(informacaoUsuario)
        return usuarioAtualizado
    } catch (error) {
		throw new ErrorHandler('Erro ao alterar a senha do usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function atualizaDeviceToken (usuario) {
	try {
        const informacaoUsuario = new PreparedStatement('atualizar-token-usuario',
        `UPDATE usuario SET device_token = $1 WHERE id = $2 RETURNING *`
        )
        informacaoUsuario.values = [usuario.device_token, usuario.id]
        const usuarioAtualizado = await db.oneOrNone(informacaoUsuario)
        return usuarioAtualizado
    } catch (error) {
		throw new ErrorHandler('Erro ao atualizar o token do usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function atualizarUsuario (usuario) {
	try {
        let sqlSenhaNova = ""
        if (usuario.senhaNova !== "") {
            sqlSenhaNova = `, senha = crypt($3, 'senha')`
        }

        const informacaoUsuario = new PreparedStatement('atualizar-usuario',
        `UPDATE usuario SET nome = $1` + sqlSenhaNova + ` WHERE id = $2 RETURNING *`
        )
        let valoresParam = []
        valoresParam.push(usuario.nome)
        valoresParam.push(usuario.id)
        if (usuario.senhaNova !== "") {
            valoresParam.push(usuario.senhaNova)
        }
        informacaoUsuario.values = valoresParam
        const usuarioAtualizado = await db.oneOrNone(informacaoUsuario)
        return usuarioAtualizado
    } catch (error) {
		throw new ErrorHandler('Erro ao atualizar usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}

export async function buscaUsuarioPorEmail (email) {
  try {
    const informacaoUsuario = new PreparedStatement('buscar-usuario-email',
    `SELECT id, nome, email, device_token FROM usuario WHERE email = $1 LIMIT 1`
    )
    informacaoUsuario.values = [email]
    const usuarioBuscado = await db.one(informacaoUsuario)
    return usuarioBuscado
  } catch (error) {
		throw new ErrorHandler('Erro ao buscar o usuario', httpStatus.BAD_REQUEST, true, error.code)
	}
}