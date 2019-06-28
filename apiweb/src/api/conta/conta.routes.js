import { Router } from 'express'
import { cadastrar, listarContaPorMes, cancelaConta, verificaContasUsuario, listaRelatorioComFiltro, pagarConta } from './conta.controller'


const routes = new Router()

routes.post('/cadastrar/', cadastrar)
routes.put('/cancelar/conta/', cancelaConta)
routes.put('/pagar/conta/', pagarConta)
routes.get('/buscar/mes/:idUsuario/:dataInicio/:dataFim', listarContaPorMes)
routes.get('/notifica/usuario/', verificaContasUsuario)
routes.get('/relatorio/:dataInicio?/:dataFim?/:idSituacao?/:idUsuario?', listaRelatorioComFiltro)
export default routes
