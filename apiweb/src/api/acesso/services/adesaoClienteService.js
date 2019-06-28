import httpStatus from 'http-status'
import { buscarInformacoesEstabelecimentoPorId, atualizaPerfilUsuarioCadastradoAcesso, insereLogErroRetornoAcesso } from '../acesso.repository'
import { aceitaTermoObrigatorio, requisicaoAdesaoInserirCliente } from '../acesso.rest'
import { validarDadosAceitarTermo, validarDadosEstabelecimentoAdesaoCliente, criaAdesaoClienteRespostaDeAcordoComCodigoDeResultado, validarCampo } from '../acesso.validation'
import ErrorHandler from '../../../handlers/error.handler'
import moment from 'moment'
import {
	ADESAO_HORA_PLUS_3,
	ADESAO_HORA_MINUS_TIMEZONE,
	ADESAO_TIPO_TELEFONE,
	ADESAO_TIPO_ENDERECO,
	ADESAO_REC_ID,
	ADESAO_SEXO_MASCULINO,
	ADESAO_SEXO_FEMININO,
	ADESAO_TIPO_CLIENTE,
	ADESAO_LINGUAGEM,
	ADESAO_RESPOSTA_SUCESSO_CRIACAO,
	ADESAO_RESPOSTA_SUCESSO_EXISTENTE,
	ADESAO_CODIGO_ESPECIE_PRODUTO,
	ADESAO_NOME_CANAL,
	ADESAO_CAMPANHA,
	TIPO_ERRO_LOG_INSERIR_CLIENTE
} from '../acesso.constants'
import { logInfo, logError } from '../acesso.logs'

export async function aceitarTermoObrigatorio (parametrosTermo) {
	logInfo('Entering aceitaTermoObrigatorio()', parametrosTermo)
	let retorno
	try {
		await validarDadosAceitarTermo(parametrosTermo)

		retorno = await aceitaTermoObrigatorio(parametrosTermo)
	} catch (exception) {
		let msg = exception.message

		logError('Error aceitaTermoObrigatorio()', msg)
		throw new ErrorHandler(msg, httpStatus.BAD_REQUEST, true, exception.code)
	}

	if (!retorno) throw new ErrorHandler(`Não foi possível realizar o aceite deste termo. Por favor, tente novamente.`, httpStatus.BAD_REQUEST, true)

	return retorno
}

export async function insercaoDeCliente (idEstabelecimento) {
	logInfo('Entering inserirCliente()', idEstabelecimento)
	let retorno
	try {
		const responseAdesaoCliente = await adesaoCliente(idEstabelecimento)

		// Salva os dados na tabela de logs
		if (await validarCampo(responseAdesaoCliente) && (responseAdesaoCliente.ResultCode === ADESAO_RESPOSTA_SUCESSO_CRIACAO || responseAdesaoCliente.ResultCode === ADESAO_RESPOSTA_SUCESSO_EXISTENTE)) {
			// Atualiza o Perfil do Usuário como Cadastrado na Acesso
			await atualizaPerfilUsuarioCadastradoAcesso(idEstabelecimento)
		} else {
			// Insere um novo registro na tabela de Logs de retornos da Acesso
			await insereLogErroRetornoAcesso(idEstabelecimento, responseAdesaoCliente, TIPO_ERRO_LOG_INSERIR_CLIENTE)
		}

		// Retorna o resultado da acesso formatado para ErrorHandler ou DataHandler
		retorno = await criaAdesaoClienteRespostaDeAcordoComCodigoDeResultado(responseAdesaoCliente)
		logInfo('Returning inserirCliente(): ', retorno)
	} catch (exception) {
		let msg = exception.message

		logError('Error inserirCliente()', msg)
		throw new ErrorHandler(msg, httpStatus.BAD_REQUEST, true, exception.code)
	}

	return retorno
}

/**
 * Método usado para adesão de cliente e/ou resgatar o Token de Adesão
 *
 * @param {uuid} idEstabelecimento
 * @returns Response AdesaoCliente Acesso
 */
export async function adesaoCliente (idEstabelecimento) {
	logInfo('Entering adesaoCliente()', idEstabelecimento)
	try {
		// Criação dos parâmetros para envio
		const payloadAdesaoInserirCliente = await criarPayloadAdesaoInserirCliente(idEstabelecimento)

		// Realiza o envio do payload para o serviço da API da Acesso
		const respostaAdesaoCliente = await requisicaoAdesaoInserirCliente(payloadAdesaoInserirCliente)

		logInfo('Returning adesaoCliente()', respostaAdesaoCliente)
		return respostaAdesaoCliente
	} catch (exception) {
		let msg = exception.message

		logError('Error adesaoCliente()', msg)
		throw new Error(msg)
	}
}

export async function criarPayloadAdesaoInserirCliente (idEstabelecimento) {
	logInfo('Entering criarPayloadAdesaoInserirCliente(' + idEstabelecimento + ')')
	let dados
	try {
		// Realiza busca dos dados do estabelecimento
		dados = await buscarInformacoesEstabelecimentoPorId(idEstabelecimento)

		// Realiza a validação dos campos necessários
		await validarDadosEstabelecimentoAdesaoCliente(dados)
	} catch (exception) {
		let msg = exception.message

		logError('Error criarPayloadAdesaoInserirCliente(): ' + msg)
		throw new Error(msg)
	}

	// Monta os parâmetros para envio
	let payload = {
		Browser: null,
		Capabilities: null,
		CodOrigem: null,
		CodTerminal: null,
		Data: {
			Campanha: ADESAO_CAMPANHA,
			CodEspecieProduto: ADESAO_CODIGO_ESPECIE_PRODUTO,
			Usuario: {
				Celular: {
					DDD: dados.telefone.ddd,
					DDI: dados.telefone.ddi,
					Numero: dados.telefone.numero,
					TpTelefone: ADESAO_TIPO_TELEFONE
				},
				CodCliente: dados.estabelecimento.cpfFormatado,
				DtNascimento: '\/Date(' + moment(dados.estabelecimento.dataNascimento).add(ADESAO_HORA_PLUS_3, 'hours').toDate().getTime() + '-' + ADESAO_HORA_MINUS_TIMEZONE + ')\/',
				Email: dados.estabelecimento.email,
				Endereco: {
					Bairro: dados.endereco.bairro,
					CEP: dados.endereco.cep,
					Cidade: dados.endereco.cidade,
					Complemento: dados.endereco.complemento,
					Logradouro: dados.endereco.logradouro,
					Numero: dados.endereco.numero,
					TpEndereco: ADESAO_TIPO_ENDERECO,
					UF: dados.endereco.uf
				},
				NomeCompleto: dados.estabelecimento.nome,
				NomeMae: dados.estabelecimento.nomeMae,
				Senha: '',
				TpCliente: ADESAO_TIPO_CLIENTE,
				TpSexo: (dados.estabelecimento.sexo === 'MASCULINO') ? ADESAO_SEXO_MASCULINO : ADESAO_SEXO_FEMININO
			}
		},
		IpCliente: null,
		Language: ADESAO_LINGUAGEM,
		NomeCanal: ADESAO_NOME_CANAL,
		RecId: ADESAO_REC_ID
	}

	logInfo('Returning criarPayloadAdesaoInserirCliente()', payload)
	return payload
}
