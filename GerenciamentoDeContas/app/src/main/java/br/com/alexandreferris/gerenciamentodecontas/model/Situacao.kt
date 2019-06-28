package br.com.alexandreferris.gerenciamentodecontas.model

data class SituacaoResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: List<Situacao>
)

data class Situacao (
    val id: Int,
    val descricao: String
)