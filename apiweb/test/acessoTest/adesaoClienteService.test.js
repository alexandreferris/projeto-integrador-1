import httpStatus from 'http-status'
import ErrorHandler from '../../src/handlers/error.handler'

const idEstabelecimento = '35464ebe-e0f7-4869-a2c5-b88990a79fb2'
const idTermo = '491f8e70-866f-4cbc-98b9-8d2081e4f362'
const tempo = '5140'
const latitude = '-25.5187141'
const longitude = '-54.564941'

describe('Validação de Aceite do Termo de Uso - Acesso Cartões', () => {
	const { aceitarTermoObrigatorio } = require('../../src/api/acesso/services/adesaoClienteService')

	let parametrosTermoEstabelecimento = {
		idEstabelecimento: null,
		idTermo: null,
		tempo: null,
		longitude: null,
		latitude: null
	}
	let parametrosTermoTermo = {
		idEstabelecimento: idEstabelecimento,
		idTermo: null,
		tempo: null,
		longitude: null,
		latitude: null
	}
	let parametrosTermoTempo = {
		idEstabelecimento: idEstabelecimento,
		idTermo: idTermo,
		tempo: null,
		longitude: null,
		latitude: null
	}
	let parametrosTermoLongitude = {
		idEstabelecimento: idEstabelecimento,
		idTermo: idTermo,
		tempo: tempo,
		longitude: null,
		latitude: null
	}
	let parametrosTermoLatitude = {
		idEstabelecimento: idEstabelecimento,
		idTermo: idTermo,
		tempo: tempo,
		longitude: longitude,
		latitude: null
	}

	test('idEstabelecimento NULL', async () => {
		expect(aceitarTermoObrigatorio(parametrosTermoEstabelecimento)).rejects.toEqual(new Error(`Não foi possível identificar o estabelecimento que está sendo enviado. Por favor, tente novamente.`))
	})
	test('idTermo NULL', async () => {
		expect(aceitarTermoObrigatorio(parametrosTermoTermo)).rejects.toEqual(new Error(`Não foi possível identificar o termo que está sendo enviado. Por favor, tente novamente.`))
	})
	test('tempo NULL', async () => {
		expect(aceitarTermoObrigatorio(parametrosTermoTempo)).rejects.toEqual(new Error(`Não foi possível identificar o campo Tempo que está sendo enviado. Por favor, tente novamente.`))
	})
	test('longitude NULL', async () => {
		expect(aceitarTermoObrigatorio(parametrosTermoLongitude)).rejects.toEqual(new Error(`Não foi possível identificar a Longitude que está sendo enviado. Por favor, tente novamente.`))
	})
	test('latitude NULL', async () => {
		expect(aceitarTermoObrigatorio(parametrosTermoLatitude)).rejects.toEqual(new Error(`Não foi possível identificar a Latitude que está sendo enviado. Por favor, tente novamente.`))
	})
})

describe('Aceite do Termo de Uso - Acesso Cartões', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Aceita o termo - 200 OK', async () => {
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			aceitaTermoObrigatorio: () => ({status: 200})
		}))

		const { aceitarTermoObrigatorio } = require('../../src/api/acesso/services/adesaoClienteService')

		const parametrosTermo = {
			idEstabelecimento: idEstabelecimento,
			idTermo: idTermo,
			tempo: tempo,
			longitude: longitude,
			latitude: latitude
		}

		const result = await aceitarTermoObrigatorio(parametrosTermo)
		expect(result.status).toBe(200)
	})

	test('Aceita o termo - 400 BAD REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			aceitaTermoObrigatorio: () => null
		}))

		const { aceitarTermoObrigatorio } = require('../../src/api/acesso/services/adesaoClienteService')

		const parametrosTermo = {
			idEstabelecimento: idEstabelecimento,
			idTermo: idTermo,
			tempo: tempo,
			longitude: longitude,
			latitude: latitude
		}

		expect(aceitarTermoObrigatorio(parametrosTermo)).rejects.toEqual(new ErrorHandler(`Não foi possível realizar o aceite deste termo. Por favor, tente novamente.`, httpStatus.BAD_REQUEST, true, 0))
	})
})

