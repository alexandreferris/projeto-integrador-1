import httpStatus from 'http-status'
import DataHandler from '../../handlers/data.handler'
import ErrorHandler from '../../handlers/error.handler'

/**
 * @param {json} campo
 * @returns {True/False}
 */
export async function validarCampo (campo) {
	return (campo !== undefined && campo && campo !== null)
}

/**
 * @param {json} aceitaTermo
 * @returns {Error}
 */
export async function validarDadosAceitarTermo (aceitaTermo) {
	if (!await validarCampo(aceitaTermo.idEstabelecimento)) throw new Error(`Não foi possível identificar o estabelecimento que está sendo enviado. Por favor, tente novamente.`)
	if (!await validarCampo(aceitaTermo.idTermo)) throw new Error(`Não foi possível identificar o termo que está sendo enviado. Por favor, tente novamente.`)
	if (!await validarCampo(aceitaTermo.tempo)) throw new Error(`Não foi possível identificar o campo Tempo que está sendo enviado. Por favor, tente novamente.`)
	if (!await validarCampo(aceitaTermo.longitude)) throw new Error(`Não foi possível identificar a Longitude que está sendo enviado. Por favor, tente novamente.`)
	if (!await validarCampo(aceitaTermo.latitude)) throw new Error(`Não foi possível identificar a Latitude que está sendo enviado. Por favor, tente novamente.`)
}

/**
 * @param {json} data
 * @returns {Error/ErrorHandler/DataHandler}
 */
