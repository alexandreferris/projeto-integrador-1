import { Router } from 'express'
import { inserirCliente, solicitarCartaoIdentificado, consultarCartoes, verificarSituacaoTaxaCartaoSolicitado, verificarFluxoMeusCartoes } from './acesso.controller'

const routes = new Router()
routes.post('/inserir/cliente/', inserirCliente)
routes.post('/solicitar/cartao/identificado', solicitarCartaoIdentificado)
routes.get('/consultar/cartoes/:idEstabelecimento', consultarCartoes)
routes.get('/verificar/taxa/solicitacao/cartao/:idEstabelecimento', verificarSituacaoTaxaCartaoSolicitado)
routes.get('/fluxo/meus/cartoes/:idEstabelecimento/:idPerfil', verificarFluxoMeusCartoes)

export default routes
