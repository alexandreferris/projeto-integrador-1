package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import android.util.Log
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.ContaDetalheResponse
import br.com.alexandreferris.gerenciamentodecontas.model.ContaParam
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class ContaDetalheVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val contaSalva = MutableLiveData<Boolean>()
    private val contaSalvaError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getContaSalva(): LiveData<Boolean> {
        return contaSalva
    }

    fun getError(): LiveData<Boolean> {
        return contaSalvaError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun inserirConta(contaDetalheParam: ContaParam) {
        loading.value = true
        Log.i("TESTE_VALLL_01", contaDetalheParam.valorPagamento)
        disposable.add(networkApi.inserirConta(contaDetalheParam)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<ContaDetalheResponse>() {
                override fun onError(e: Throwable) {

                    contaSalvaError.value = true
                    loading.value = false
                }

                override fun onSuccess(contaDetalheResponse: ContaDetalheResponse) {
                    contaSalvaError.value = false
                    loading.value = false

                    contaSalva.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}