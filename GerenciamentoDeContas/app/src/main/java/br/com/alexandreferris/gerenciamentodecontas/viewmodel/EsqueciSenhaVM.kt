package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.EsqueciSenhaParam
import br.com.alexandreferris.gerenciamentodecontas.model.EsqueciSenhaResponse
import br.com.alexandreferris.gerenciamentodecontas.model.MinhaContaParam
import br.com.alexandreferris.gerenciamentodecontas.model.MinhaContaResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class EsqueciSenhaVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val recuperouSenhaDados = MutableLiveData<Boolean>()
    private val recuperouSenhaLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getRecuperouSenha(): LiveData<Boolean> {
        return recuperouSenhaDados
    }

    fun getError(): LiveData<Boolean> {
        return recuperouSenhaLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun realizarRecuperarSenha(esqueciSenhaParam: EsqueciSenhaParam) {
        loading.value = true
        disposable.add(networkApi.realizarRecuperarSenha(esqueciSenhaParam)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<EsqueciSenhaResponse>() {
                override fun onError(e: Throwable) {

                    recuperouSenhaLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(esqueciSenhaResponse: EsqueciSenhaResponse) {
                    recuperouSenhaLoadError.value = false
                    loading.value = false
                    recuperouSenhaDados.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}