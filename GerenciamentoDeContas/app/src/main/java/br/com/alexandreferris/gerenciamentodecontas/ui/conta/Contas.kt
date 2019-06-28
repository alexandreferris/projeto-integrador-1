package br.com.alexandreferris.gerenciamentodecontas.ui.conta

import android.app.Activity
import android.arch.lifecycle.Observer
import android.content.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import br.com.alexandreferris.gerenciamentodecontas.R
import android.support.v4.widget.DrawerLayout
import android.support.v7.app.ActionBarDrawerToggle
import android.support.v4.view.GravityCompat
import android.support.design.widget.Snackbar
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.app.AlertDialog
import android.support.v7.widget.LinearLayoutManager
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.model.Conta
import br.com.alexandreferris.gerenciamentodecontas.model.ContaPagarParam
import br.com.alexandreferris.gerenciamentodecontas.model.LoginData
import br.com.alexandreferris.gerenciamentodecontas.ui.login.Login
import br.com.alexandreferris.gerenciamentodecontas.ui.login.MinhaConta
import br.com.alexandreferris.gerenciamentodecontas.ui.relatorio.Relatorio
import br.com.alexandreferris.gerenciamentodecontas.utils.adapter.ContasAdapter
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarCurrency
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.limpaFormatoDinheiro
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.ContaCancelarVM
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.ContaPagarVM
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.ContasVM
import kotlinx.android.synthetic.main.conta_detalhe.*
import kotlinx.android.synthetic.main.contas.*
import kotlinx.android.synthetic.main.contas.loadingBar
import org.apache.commons.lang3.StringUtils
import org.json.JSONException
import org.json.JSONObject
import java.lang.Double
import java.util.*
import javax.inject.Inject

