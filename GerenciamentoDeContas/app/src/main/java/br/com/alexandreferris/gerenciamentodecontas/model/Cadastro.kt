package br.com.alexandreferris.gerenciamentodecontas.model

data class CadastroResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: CadastroData
)

data class CadastroData (
    val id: Int,
    val nome: String,
    val email: String,
    val senha: String,
    val criadoEm: String,
    val deviceToken: String
)

data class CadastroParam (
    val nome: String,
    val email: String,
    val senha: String,
    val deviceToken: String
)