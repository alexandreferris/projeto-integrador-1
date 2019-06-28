import { Router } from 'express'
import { cadastrar, efetuaLogin, alteraAtivar, trocarSenha, atualizaUsuario, esqueciSenha } from './usuario.controller'


const routes = new Router()

routes.post('/cadastrar/', cadastrar)
routes.post('/logar/', efetuaLogin)
routes.put('/ativa/desativa/', alteraAtivar)
routes.put('/altera/senha/', trocarSenha)
routes.put('/atualiza/', atualizaUsuario)
routes.post('/esqueci/senha/', esqueciSenha)
export default routes
