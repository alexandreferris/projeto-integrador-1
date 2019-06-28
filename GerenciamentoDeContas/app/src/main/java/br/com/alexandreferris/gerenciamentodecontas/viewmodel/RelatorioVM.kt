package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import android.util.Log
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.ContaRelatorio
import br.com.alexandreferris.gerenciamentodecontas.model.RelatorioContasResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class RelatorioVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val contas = MutableLiveData<List<ContaRelatorio>>()
    private val contasLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getContas(): LiveData<List<ContaRelatorio>> {
        return contas
    }

    fun getError(): LiveData<Boolean> {
        return contasLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun listarContas(dataInicio: String?, dataFim: String?, idSituacao: Int?, idUsuario: Int) {
        loading.value = true
        disposable.add(networkApi.listarRelatorioContas(dataInicio, dataFim, idSituacao, idUsuario)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<RelatorioContasResponse>() {
                override fun onError(e: Throwable) {

                    contasLoadError.value = true
                    loading.value = false

                    Log.i("TESTE_RELLL", e.message)
                }

                override fun onSuccess(contaResponse: RelatorioContasResponse) {
                    contasLoadError.value = false
                    loading.value = false

                    contas.value = contaResponse.conteudo
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}