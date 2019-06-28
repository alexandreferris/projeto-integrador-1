package br.com.alexandreferris.gerenciamentodecontas.model

data class CategoriaResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: List<Categoria>
)

data class Categoria (
    val id: Int,
    val descricao: String
)