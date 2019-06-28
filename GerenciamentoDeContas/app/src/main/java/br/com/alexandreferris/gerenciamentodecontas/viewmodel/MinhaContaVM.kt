package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.MinhaContaParam
import br.com.alexandreferris.gerenciamentodecontas.model.MinhaContaResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class MinhaContaVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val salvouDados = MutableLiveData<Boolean>()
    private val salvouDadosLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getSalvarDados(): LiveData<Boolean> {
        return salvouDados
    }

    fun getError(): LiveData<Boolean> {
        return salvouDadosLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun realizarSalvarDados(minhaContaParam: MinhaContaParam) {
        loading.value = true
        disposable.add(networkApi.realizarSalvarDadosMinhaConta(minhaContaParam)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<MinhaContaResponse>() {
                override fun onError(e: Throwable) {

                    salvouDadosLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(minhaContaResponse: MinhaContaResponse) {
                    salvouDadosLoadError.value = false
                    loading.value = false
                    salvouDados.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}