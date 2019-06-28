import express from 'express'
import usuarioRoutes from '../api/usuario/usuario.routes'
import contaRoutes from '../api/conta/conta.routes'
import categoriaRoutes from '../api/categoria/categoria.routes'
import situacaoRoutes from '../api/situacao_conta/situacao_conta.routes'


const router = express.Router()


router.use('/usuario', usuarioRoutes)
router.use('/conta', contaRoutes)
router.use('/categoria', categoriaRoutes)
router.use('/situacao', situacaoRoutes)

export default router
