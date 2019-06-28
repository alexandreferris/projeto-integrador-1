import { Router } from 'express'
import { listaTodos } from './situacao_conta.controller'

const routes = new Router()

routes.get('/listar/todos/', listaTodos)

export default routes
