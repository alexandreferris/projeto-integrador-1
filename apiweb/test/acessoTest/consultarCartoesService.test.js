import {
	ESTABELECIMENTO_PESSOA_FISICA,
	ESTABELECIMENTO_PESSOA_JURIDICA,
	CONSULTA_CARTOES_SUCESSO,
	ADESAO_RESPOSTA_SUCESSO_EXISTENTE
} from '../../src/api/acesso/acesso.constants'

describe('Consulta Cartões', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Retorna Throw ao criar o Payload - consultaDeCartoes Throw()', async () => {
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => (null)
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(consultaDeCartoes(null)).rejects.toEqual(new Error(`Erro ao tentar buscar os dados do estabelecimento por ID.`))
	})

	test('Retorna Throw ao criar o Payload - consultaDeCartoes Throw() CPF', async () => {
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: null
			})
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(consultaDeCartoes(null)).rejects.toEqual(new Error(`O campo CPF do Estabelecimento está inválido.`))
	})

	test('Retorna Throw ao criar o Payload - consultaDeCartoes Throw() Tipo', async () => {
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111
			})
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(consultaDeCartoes(null)).rejects.toEqual(new Error(`O campo Tipo do Estabelecimento está inválido.`))
	})

	test('Retorna Resposta da Consulta - ResultCode 0', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		const mockPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111,
				tipo: mockPessoaJuridica
			})
		}))
		const mockConsultaCartoesSucesso = CONSULTA_CARTOES_SUCESSO
		jest.mock('../../src/api/acesso/acesso.rest.js', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: mockConsultaCartoesSucesso,
				Data: []
			})
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await consultaDeCartoes(null)
		expect(response.status).toBe(200)
	})

	test('Retorna Resposta da Consulta - ResultCode 1', async () => {
		const mockPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE

		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111,
				tipo: mockPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest.js', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: 1,
				Data: []
			})
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await consultaDeCartoes(null)
		expect(response.status).toBe(400)
	})

	test('Retorna Resposta da Consulta - DEFAULT', async () => {
		const mockPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE

		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111,
				tipo: mockPessoaJuridica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest.js', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: 999,
				Data: []
			})
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await consultaDeCartoes(null)
		expect(response.status).toBe(400)
	})

	test('Retorna Resposta da Consulta - DEFAULT', async () => {
		const mockPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE

		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111,
				tipo: mockPessoaJuridica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest.js', () => ({
			requisicaoConsultaDosCartoes: () => (null)
		}))

		const { consultaDeCartoes } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(consultaDeCartoes(null)).rejects.toEqual(new Error('O resultado da consulta de cartões não pode ser vazio ou nulo.'))
	})
})
describe('Verificacao de taxa para solicitacao de cartao - verificarSePerfilPossuiCadastroAcesso()', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Buscar cadastro acesso - idPerfil NULL', async () => {
		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(verificarSePerfilPossuiCadastroAcesso(null)).rejects.toEqual(new Error(`Perfil inválido`))
	})

	test('Buscar cadastro acesso - idEstabelecimento NULL', async () => {
		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(verificarSePerfilPossuiCadastroAcesso('perfil', null)).rejects.toEqual(new Error(`Estabelecimento inválido`))
	})
	test('Buscar cadastro acesso - acessoCadastro NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => (null)
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')
		expect(response).toBe('TERMO')
	})
	test('Buscar cadastro acesso - acessoCadastro NAO', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => ({
				acessoCadastro: 'NAO'
			})
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')
		expect(response).toBe('TERMO')
	})
	test('Buscar cadastro acesso - acessoCadastro SIM - Pessoa Fisica', async () => {
		const mockPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
		const mockConsultaCartoesSucesso = CONSULTA_CARTOES_SUCESSO
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => ({
				acessoCadastro: 'SIM'
			}),
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 1111111,
				tipo: mockPessoaFisica
			})
		}))
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ('token')
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: mockConsultaCartoesSucesso,
				Data: []
			})
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')
		expect(response).toBe('SOLICITAR')
	})
	test('Buscar cadastro acesso - acessoCadastro SIM - Pessoa Juridica', async () => {
		const mockPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		const mockConsultaCartoesSucesso = CONSULTA_CARTOES_SUCESSO
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => ({
				acessoCadastro: 'SIM'
			}),
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 1111111,
				tipo: mockPessoaJuridica
			})
		}))
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ('token')
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: mockConsultaCartoesSucesso,
				Data: []
			})
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')
		expect(response).toBe('SOLICITAR')
	})
	test('Buscar cadastro acesso - acessoCadastro SIM - Pessoa Fisica Consultar Cartões', async () => {
		const mockPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		const mockConsultaCartoesSucesso = CONSULTA_CARTOES_SUCESSO
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => ({
				acessoCadastro: 'SIM'
			}),
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 1111111,
				tipo: mockPessoaJuridica
			})
		}))
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ('token')
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoConsultaDosCartoes: () => ({
				ResultCode: mockConsultaCartoesSucesso,
				Data: ['cartao1', 'cartao2']
			})
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		const response = await verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')
		expect(response).toBe('CONSULTAR')
	})
	test('Buscar cadastro acesso - acessoCadastro SIM - Erro Throw', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscaAcessoCadastroPerfil: () => ({
				acessoCadastro: 'SIM'
			}),
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => (null)
		}))
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ('token')
		}))

		const { verificarSePerfilPossuiCadastroAcesso } = require('../../src/api/acesso/services/consultarCartoesService')
		expect(verificarSePerfilPossuiCadastroAcesso('perfil', 'estabelecimento')).rejects.toEqual(new Error('Erro ao tentar buscar os dados do estabelecimento por ID.'))
	})
})
