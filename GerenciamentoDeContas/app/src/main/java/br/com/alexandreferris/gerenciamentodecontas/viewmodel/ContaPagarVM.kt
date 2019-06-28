package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.ContaPagarParam
import br.com.alexandreferris.gerenciamentodecontas.model.ContaPagarResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class ContaPagarVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val contaPaga = MutableLiveData<Boolean>()
    private val contaPagaError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getContaPaga(): LiveData<Boolean> {
        return contaPaga
    }

    fun getError(): LiveData<Boolean> {
        return contaPagaError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun pagarConta(contaPagarParam: ContaPagarParam) {
        loading.value = true

        disposable.add(networkApi.pagarConta(contaPagarParam)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<ContaPagarResponse>() {
                override fun onError(e: Throwable) {

                    contaPagaError.value = true
                    loading.value = false
                }

                override fun onSuccess(contaCancelarResponse: ContaPagarResponse) {
                    contaPagaError.value = false
                    loading.value = false

                    contaPaga.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}