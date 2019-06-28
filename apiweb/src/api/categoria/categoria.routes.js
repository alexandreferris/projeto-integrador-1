import { Router } from 'express'
import { listaTodos } from './categoria.controller'


const routes = new Router()

routes.get('/listar/todos/', listaTodos)

export default routes
