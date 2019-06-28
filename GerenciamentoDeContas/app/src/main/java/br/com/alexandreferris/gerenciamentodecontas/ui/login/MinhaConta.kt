package br.com.alexandreferris.gerenciamentodecontas.ui.login

import android.arch.lifecycle.Observer
import android.content.Context
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.view.ContextMenu
import android.view.View
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.LoginData
import br.com.alexandreferris.gerenciamentodecontas.model.MinhaContaParam
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.MinhaContaVM
import kotlinx.android.synthetic.main.minha_conta.*
import kotlinx.android.synthetic.main.minha_conta.loadingBar
import kotlinx.android.synthetic.main.minha_conta.textInputEditTextEmail
import kotlinx.android.synthetic.main.minha_conta.textInputEditTextNome
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import java.util.*
import javax.inject.Inject

class MinhaConta : AppCompatActivity(), View.OnClickListener {

    private var usuario: LoginData? = null

    @Inject
    lateinit var minhaContaVM: MinhaContaVM

    private lateinit var context: Context

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.minha_conta)

        (application as App).appComponent.inject(this)

        configureUI()
        buttonSalvar.setOnClickListener(this)
        configureObservers()
    }

    private fun configureUI() {
        context = this
        usuario = Credentials.getUsuarioLoggedIn(this)

        textInputEditTextEmail.setText(usuario?.email)
        textInputEditTextNome.setText(usuario?.nome)
    }

    private fun configureObservers() {
        minhaContaVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        minhaContaVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutMinhaConta, getString(R.string.erro_atencao, getString(R.string.erro_salvar_dados_minha_conta)), Snackbar.LENGTH_LONG).show()
        })
        minhaContaVM.getSalvarDados().observe(this, Observer {
            if (it!!) {
                // Salvar dados na sessão do usuario
                val sharedPreferences = context.getSharedPreferences(Credentials.SESSION_USUARIO, 0)
                val usuarioJson = sharedPreferences.getString("SESSION_USUARIO_OBJ", null)


                if (usuarioJson != null) {
                    val json = JSONObject(usuarioJson)
                    json.put("nome", textInputEditTextNome.text.toString())

                    val sharedPreferences = getSharedPreferences(Credentials.SESSION_USUARIO, 0)
                    sharedPreferences.edit().putString("SESSION_USUARIO_OBJ", json.toString()).apply()

                    configureUI()
                }

                // Mostra mensagem de sucesso
                val mySnackbar = Snackbar.make(
                    findViewById(R.id.constraintLayoutMinhaConta),
                    R.string.sucesso_salvar_dados_minha_conta, Snackbar.LENGTH_LONG
                )
                mySnackbar.setAction("Fechar") {
                    finish()
                }
                mySnackbar.show()
            }
        })
    }

    private fun validarCampos() {
        if (StringUtils.isEmpty(textInputEditTextNome.text))
            throw InputMismatchException(getString(R.string.erro_campo_nome))
        if (StringUtils.isEmpty(textInputEditTextSenhaAtual.text))
            throw InputMismatchException(getString(R.string.erro_campo_senha_atual))

        if (!StringUtils.isEmpty(textInputEditTextSenhaNova.text) || !StringUtils.isEmpty(textInputEditTextSenhaNovaConfirmar.text)) {
            if (StringUtils.isEmpty(textInputEditTextSenhaNova.text))
                throw InputMismatchException(getString(R.string.erro_campo_senha_nova))
            if (StringUtils.isEmpty(textInputEditTextSenhaNovaConfirmar.text))
                throw InputMismatchException(getString(R.string.erro_campo_confirmar_senha_nova))
            if (textInputEditTextSenhaNova.text!!.toString() != textInputEditTextSenhaNovaConfirmar.text!!.toString())
                throw InputMismatchException(getString(R.string.erro_campo_senhas_iguais))
        }
    }

    private fun realizarSalvarDados() {
        try {
            validarCampos()

            val cadastroJson = MinhaContaParam(
                usuario?.id,
                usuario?.email,
                textInputEditTextNome.text.toString(),
                textInputEditTextSenhaAtual.text.toString(),
                textInputEditTextSenhaNova.text.toString(),
                textInputEditTextSenhaNovaConfirmar.text.toString())

            minhaContaVM.realizarSalvarDados(cadastroJson)
        } catch (exception: InputMismatchException) {
            Snackbar.make(constraintLayoutMinhaConta, getString(R.string.erro_atencao, exception.message), Snackbar.LENGTH_LONG).show()
        }
    }

    override fun onClick(view: View?) {
        if (view?.id == R.id.buttonSalvar) {
            realizarSalvarDados()
        }
    }
}
