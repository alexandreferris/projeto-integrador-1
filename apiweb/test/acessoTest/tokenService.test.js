import {
	ADESAO_RESPOSTA_SUCESSO_CRIACAO,
	ADESAO_RESPOSTA_SUCESSO_EXISTENTE
} from '../../src/api/acesso/acesso.constants'

describe('Solicitar Token de Adesão ', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Token de Adesão - NULL', async () => {
		jest.mock('../../src/api/acesso/services/adesaoClienteService', () => ({
			adesaoCliente: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			insereLogErroRetornoAcesso: () => (null)
		}))

		const { buscarTokenAdesaoCliente } = require('../../src/api/acesso/services/tokenService')
		expect(buscarTokenAdesaoCliente(null)).rejects.toEqual(new Error(`Não foi possível retornar o Token de Adesão.`))
	})

	test('Token de Adesão - ResultCode 1', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/adesaoClienteService', () => ({
			adesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			insereLogErroRetornoAcesso: () => (null)
		}))

		const { buscarTokenAdesaoCliente } = require('../../src/api/acesso/services/tokenService')
		const response = await buscarTokenAdesaoCliente(null)
		expect(response).toBe('token')
	})
})
