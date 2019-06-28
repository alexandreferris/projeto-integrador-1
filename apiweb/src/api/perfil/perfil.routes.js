/**
 * @api {post} /perfil/auth Realiza autenticação de um perfil (Operador/Estabelecimento/Cliente)
 * @apiVersion 2.0.0
 * @apiGroup Perfil
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *    "codigo":"xxxx",
 *    "senha":"zzz"
 *  }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ey..."
 *     }
 */
/*
import { Router } from 'express'
import { validaSessao, autenticar, verificaHash, alterarSenha, perfilEstabelecimento, alteraPerfil, efetuaIndicacao, desvinculaDispositivo } from './perfil.controller'
import { verifyToken } from '../middleware/jwt.middleware'


const routes = new Router()

routes.post('/indicacao/', efetuaIndicacao)
routes.post('/auth', autenticar)
routes.post('/valida/sessao/', validaSessao)
routes.post('/nova/senha/', verificaHash)
routes.put('/altera/senha/:idPerfil', alterarSenha)
routes.put('/altera/perfil/:idPerfil', alteraPerfil)
routes.put('/desvincula/dispositivo/:idPerfil', desvinculaDispositivo)
routes.get('/', verifyToken, perfilEstabelecimento)

export default routes
*/