export async function criaAdesaoClienteRespostaDeAcordoComCodigoDeResultado (data) {
	if (!await validarCampo(data)) throw new Error('O resultado de adesão do cliente não pode ser vazio ou nulo')

	switch (data.ResultCode) {
	case 0:
	case 1:
		return new DataHandler(httpStatus.OK, 'Aceite de termo e adesão de novo cliente inseridos com sucesso.')
	case 2:
		return new ErrorHandler('Erro ao incluir o usuário', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 3:
		return new ErrorHandler('Erro ao buscar a campanha', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 4:
		return new ErrorHandler('Erro ao incluir a campanha', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 5:
		return new ErrorHandler('Erro validando os dados de um cadastro reduzido', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 6:
		return new ErrorHandler('Erro validando os dados de um cadastro completo', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 7:
		return new ErrorHandler('Erro ao vincular um usuário a uma empresa', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 8:
		return new ErrorHandler('Erro ao consultar o vínculo do usuário com a empresa', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 9:
		return new ErrorHandler('Erro ao buscar parâmetro', httpStatus.BAD_REQUEST, true, data.ResultCode)
	default:
		return new ErrorHandler('Não foi possível validar o código do resultado. Por favor, verifique todos seus dados.', httpStatus.BAD_REQUEST)
	}
}

/**
 * @param {json} data
 * @returns {Error}
 */
export async function validarDadosEstabelecimentoAdesaoCliente (data) {
	if (!await validarCampo(data)) throw new Error(`Os dados do estabelecimento não são válidos. Por favor, tente novamente.`)
	if (!await validarCampo(data.telefone)) throw new Error(`Os dados de telefone do estabelecimento não são válidos. Por favor, tente novamente.`)
	if (!await validarCampo(data.endereco)) throw new Error(`Os dados de endereço do estabelecimento não são válidos. Por favor, tente novamente.`)
	if (!await validarCampo(data.estabelecimento)) throw new Error(`As informações do estabelecimento não são válidas. Por favor, tente novamente.`)

	await validarDadosTelefone(data.telefone)
	await validarDadosEndereco(data.endereco)
	await validarDadosEstabelecimento(data.estabelecimento)
}

async function validarDadosTelefone (telefone) {
	if (!await validarCampo(telefone.ddi)) throw new Error(`O campo DDI do Telefone não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(telefone.ddd)) throw new Error(`O campo DDD do Telefone não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(telefone.numero)) throw new Error(`O campo Número do Telefone não é válido. Por favor, tente novamente.`)
}

async function validarDadosEndereco (endereco) {
	if (!await validarCampo(endereco.bairro)) throw new Error(`O campo Bairro do Endereço não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(endereco.cep)) throw new Error(`O campo CEP do Endereço não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(endereco.cidade)) throw new Error(`O campo Cidade do Endereço não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(endereco.logradouro)) throw new Error(`O campo Logradouro do Endereço não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(endereco.numero)) throw new Error(`O campo Número do Endereço não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(endereco.uf)) throw new Error(`O campo UF do Endereço não é válido. Por favor, tente novamente.`)
}

async function validarDadosEstabelecimento (estabelecimento) {
	if (!await validarCampo(estabelecimento.cpfFormatado)) throw new Error(`O campo CPF do Estabelecimento não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(estabelecimento.dataNascimento)) throw new Error(`O campo Data de Nascimento do Estabelecimento não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(estabelecimento.email)) throw new Error(`O campo E-mail do Estabelecimento não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(estabelecimento.nome)) throw new Error(`O campo Nome Completo do Estabelecimento não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(estabelecimento.nomeMae)) throw new Error(`O campo Nome da Mãe do Estabelecimento não é válido. Por favor, tente novamente.`)
	if (!await validarCampo(estabelecimento.sexo)) throw new Error(`O campo Sexo do Estabelecimento não é válido. Por favor, tente novamente.`)
}

/**
 * @param {json} data
 * @returns {Error/ErrorHandler/DataHandler}
 */
export async function criaRespostaSolicitarCartaoIdentificadoDeAcordoComCodigoDeResultado (data) {
	if (!await validarCampo(data)) throw new Error('O resultado de solicitação de cartão identificado não pode ser vazio ou nulo.')

	switch (data.ResultCode) {
	case 0:
		return new DataHandler(httpStatus.OK, 'Solicitação de Cartão Identificado realizada com sucesso.')
	case 1:
		return new ErrorHandler('Tarifa de endereço não encontrada', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 2:
		return new ErrorHandler('Tarifa de embossing não encontrada', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 3:
		return new ErrorHandler('Erro ao buscar o card pack', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 4:
		return new ErrorHandler('Erro card pack não encontrado', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 5:
		return new ErrorHandler('Erro ao buscar o card design', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 6:
		return new ErrorHandler('Erro card design não encontrado', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 7:
		return new ErrorHandler('Erro ao incluir a solicitação de cartão', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 8:
		return new ErrorHandler('Erro ao incluir a alocação da solicitação de cartão', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 9:
		return new ErrorHandler('Erro ao incluir o andamento da solicitação de cartão', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 10:
		return new ErrorHandler('Erro 4 linha de embossing inválida', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 11:
		return new ErrorHandler('Erro promoção não informada', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 12:
		return new ErrorHandler('Erro ao simular a promoção', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 13:
		return new ErrorHandler('Erro ao registrar a promoção', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 14:
		return new ErrorHandler('Erro carga acima permitido', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 15:
		return new ErrorHandler('Erro carga inválida para promoção amigo acesso', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 16:
		return new ErrorHandler('Erro consulta do desconto amigo acesso', httpStatus.BAD_REQUEST, true, data.ResultCode)
	case 17:
		return new ErrorHandler('Erro criação indicação amigo acesso', httpStatus.BAD_REQUEST, true, data.ResultCode)
	default:
		return new ErrorHandler('Não foi possível validar o código do resultado. Por favor, verifique todos seus dados.', httpStatus.BAD_REQUEST)
	}
}

/**
 * @description Realiza a validação dos dados (CPF, Tipo) do Estabelecimento
 * @param {json} estabelecimento
 * @returns se necessário, um Error
 */
export async function validaDadosCPFeTipoEstabelecimento (estabelecimento) {
	if (!await validarCampo(estabelecimento)) throw new Error(`Erro ao tentar buscar os dados do estabelecimento por ID.`)
	if (!await validarCampo(estabelecimento.cpf)) throw new Error(`O campo CPF do Estabelecimento está inválido.`)
	if (!await validarCampo(estabelecimento.tipo)) throw new Error(`O campo Tipo do Estabelecimento está inválido.`)
}

/**
 * @param {json} data
 * @returns {Error/ErrorHandler/DataHandler}
 */
export async function criaResponseConsultarCartoesComCodigoDeResultado (data) {
	if (!await validarCampo(data)) throw new Error('O resultado da consulta de cartões não pode ser vazio ou nulo.')

	switch (data.ResultCode) {
	case 0:
		return new DataHandler(httpStatus.OK, 'Consulta de Cartões realizada com sucesso.', { cartoes: data.Data })
	case 1:
		return new ErrorHandler('Erro ao realizar a consulta de cartões.', httpStatus.BAD_REQUEST, true, data.ResultCode)
	default:
		return new ErrorHandler('Não foi possível validar o código do resultado. Por favor, verifique todos seus dados.', httpStatus.BAD_REQUEST)
	}
}
