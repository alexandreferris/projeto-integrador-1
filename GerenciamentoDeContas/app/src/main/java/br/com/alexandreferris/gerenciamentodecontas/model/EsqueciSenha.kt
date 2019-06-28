package br.com.alexandreferris.gerenciamentodecontas.model

data class EsqueciSenhaParam (
    val email: String
)

data class EsqueciSenhaResponse (
    val status: Int,
    val mensagem: String
)