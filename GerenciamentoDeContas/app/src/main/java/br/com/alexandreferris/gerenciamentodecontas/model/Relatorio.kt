package br.com.alexandreferris.gerenciamentodecontas.model

data class RelatorioContasResponse (
    val status: Int,
    val mensagem: String,
    val conteudo: List<ContaRelatorio>
)

data class ContaRelatorio (
    val id: Int,
    val descricao: String,
    val numeroParcela: Int,
    val valorPago: Double,
    val nome: String,
    val deviceToken: String,
    val dataVencimento: String,
    val situacaoDescricao: String
)