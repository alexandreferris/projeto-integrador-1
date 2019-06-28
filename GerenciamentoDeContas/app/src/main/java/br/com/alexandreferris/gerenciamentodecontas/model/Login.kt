package br.com.alexandreferris.gerenciamentodecontas.model

import com.squareup.moshi.Json

data class LoginResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: LoginData
)

data class LoginData (
    val id: Int,
    val nome: String,
    val email: String,
    @Json(name = "device_token") val deviceToken: String
)

data class LoginParam (
    val email: String,
    val senha: String,
    val deviceToken: String
)