package br.com.alexandreferris.gerenciamentodecontas.model

import com.squareup.moshi.Json

data class Usuario (
    val id: Int,
    val nome: String,
    val email: String,
    val senha: String,
    @Json(name = "criado_em") val criadoEm: String,
    @Json(name = "device_token") val deviceToken: String
)

data class MinhaContaParam (
    val id: Int?,
    val email: String?,
    val nome: String,
    val senha: String,
    val senhaNova: String,
    val senhaNovaConfirmar: String
)

data class MinhaContaResponse (
    val status: String,
    val mensagem: String
)