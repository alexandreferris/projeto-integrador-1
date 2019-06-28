package br.com.alexandreferris.gerenciamentodecontas.di

import br.com.alexandreferris.gerenciamentodecontas.ui.conta.ContaDetalhe
import br.com.alexandreferris.gerenciamentodecontas.ui.conta.Contas
import br.com.alexandreferris.gerenciamentodecontas.ui.login.Cadastro
import br.com.alexandreferris.gerenciamentodecontas.ui.login.EsqueciSenha
import br.com.alexandreferris.gerenciamentodecontas.ui.login.Login
import br.com.alexandreferris.gerenciamentodecontas.ui.login.MinhaConta
import br.com.alexandreferris.gerenciamentodecontas.ui.relatorio.Relatorio
import dagger.Component
import javax.inject.Singleton

@Singleton
@Component(modules = [AppModule::class, NetworkModule::class])
interface AppComponent {
    fun inject(target: Login)
    fun inject(target: Cadastro)
    fun inject(target: ContaDetalhe)
    fun inject(target: Contas)
    fun inject(target: MinhaConta)
    fun inject(target: Relatorio)
    fun inject(target: EsqueciSenha)
}