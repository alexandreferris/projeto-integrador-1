package br.com.alexandreferris.gerenciamentodecontas.model

import com.squareup.moshi.Json

data class ContaDetalheResponse (
    val id: Int,
    val descricao: String,
    @Json(name = "valor_pagamento") val valorPagamento: String,
    val fixa: Boolean,
    @Json(name = "quantidade_parcelas") val quantidadeParcelas: Int,
    @Json(name = "id_usuario") val idUsuario: Int,
    @Json(name = "dia_cobranca") val diaCobranca: Int,
    @Json(name = "id_categoria") val idCategoria: Int,
    @Json(name = "valor_variavel") val valorVariavel: Boolean,
    val ativo: Boolean
)

data class ContaParam (
    val descricao: String,
    val valorPagamento: String,
    val fixa: Boolean,
    val quantidadeParcelas: Int,
    val idUsuario: Int,
    val diaCobranca: Int,
    val idCategoria: Int,
    val valorVariavel: Boolean
)

data class ContaResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: ConteudoContaResponse
)

data class ConteudoContaResponse (
    val contas: List<Conta>,
    val valorGasto: Double,
    val valorPago: Double
)

data class Conta (
    val descricaoConta: String,
    val quantidadeParcelas: Int,
    val idConta: Int,
    val numeroParcela: Int,
    val dataVencimento: String,
    val valorPago: Double,
    val idHistoricoConta: Int,
    val idCategoria: Int,
    val descricaoCategoria: String,
    val descricaoSituacaoConta: String,
    val valorVariavel: Boolean
)

data class ContaCancelarParam (
    val idConta: Int
)

data class ContaCancelarResponse (
    val status: Int,
    val mensagem: String
)

data class ContaPagarParam (
    val idHistoricoConta: Int,
    val valorVariavel: Boolean,
    val valorPago: Double?
)

data class ContaPagarResponse (
    val status: Int,
    val mensagem: String
)