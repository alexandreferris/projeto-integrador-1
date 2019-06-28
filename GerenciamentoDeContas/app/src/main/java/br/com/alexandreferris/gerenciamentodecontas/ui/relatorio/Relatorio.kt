package br.com.alexandreferris.gerenciamentodecontas.ui.relatorio

import android.arch.lifecycle.Observer
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.widget.LinearLayoutManager
import android.view.View
import android.widget.ArrayAdapter
import br.com.alexandreferris.gerenciamentodecontas.App
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.LoginData
import br.com.alexandreferris.gerenciamentodecontas.model.Situacao
import br.com.alexandreferris.gerenciamentodecontas.utils.FunctionsHelper
import br.com.alexandreferris.gerenciamentodecontas.utils.adapter.ContasRelatorioAdapter
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarData
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.removerFormatoData
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.RelatorioVM
import br.com.alexandreferris.gerenciamentodecontas.viewmodel.SituacaoVM
import kotlinx.android.synthetic.main.relatorio.*
import kotlinx.android.synthetic.main.relatorio.loadingBar
import org.apache.commons.lang3.StringUtils
import java.util.*
import javax.inject.Inject
import kotlin.collections.ArrayList

class Relatorio : AppCompatActivity(), View.OnClickListener {

    @Inject
    lateinit var relatorioVM: RelatorioVM

    @Inject
    lateinit var situacaoVM: SituacaoVM

    private var usuario: LoginData? = null

    private var arrayListSituacoes: List<Situacao> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.relatorio)

        (application as App).appComponent.inject(this)

        configureUI()
        configureObserverSituacao()
        configureObserverRelatorio()
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

    private fun configureUI() {
        usuario = Credentials.getUsuarioLoggedIn(this)

        editTextDataInicio.addTextChangedListener(FunctionsHelper.handleMask(editTextDataInicio, "NN/NN/NNNN"))
        editTextDataFim.addTextChangedListener(FunctionsHelper.handleMask(editTextDataFim, "NN/NN/NNNN"))
        buttonBuscar.setOnClickListener(this)
    }

    private fun configureObserverSituacao() {
        situacaoVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        situacaoVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(contraintLayoutRelatorio, getString(R.string.erro_atencao, getString(R.string.erro_situacoes)), Snackbar.LENGTH_LONG).show()
        })
        situacaoVM.getSituacoes().observe(this, Observer {
            if (it!!.isNotEmpty()) {
                arrayListSituacoes = it
                val situacaoArrayList = ArrayList<String>()
                situacaoArrayList.add("Selecione uma Situação")
                for (situacao: Situacao in it) {
                    situacaoArrayList.add(situacao.descricao)
                }
                val arrayAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, situacaoArrayList)
                // Set layout to use when the list of choices appear
                arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                // Set Adapter to Spinner
                spinnerSituacao.adapter = arrayAdapter
            }
        })

        situacaoVM.listarSituacoes()
    }

    private fun configureObserverRelatorio() {
        relatorioVM.getLoading().observe(this, Observer {
            loadingBar.visibility = if (it!!) View.VISIBLE else View.GONE
        })
        relatorioVM.getError().observe(this, Observer {
            if (it!!)
                Snackbar.make(contraintLayoutRelatorio, getString(R.string.erro_atencao, getString(R.string.erro_buscar_relatorio)), Snackbar.LENGTH_LONG).show()
        })
        relatorioVM.getContas().observe(this, Observer {
            if (it!!.isNotEmpty()) {
                recyclerViewRelatorioContas.visibility = View.VISIBLE
                textViewRealizarBusca.visibility = View.GONE
                textViewBuscaSemResultado.visibility = View.GONE

                val linearLayoutManager = LinearLayoutManager(this)
                recyclerViewRelatorioContas.layoutManager = linearLayoutManager

                val contasAdapter = ContasRelatorioAdapter(this) { idConta ->

                }
                contasAdapter.setContas(it)
                recyclerViewRelatorioContas.adapter = contasAdapter
            } else {
                recyclerViewRelatorioContas.visibility = View.GONE
                textViewRealizarBusca.visibility = View.GONE
                textViewBuscaSemResultado.visibility = View.VISIBLE
            }
        })
    }

    override fun onClick(view: View?) {
        if (view?.id == R.id.buttonBuscar) {
            try {
                if (!StringUtils.isEmpty(editTextDataInicio.text.toString()) || !StringUtils.isEmpty(editTextDataFim.text.toString())) {
                    if (StringUtils.isEmpty(editTextDataInicio.text.toString()))
                        throw InputMismatchException("Você deve preencher uma data de início.")
                    if (StringUtils.isEmpty(editTextDataFim.text.toString()))
                        throw InputMismatchException("Você deve preencher uma data final.")
                }

                val dataInicio: String? = if (StringUtils.isEmpty(editTextDataInicio.text)) null else editTextDataInicio.text.toString().removerFormatoData()
                val dataFim: String? = if (StringUtils.isEmpty(editTextDataFim.text)) null else editTextDataFim.text.toString().removerFormatoData()
                var situacao: Int? = null
                if (spinnerSituacao.selectedItemPosition > 0) {
                    situacao = arrayListSituacoes.get(spinnerSituacao.selectedItemPosition - 1).id
                }


                relatorioVM.listarContas(
                    dataInicio = dataInicio,
                    dataFim = dataFim,
                    idSituacao = situacao,
                    idUsuario = usuario!!.id
                )
            } catch (inputMismatchException: InputMismatchException) {
                Snackbar.make(contraintLayoutRelatorio, getString(R.string.erro_atencao, inputMismatchException.message), Snackbar.LENGTH_LONG).show()
            }
        }
    }
}
