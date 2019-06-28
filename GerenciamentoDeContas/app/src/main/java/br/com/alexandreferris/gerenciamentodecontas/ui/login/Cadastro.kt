package br.com.alexandreferris.gerenciamentodecontas.ui.login

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.view.View
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.CadastroVM
import kotlinx.android.synthetic.main.cadastro.*
import org.apache.commons.lang3.StringUtils
import java.util.*
import javax.inject.Inject
import android.arch.lifecycle.Observer
import br.com.alexandreferris.gerenciamentodecontas.model.CadastroParam

class Cadastro : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var cadastroVM: CadastroVM

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.cadastro)

        (application as App).appComponent.inject(this)

        configurarUI()
        configurarObservers()
    }

    private fun configurarUI() {
        buttonCadastrarSe.setOnClickListener(this)
    }

    private fun configurarObservers() {
        cadastroVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        cadastroVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutCadastro, getString(R.string.erro_atencao, getString(R.string.erro_cadastro)), Snackbar.LENGTH_LONG).show()
        })
        cadastroVM.getCadastro().observe(this, Observer {
            if (it!!) {
                val mySnackbar = Snackbar.make(
                    findViewById(R.id.constraintLayoutCadastro),
                    R.string.sucesso_cadastro, Snackbar.LENGTH_LONG
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
        if (StringUtils.isEmpty(textInputEditTextEmail.text))
            throw InputMismatchException(getString(R.string.erro_campo_email))
        if (StringUtils.isEmpty(textInputEditTextSenha.text))
            throw InputMismatchException(getString(R.string.erro_campo_senha))
        if (StringUtils.isEmpty(textInputEditTextConfirmarSenha.text))
            throw InputMismatchException(getString(R.string.erro_campo_confirmar_senha))
        if (textInputEditTextSenha.text!!.toString() != textInputEditTextConfirmarSenha.text!!.toString())
            throw InputMismatchException(getString(R.string.erro_campo_senhas_iguais))
    }

    private fun realizarCadastro() {
        try {
            validarCampos()

            val cadastroJson = CadastroParam(
                textInputEditTextNome.text.toString(),
                textInputEditTextEmail.text.toString(),
                textInputEditTextSenha.text.toString(),
                "12341234") // ARRUMAR DEVICE TOKEN COM ONESIGNAL

            cadastroVM.realizarCadastro(cadastroJson)
        } catch (exception: InputMismatchException) {
            Snackbar.make(constraintLayoutCadastro, getString(R.string.erro_atencao, exception.message), Snackbar.LENGTH_LONG).show()
        }
    }

    override fun onClick(view: View?) {
        when (view?.id) {
            R.id.buttonCadastrarSe -> {
                realizarCadastro()
            }
        }
    }
}
