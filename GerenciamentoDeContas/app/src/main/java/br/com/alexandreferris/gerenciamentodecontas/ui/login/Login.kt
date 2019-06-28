package br.com.alexandreferris.gerenciamentodecontas.ui.login

import android.arch.lifecycle.Observer
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.view.View
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.CadastroParam
import br.com.alexandreferris.gerenciamentodecontas.model.LoginParam
import br.com.alexandreferris.gerenciamentodecontas.ui.conta.Contas
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.LoginVM
import com.onesignal.OneSignal
import kotlinx.android.synthetic.main.login.*
import kotlinx.android.synthetic.main.login.loadingBar
import kotlinx.android.synthetic.main.login.textViewCadastro
import org.apache.commons.lang3.StringUtils
import java.util.*
import javax.inject.Inject

class Login : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var loginVM: LoginVM

    private lateinit var deviceIdOneSignal: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login)

        (application as App).appComponent.inject(this)

        configureUI()
        configurarObservers()
    }

    private fun configureUI() {
        if (Credentials.getUsuarioLoggedIn(this) !== null) {
            val screenContas = Intent(this, Contas::class.java)
            startActivity(screenContas)
            finish()
        }

        textViewCadastro.setOnClickListener(this)
        textViewEsqueciSenha.setOnClickListener(this)
        buttonEntrar.setOnClickListener(this)
    }

    private fun configurarObservers() {
        loginVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        loginVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutLogin, getString(R.string.erro_atencao, getString(R.string.erro_login)), Snackbar.LENGTH_LONG).show()
        })
        loginVM.getCadastro().observe(this, Observer {
            if (StringUtils.isNotEmpty(it!!)) {
                val sharedPreferences = getSharedPreferences(Credentials.SESSION_USUARIO, 0)
                sharedPreferences.edit().putString("SESSION_USUARIO_OBJ", it).apply()

                val screenContas = Intent(this, Contas::class.java)
                startActivity(screenContas)
            }
        })
    }

    private fun validarCampos() {
        if (StringUtils.isEmpty(textInputEditTextEmail.text))
            throw InputMismatchException(getString(R.string.erro_campo_email))
        if (StringUtils.isEmpty(textInputEditTextSenha.text))
            throw InputMismatchException(getString(R.string.erro_campo_senha))
    }

    private fun realizarLogin() {
        try {
            validarCampos()


            OneSignal.idsAvailable { userId, registrationId -> deviceIdOneSignal = userId }

            val cadastroJson = LoginParam(
                textInputEditTextEmail.text.toString(),
                textInputEditTextSenha.text.toString(),
                deviceIdOneSignal)

            loginVM.realizarLogin(cadastroJson)
        } catch (exception: InputMismatchException) {
            Snackbar.make(constraintLayoutLogin, getString(R.string.erro_atencao, exception.message), Snackbar.LENGTH_LONG).show()
        }
    }

    override fun onClick(view: View?) {
        when (view?.id) {
            R.id.buttonEntrar -> {
                realizarLogin()
            }
            R.id.textViewCadastro -> {
                val screenCadastro = Intent(this, Cadastro::class.java)
                startActivity(screenCadastro)
            }
            R.id.textViewEsqueciSenha -> {
                val screenEsqueciSenha = Intent(this, EsqueciSenha::class.java)
                startActivity(screenEsqueciSenha)
            }
        }
    }
}
