package br.com.alexandreferris.gerenciamentodecontas.data.remote

import br.com.alexandreferris.gerenciamentodecontas.model.*
import io.reactivex.Single
import retrofit2.http.*

interface GCApi {

    @POST("usuario/cadastrar")
    fun realizarCadastro(@Body jsonObject: CadastroParam): Single<CadastroResponse>

    @POST("usuario/logar")
    fun realizarLogin(@Body jsonObject: LoginParam): Single<LoginResponse>

    @POST("conta/cadastrar")
    fun inserirConta(@Body jsonObject: ContaParam): Single<ContaDetalheResponse>

    @GET("categoria/listar/todos/")
    fun listarCategorias(): Single<CategoriaResponse>

    @GET("conta/buscar/mes/{idUsuario}/{dataInicio}/{dataFim}")
    fun listarContas(
        @Path("idUsuario") idUsuario: Int,
        @Path("dataInicio") dataInicio: String,
        @Path("dataFim") dataFim: String
    ): Single<ContaResponse>

    @PUT("conta/cancelar/conta")
    fun cancelarConta(@Body jsonObject: ContaCancelarParam): Single<ContaCancelarResponse>

    @PUT("usuario/atualiza")
    fun realizarSalvarDadosMinhaConta(@Body jsonObject: MinhaContaParam): Single<MinhaContaResponse>

    @GET("conta/relatorio")
    fun listarRelatorioContas(
        @Query("dataInicio") dataInicio: String?,
        @Query("dataFim") dataFim: String?,
        @Query("idSituacao") idSituacao: Int?,
        @Query("idUsuario") idUsuario: Int): Single<RelatorioContasResponse>

    @GET("situacao/listar/todos")
    fun listarSituacoes(): Single<SituacaoResponse>

    @POST("usuario/esqueci/senha")
    fun realizarRecuperarSenha(@Body jsonObject: EsqueciSenhaParam): Single<EsqueciSenhaResponse>

    @PUT("conta/pagar/conta")
    fun pagarConta(@Body jsonObject: ContaPagarParam): Single<ContaPagarResponse>
}