describe('Adesão do Cliente - Validação', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('Insere Cliente - Erro Throw Null', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: () => (null)
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('Os dados do estabelecimento não são válidos. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestTelefone = () => ({ })

	test('Insere Cliente - Erro Throw Validação Telefone', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestTelefone
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('Os dados de telefone do estabelecimento não são válidos. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEndereco = () => ({
		telefone: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEndereco
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('Os dados de endereço do estabelecimento não são válidos. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimento = () => ({
		telefone: {},
		endereco: {}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimento
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('As informações do estabelecimento não são válidas. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneDDI = () => ({
		telefone: {},
		endereco: {},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Telefone - DDI', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneDDI
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo DDI do Telefone não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneDDD = () => ({
		telefone: {
			ddi: '55'
		},
		endereco: {},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Telefone - DDD', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneDDD
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo DDD do Telefone não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneNumero = () => ({
		telefone: {
			ddi: '55',
			ddd: '55'
		},
		endereco: {},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Telefone - Número', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestTelefoneNumero
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Número do Telefone não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoBairro = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - Bairro', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoBairro
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Bairro do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoCEP = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro'
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - CEP', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoCEP
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo CEP do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoCidade = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123'
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - Cidade', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoCidade
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Cidade do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoLogradouro = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade'
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - Logradouro', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoLogradouro
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Logradouro do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoNumero = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro'
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - Número', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoNumero
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Número do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoUF = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Endereço - UF', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEnderecoUF
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo UF do Endereço não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoCPF = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - CPF', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoCPF
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo CPF do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoDataNascimento = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {
			cpfFormatado: 12312312312
		}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - Data de Nascimento', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoDataNascimento
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Data de Nascimento do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoEmail = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10'
		}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - E-mail', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoEmail
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo E-mail do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoNome = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10',
			email: 'email'
		}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - Nome', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoNome
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Nome Completo do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoNomeMae = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10',
			email: 'email',
			nome: 'Nome Completo'
		}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - Nome da Mãe', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoNomeMae
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Nome da Mãe do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})

	const mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoSexo = () => ({
		telefone: {
			ddi: '55',
			ddd: '55',
			numero: '123412341'
		},
		endereco: {
			bairro: 'Bairro',
			cep: '12345123',
			cidade: 'Cidade',
			logradouro: 'Logradouro',
			numero: 123,
			uf: 'UF'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10',
			email: 'email',
			nome: 'Nome Completo',
			nomeMae: 'Nome da Mãe'
		}
	})

	test('Insere Cliente - Erro Throw Validação Estabelecimento - Sexo', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdTestEstabelecimentoSexo
		}))

		const { adesaoCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(adesaoCliente(idEstabelecimento)).rejects.toEqual(new ErrorHandler('O campo Sexo do Estabelecimento não é válido. Por favor, tente novamente.', httpStatus.BAD_REQUEST, true, 0))
	})
})
describe('Adesão do Cliente - Acesso Cartões', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	const mockBuscarInformacoesEstabelecimentoPorId = () => ({
		telefone: {
			ddd: '55',
			ddi: '55',
			numero: '123412341'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10',
			email: 'email',
			nome: 'Nome Completo',
			nomeMae: 'Nome da Mãe',
			sexo: 'FEMININO'
		},
		endereco: {
			bairro: 'Bairro',
			cep: 'CEP',
			cidade: 'Cidade',
			complemento: '',
			logradouro: 'Rua Avenida',
			numero: 111,
			uf: 'PR'
		}
	})

	const mockBuscarInformacoesEstabelecimentoPorIdMasculino = () => ({
		telefone: {
			ddd: '55',
			ddi: '55',
			numero: '123412341'
		},
		estabelecimento: {
			cpfFormatado: 12312312312,
			dataNascimento: '2000-10-10',
			email: 'email',
			nome: 'Nome Completo',
			nomeMae: 'Nome da Mãe',
			sexo: 'MASCULINO'
		},
		endereco: {
			bairro: 'Bairro',
			cep: 'CEP',
			cidade: 'Cidade',
			complemento: '',
			logradouro: 'Rua Avenida',
			numero: 111,
			uf: 'PR'
		}
	})

	test('criarPayloadAdesaoInserirCliente() - Throw Error DATA IS NULL', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: () => (null)
		}))

		const { criarPayloadAdesaoInserirCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		expect(criarPayloadAdesaoInserirCliente(idEstabelecimento)).rejects.toEqual(Error(`Os dados do estabelecimento não são válidos. Por favor, tente novamente.`))
	})

	test('criarPayloadAdesaoInserirCliente() - Returning payload', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorIdMasculino
		}))

		const { criarPayloadAdesaoInserirCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const retorno = await criarPayloadAdesaoInserirCliente(idEstabelecimento)
		expect(retorno.Data.Usuario.CodCliente).toBe(12312312312)
	})

	test('insercaoDeCliente - ResultCode [0] - 200 OK', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 0 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(200)
	})

	test('insercaoDeCliente - ResultCode [1] - 200 OK', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 1 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(200)
	})

	test('insercaoDeCliente - ResultCode [2] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 2 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [3] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 3 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [4] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 4 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [5] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 5 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [6] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 6 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [7] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 7 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [8] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 8 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [9] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 9 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - ResultCode [DEFAULT] - 400 BAD_REQUEST', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => ({ ResultCode: 999 })
		}))

		const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
		const result = await insercaoDeCliente(idEstabelecimento)
		expect(result.status).toBe(400)
	})

	test('insercaoDeCliente - criaAdesaoClienteRespostaDeAcordoComCodigoDeResultado - Throw Error', async () => {
		jest.mock('../../src/api/acesso/acesso.repository', () => ({
			buscarInformacoesEstabelecimentoPorId: mockBuscarInformacoesEstabelecimentoPorId,
			atualizaPerfilUsuarioCadastradoAcesso: () => (null),
			insereLogErroRetornoAcesso: () => (null)
		}))
		jest.mock('../../src/api/acesso/acesso.rest', () => ({
			requisicaoAdesaoInserirCliente: () => (null)
		}))

		try {
			const { insercaoDeCliente } = require('../../src/api/acesso/services/adesaoClienteService')
			await insercaoDeCliente(idEstabelecimento)
		} catch (e) {
			expect(e.message).toEqual('O resultado de adesão do cliente não pode ser vazio ou nulo')
		}
	})
})
