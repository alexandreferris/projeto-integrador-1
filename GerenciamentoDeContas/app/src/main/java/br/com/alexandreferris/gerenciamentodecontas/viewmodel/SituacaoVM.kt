package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.Situacao
import br.com.alexandreferris.gerenciamentodecontas.model.SituacaoResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class SituacaoVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val situacoes = MutableLiveData<List<Situacao>>()
    private val situacoesLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getSituacoes(): LiveData<List<Situacao>> {
        return situacoes
    }

    fun getError(): LiveData<Boolean> {
        return situacoesLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun listarSituacoes() {
        loading.value = true
        disposable.add(networkApi.listarSituacoes()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<SituacaoResponse>() {
                override fun onError(e: Throwable) {

                    situacoesLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(situacaoResponse: SituacaoResponse) {
                    situacoesLoadError.value = false
                    loading.value = false

                    situacoes.value = situacaoResponse.conteudo
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}