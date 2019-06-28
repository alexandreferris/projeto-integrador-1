package br.com.alexandreferris.gerenciamentodecontas.ui.login

import android.arch.lifecycle.Observer
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.view.View
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.EsqueciSenhaParam
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.EsqueciSenhaVM
import kotlinx.android.synthetic.main.esqueci_senha.*
import kotlinx.android.synthetic.main.esqueci_senha.loadingBar
import kotlinx.android.synthetic.main.esqueci_senha.textInputEditTextEmail
import org.apache.commons.lang3.StringUtils
import java.util.*
import javax.inject.Inject

class EsqueciSenha : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var esqueciSenhaVM: EsqueciSenhaVM

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.esqueci_senha)

        (application as App).appComponent.inject(this)

        configureUI()
        configureObservers()
    }

    private fun configureUI() {
        buttonRecuperarSenha.setOnClickListener(this)
    }

    private fun configureObservers() {
        esqueciSenhaVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        esqueciSenhaVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutEsqueciSenha, getString(R.string.erro_atencao, getString(R.string.erro_cadastro)), Snackbar.LENGTH_LONG).show()
        })
        esqueciSenhaVM.getRecuperouSenha().observe(this, Observer {
            if (it!!) {
                val mySnackbar = Snackbar.make(
                    constraintLayoutEsqueciSenha,
                    R.string.sucesso_recuperar_senha, Snackbar.LENGTH_LONG
                )
                mySnackbar.setAction("Fechar") {
                    finish()
                }
                mySnackbar.show()
            }
        })
    }

    private fun recuperarSenha() {
        try {
            if (StringUtils.isEmpty(textInputEditTextEmail.text.toString()))
                throw InputMismatchException(getString(R.string.erro_atencao, getString(R.string.erro_campo_email)))

            val esqueciSenhaParam = EsqueciSenhaParam(textInputEditTextEmail.text.toString())

            esqueciSenhaVM.realizarRecuperarSenha(esqueciSenhaParam)
        } catch (inputMismatchException: InputMismatchException) {
            Snackbar.make(constraintLayoutEsqueciSenha, getString(R.string.erro_atencao, getString(R.string.erro_recuperar_senha)), Snackbar.LENGTH_LONG).show()
        }
    }

    override fun onClick(view: View?) {
        if (view?.id == R.id.buttonRecuperarSenha) {
            recuperarSenha()
        }
    }
}