class Contas : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var contasVM: ContasVM

    @Inject
    lateinit var contaCancelarVM: ContaCancelarVM

    @Inject
    lateinit var contaPagarVM: ContaPagarVM

    // Side Menu Navigation Drawer
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var drawerToggle: ActionBarDrawerToggle

    private var usuario: LoginData? = null
    private val REQUEST_CODE_INSERIR_CONTA: Int = 9998
    private lateinit var contasAdapter: ContasAdapter
    private lateinit var context: Context

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.contas)

        (application as App).appComponent.inject(this)
        context = this

        setToolbarMenu()
        configureUI()
        configureObservers()
        configureObserversCancelarConta()
        configureObserversPagarConta()
        contasVM.listarContas(usuario!!.id)
        configurarBroadcastLogout()
    }

    private fun configurarBroadcastLogout() {
        // Register mMessageReceiver to receive messages.
        LocalBroadcastManager.getInstance(this).registerReceiver(mMessageReceiver, IntentFilter(Credentials.SESSION_USUARIO_LOGOUT))
    }

    private val mMessageReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            finish()
        }
    }

    override fun onDestroy() {
        // Unregister since the activity is not visible
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mMessageReceiver)
        super.onDestroy()
    }

    private fun setToolbarMenu() {

        toolbar.title = "Minhas Contas"

        // Setting up Drawer
        drawerToggle = ActionBarDrawerToggle(
            this,
            activity_container,
            toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )
        activity_container.setDrawerListener(drawerToggle)
        drawerToggle.syncState()

        // Side Menu/Navigaton
        navigationView.setNavigationItemSelectedListener { menuItem ->
            var proximaTela: Intent? = null

            when (menuItem.itemId) {
                R.id.nav_sair -> {
                    // Desloga o usuário do sistema e envia para a tela de Login
                    val sharedPreferences = this.getSharedPreferences(Credentials.SESSION_USUARIO, 0)
                    val editor = sharedPreferences.edit()
                    editor.clear()
                    editor.apply()

                    //send the broadcast to all activities who are listening
                    val intentUserLogout = Intent(Credentials.SESSION_USUARIO_LOGOUT)
                    LocalBroadcastManager.getInstance(this).sendBroadcast(intentUserLogout)

                    // Starts Login Activity
                    val telaLogin = Intent(this, Login::class.java)
                    telaLogin.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    startActivity(telaLogin)
                }
                R.id.nav_minha_conta -> {
                    proximaTela = Intent(this, MinhaConta::class.java)
                }
                R.id.nav_relatorios -> {
                    proximaTela = Intent(this, Relatorio::class.java)
                }
            }

            if (proximaTela !== null) {
                startActivity(proximaTela)
            }

            activity_container.closeDrawer(GravityCompat.START)

            return@setNavigationItemSelectedListener true
        }
    }

    private fun configureUI() {
        usuario = Credentials.getUsuarioLoggedIn(this)

        floatingActionButtonInserirConta.setOnClickListener(this)
    }

    private fun configureObservers() {
        contasVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        contasVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutContas, getString(R.string.erro_atencao, getString(R.string.erro_carregar_contas)), Snackbar.LENGTH_LONG).show()
        })
        contasVM.getContas().observe(this, Observer {
            textViewValorGasto.text = getString(R.string.texto_valor_gasto, it?.valorGasto?.formatarCurrency())
            textViewValorPago.text = getString(R.string.texto_valor_pago, it?.valorPago?.formatarCurrency())
            displayContas(it!!.contas)
        })
    }

    private fun configureObserversCancelarConta() {
        contaCancelarVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        contaCancelarVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutContas, getString(R.string.erro_atencao, getString(R.string.erro_cancelar_conta)), Snackbar.LENGTH_LONG).show()
        })
        contaCancelarVM.getContaCancelada().observe(this, Observer {
            if (it!!) {
                contasVM.listarContas(usuario!!.id)
            }
        })
    }

    private fun configureObserversPagarConta() {
        contaPagarVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        contaPagarVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutContas, getString(R.string.erro_atencao, getString(R.string.erro_pagar_conta)), Snackbar.LENGTH_LONG).show()
        })
        contaPagarVM.getContaPaga().observe(this, Observer {
            if (it!!) {
                contasVM.listarContas(usuario!!.id)
            }
        })
    }

    private fun displayContas(contas: List<Conta>) {
        val linearLayoutManager = LinearLayoutManager(this)
        recyclerViewContas.layoutManager = linearLayoutManager

        contasAdapter = ContasAdapter(this) { position, contaId, delete ->
            if (delete) {
                // Cancelar Conta
                var dialog: AlertDialog? = null
                val builder: AlertDialog.Builder = AlertDialog.Builder(this)

                builder.setTitle(R.string.cancelar_conta_titulo)
                builder.setMessage(R.string.cancelar_conta_mensagem)

                // Buttons
                builder.setPositiveButton(R.string.cancelar_conta) { _, _ ->
                    dialog?.dismiss()
                    // Cancelar a conta
                    contaCancelarVM.cancelarConta(contaId)
                }

                builder.setNegativeButton(R.string.cancelar_conta_nao) { _, _ ->
                    dialog?.dismiss()
                }

                dialog = builder.create()
                dialog.show()
            } else {
                // Pagar Conta
                val contaSelecionada = contasAdapter.getItem(position)
                if (!StringUtils.equals(contaSelecionada.descricaoSituacaoConta, "PAGO"))
                    mostrarAlertaPagarConta(contaSelecionada)
            }
        }
        contasAdapter.setContas(contas)
        recyclerViewContas.adapter = contasAdapter
    }

    override fun onClick(view: View?) {
        when (view?.id) {
            R.id.floatingActionButtonInserirConta -> {
                val screenInserirConta = Intent(this, ContaDetalhe::class.java)
                startActivityForResult(screenInserirConta, REQUEST_CODE_INSERIR_CONTA)
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (resultCode == Activity.RESULT_OK) {
            if (requestCode ==  REQUEST_CODE_INSERIR_CONTA) {
                contasVM.listarContas(usuario!!.id)
            }
        }
    }

    private fun mostrarAlertaPagarConta(conta: Conta) {

        val li = LayoutInflater.from(context)

        val promptsView = li.inflate(R.layout.alerta_pagar_conta, null)

        val alertDialogBuilder = AlertDialog.Builder(context, R.style.AlertDialogTheme)
        alertDialogBuilder.setView(promptsView)

        // create alert dialog
        val alertDialogPagarConta = alertDialogBuilder.create()
        alertDialogPagarConta.setTitle(R.string.pagar_conta_titulo)
        alertDialogPagarConta.setMessage(getString(R.string.pagar_conta_mensagem))

        // Instancia campos do alerta
        val textViewValorPagamento = promptsView.findViewById(R.id.textViewValorPagamento) as TextView
        val editTextValorPagamento = promptsView.findViewById(R.id.editTextValorPagamento) as EditText
        val buttonPagarConfirmar = promptsView.findViewById(R.id.buttonPagarConfirmar) as Button
        val buttonPagarNao = promptsView.findViewById(R.id.buttonPagarNao) as Button

        if (!conta.valorVariavel) {
            textViewValorPagamento.visibility = View.GONE
            editTextValorPagamento.visibility = View.GONE
        }

        // Buttons
        buttonPagarConfirmar.setOnClickListener {
            alertDialogPagarConta?.dismiss()
            // Pagar a conta
            try {
                var valorPagamento = 0.0

                if (conta.valorVariavel) {
                    if (StringUtils.isEmpty(textInputEditTextValorPagamento.text))
                        throw InputMismatchException(getString(R.string.erro_campo_valor_pagamento))
                    valorPagamento = Double.parseDouble(editTextValorPagamento.text.toString().limpaFormatoDinheiro())
                }

                val contaPagarParam = ContaPagarParam(
                    conta.idHistoricoConta,
                    conta.valorVariavel,
                    valorPagamento
                )
                contaPagarVM.pagarConta(contaPagarParam)
            } catch (inputMismatchException: InputMismatchException) {
                alertDialogPagarConta?.dismiss()
                Snackbar.make(constraintLayoutContas, getString(R.string.erro_atencao, inputMismatchException.message), Snackbar.LENGTH_LONG).show()
            }
        }

        buttonPagarNao.setOnClickListener {
            alertDialogPagarConta?.dismiss()
        }

        // show it
        alertDialogPagarConta.show()
    }
}
