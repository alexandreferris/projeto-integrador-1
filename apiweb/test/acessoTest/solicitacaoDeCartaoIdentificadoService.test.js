import {
	ESTABELECIMENTO_PESSOA_FISICA,
	ESTABELECIMENTO_PESSOA_JURIDICA,
	ADESAO_RESPOSTA_SUCESSO_EXISTENTE
} from '../../src/api/acesso/acesso.constants'

describe('Validação Criar Payload - criarPayloadSolicitacaoCartaoIdentificado() ', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Retorno dos dados estabelecimento - NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => (null)
		}))

		const { criarPayloadSolicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(criarPayloadSolicitacaoCartaoIdentificado(null, null)).rejects.toEqual(new Error(`Erro ao tentar buscar os dados do estabelecimento por ID.`))
	})

	test('Retorno dos dados estabelecimento CPF - NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: null
			})
		}))

		const { criarPayloadSolicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(criarPayloadSolicitacaoCartaoIdentificado(null, null)).rejects.toEqual(new Error(`O campo CPF do Estabelecimento está inválido.`))
	})

	test('Retorno dos dados estabelecimento Tipo - NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111
			})
		}))

		const { criarPayloadSolicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(criarPayloadSolicitacaoCartaoIdentificado(null, null)).rejects.toEqual(new Error(`O campo Tipo do Estabelecimento está inválido.`))
	})

	test('Retorno dos dados estabelecimento - Returning payload - Pessoa Fisica', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 12312312344,
				tipo: mockEstabelecimentoPessoaFisica
			})
		}))

		const { criarPayloadSolicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const retorno = await criarPayloadSolicitacaoCartaoIdentificado('token', 'idEstabelecimento')
		expect(retorno.Data.TpCliente).toBe(0)
	})

	test('Retorno dos dados estabelecimento - Returning payload - Pessoa Juridica', async () => {
		const mockEstabelecimentoPessoaJuridica = ESTABELECIMENTO_PESSOA_JURIDICA
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 12312312344,
				tipo: mockEstabelecimentoPessoaJuridica
			})
		}))

		const { criarPayloadSolicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const retorno = await criarPayloadSolicitacaoCartaoIdentificado('token', 'idEstabelecimento')
		expect(retorno.Data.TpCliente).toBe(1)
	})
})

describe('Solicitação do Cartão Identificado - solicitacaoCartaoIdentificado()', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Retorna Throw ao criar o Payload - criarPayloadSolicitacaoCartaoIdentificado Throw() NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => (null)
		}))

		const { solicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoCartaoIdentificado(null)).rejects.toEqual(new Error(`Erro ao tentar buscar os dados do estabelecimento por ID.`))
	})

	test('Retorna Throw ao criar o Payload - criarPayloadSolicitacaoCartaoIdentificado Throw() CPF NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: null
			})
		}))

		const { solicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoCartaoIdentificado(null)).rejects.toEqual(new Error(`O campo CPF do Estabelecimento está inválido.`))
	})

	test('Retorna Throw ao criar o Payload - criarPayloadSolicitacaoCartaoIdentificado Throw() Tipo NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111
			})
		}))

		const { solicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoCartaoIdentificado(null)).rejects.toEqual(new Error(`O campo Tipo do Estabelecimento está inválido.`))
	})
	test('Retorna Resultado da requisição a API da Acesso', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			})
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 0 })
		}))

		const { solicitacaoCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const response = await solicitacaoCartaoIdentificado(null)
		expect(response.ResultCode).toBe(0)
	})
})

describe('Solicitação do Cartão Identificado - solicitacaoCartaoIdentificado()', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Solicitar o Cartão Identificado - Throw() solicitacaoCartaoIdentificado NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => (null)
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoDeCartaoIdentificado(null)).rejects.toEqual(new Error(`Erro ao tentar buscar os dados do estabelecimento por ID.`))
	})

	test('Solicitar o Cartão Identificado - Throw() solicitacaoCartaoIdentificado CPF NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: null
			})
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoDeCartaoIdentificado(null)).rejects.toEqual(new Error(`O campo CPF do Estabelecimento está inválido.`))
	})

	test('Solicitar o Cartão Identificado - Throw() solicitacaoCartaoIdentificado Tipo NULL', async () => {
		const mockAdesaoRespostaSucessoExistente = ADESAO_RESPOSTA_SUCESSO_EXISTENTE
		jest.mock('../../src/api/acesso/services/tokenService', () => ({
			buscarTokenAdesaoCliente: () => ({
				ResultCode: mockAdesaoRespostaSucessoExistente,
				Data: 'token'
			})
		}))
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarDadosCPFeTipoDoEstabelecimentoPorId: () => ({
				cpf: 111
			})
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoDeCartaoIdentificado(null)).rejects.toEqual(new Error(`O campo Tipo do Estabelecimento está inválido.`))
	})

	test('Solicitar o Cartão Identificado - NULL -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => (null)
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(solicitacaoDeCartaoIdentificado(null)).rejects.toEqual(new Error(`O resultado de solicitação de cartão identificado não pode ser vazio ou nulo.`))
	})

	test('Solicitar o Cartão Identificado - ResultCode 0 -> 200 OK', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			})
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 0 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const response = await solicitacaoDeCartaoIdentificado(null)
		expect(response.status).toBe(200)
	})

	test('Solicitar o Cartão Identificado - ResultCode 1 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 1 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 2 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 2 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 3 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 3 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 4 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 4 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 5 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 5 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 6 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 6 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 7 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 7 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 8 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 8 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 9 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 9 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 10 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 10 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 11 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 11 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 12 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 12 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 13 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 13 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 14 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 14 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 15 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 15 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 16 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 16 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode 17 -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 17 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})

	test('Solicitar o Cartão Identificado - ResultCode DEFAULT -> 400 BAD_REQUEST', async () => {
		const mockEstabelecimentoPessoaFisica = ESTABELECIMENTO_PESSOA_FISICA
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
				tipo: mockEstabelecimentoPessoaFisica
			}),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoSolicitarCartaoIdentificado: () => ({ ResultCode: 999 })
		}))

		const { solicitacaoDeCartaoIdentificado } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const result = await solicitacaoDeCartaoIdentificado(null)
		expect(result.status).toBe(400)
	})
})
describe('Verificacao de taxa para solicitacao de cartao - verificacaoTaxaCartaoSolicitacao()', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Buscar taxa - idEstabelecimento NULL', async () => {
		const { verificacaoTaxaCartaoSolicitacao } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(verificacaoTaxaCartaoSolicitacao(null)).rejects.toEqual(new Error(`Estabelecimento inválido`))
	})
	test('Buscar taxa - NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarTaxaCartaoSolicitacao: () => (null)
		}))

		const { verificacaoTaxaCartaoSolicitacao } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		expect(verificacaoTaxaCartaoSolicitacao('id_estabelecimento')).rejects.toEqual(new Error(`Erro ao buscar a taxa de solicitação do cartão.`))
	})
	test('Buscar taxa - Sucesso', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarTaxaCartaoSolicitacao: () => ({
				tipoTaxa: 'ISENTO'
			})
		}))

		const { verificacaoTaxaCartaoSolicitacao } = require('../../src/api/acesso/services/solicitacaoDeCartaoIdentificadoService')
		const response = await verificacaoTaxaCartaoSolicitacao('id_estabelecimento')
		expect(response.tipoTaxa).toBe('ISENTO')
	})
})
