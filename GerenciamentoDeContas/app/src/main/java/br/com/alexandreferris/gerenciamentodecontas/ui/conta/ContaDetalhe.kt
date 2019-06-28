package br.com.alexandreferris.gerenciamentodecontas.ui.conta

import android.arch.lifecycle.Observer
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.content.LocalBroadcastManager
import android.util.Log
import android.view.View
import android.widget.ArrayAdapter
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.*
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.MoneyTextWatcher
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.limpaFormatoDinheiro
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.CategoriaVM
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.ContaDetalheVM
import kotlinx.android.synthetic.main.conta_detalhe.*
import org.apache.commons.lang3.StringUtils
import org.apache.commons.lang3.math.NumberUtils
import org.json.JSONObject
import java.util.*
import javax.inject.Inject
import kotlin.collections.ArrayList

class ContaDetalhe : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var contaDetalheVM: ContaDetalheVM

    @Inject
    lateinit var categoriaVM: CategoriaVM

    private var usuario: LoginData? = null

    private var arrayListCategorias: List<Categoria> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.conta_detalhe)

        (application as App).appComponent.inject(this)

        configurarUI()
        configurarObservers()
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

    private fun configurarUI() {
        usuario = Credentials.getUsuarioLoggedIn(this)

        buttonSalvar.setOnClickListener(this)
        checkboxValorVariavel.setOnCheckedChangeListener { buttonView, isChecked ->
            textInputEditTextValorPagamento.isEnabled = true
            if (isChecked) {
                textInputEditTextValorPagamento.text?.clear()
                textInputEditTextValorPagamento.isEnabled = false
            }
        }
        checkboxContaFixa.setOnCheckedChangeListener { buttonView, isChecked ->
            textInputEditTextQuantidadeParcelas.isEnabled = true
            if (isChecked) {
                textInputEditTextQuantidadeParcelas.text?.clear()
                textInputEditTextQuantidadeParcelas.isEnabled = false
            }
        }

        textInputEditTextValorPagamento.addTextChangedListener(MoneyTextWatcher(textInputEditTextValorPagamento))
    }

    private fun configurarObservers() {
        categoriaVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        categoriaVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutContaDetalhe, getString(R.string.erro_atencao, getString(R.string.erro_categorias)), Snackbar.LENGTH_LONG).show()
        })
        categoriaVM.getCategorias().observe(this, Observer {
            if (it!!.isNotEmpty()) {
                arrayListCategorias = it
                val categoriaArrayList = ArrayList<String>()
                categoriaArrayList.add("Selecione uma Categoria")
                for (categoria: Categoria in it) {
                    categoriaArrayList.add(categoria.descricao)
                }
                val arrayAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, categoriaArrayList)
                // Set layout to use when the list of choices appear
                arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                // Set Adapter to Spinner
                spinnerCategoria.adapter = arrayAdapter
            }
        })

        contaDetalheVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        contaDetalheVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(constraintLayoutContaDetalhe, getString(R.string.erro_atencao, getString(R.string.erro_salvar_conta)), Snackbar.LENGTH_LONG).show()
        })
        contaDetalheVM.getContaSalva().observe(this, Observer {
            if (it!!) {
                val mySnackbar = Snackbar.make(
                    findViewById(R.id.constraintLayoutContaDetalhe),
                    R.string.sucesso_salvar_conta, Snackbar.LENGTH_LONG
                )
                mySnackbar.setAction("Fechar") {
                    setResult(RESULT_OK, null)
                    finish()
                }
                mySnackbar.show()
            }
        })

        // Busca as categorias
        categoriaVM.listarCategorias()
    }

    private fun validarCampos() {
        if (StringUtils.isEmpty(textInputEditTextDescricao.text))
            throw InputMismatchException(getString(R.string.erro_campo_descricao))
        if (!checkboxValorVariavel.isChecked) {
            if (StringUtils.isEmpty(textInputEditTextValorPagamento.text))
                throw InputMismatchException(getString(R.string.erro_campo_valor_pagamento))
        }
        if (!checkboxContaFixa.isChecked) {
            if (StringUtils.isEmpty(textInputEditTextQuantidadeParcelas.text) || textInputEditTextQuantidadeParcelas.text.toString().toInt() == NumberUtils.INTEGER_ZERO)
                throw InputMismatchException(getString(R.string.erro_campo_quantidade_parcelas))
        }
        if (spinnerDiaCobranca.selectedItemPosition == NumberUtils.INTEGER_ZERO)
            throw InputMismatchException(getString(R.string.erro_campo_dia_cobranca))
        if (spinnerCategoria.count > 0 && spinnerCategoria.selectedItemPosition == NumberUtils.INTEGER_ZERO)
            throw InputMismatchException(getString(R.string.erro_campo_categoria))
    }

    private fun realizarInserirConta() {
        try {
            validarCampos()

            val contaParam = ContaParam(
                textInputEditTextDescricao.text.toString(),
                textInputEditTextValorPagamento.text.toString().limpaFormatoDinheiro(),
                checkboxContaFixa.isChecked,
                if (textInputEditTextQuantidadeParcelas.text.toString().length > 0 ) textInputEditTextQuantidadeParcelas.text.toString().toInt() else 0,
                usuario?.id!!,
                spinnerDiaCobranca.selectedItem.toString().toInt(),
                arrayListCategorias.get(spinnerCategoria.selectedItemPosition - 1).id,
                checkboxValorVariavel.isChecked
            )

            contaDetalheVM.inserirConta(contaParam)
        } catch (exception: InputMismatchException) {
            Snackbar.make(constraintLayoutContaDetalhe, getString(R.string.erro_atencao, exception.message), Snackbar.LENGTH_LONG).show()
        }
    }

    override fun onClick(view: View?) {
        when (view?.id) {
            R.id.buttonSalvar -> {
                realizarInserirConta()
            }
        }
    }
}