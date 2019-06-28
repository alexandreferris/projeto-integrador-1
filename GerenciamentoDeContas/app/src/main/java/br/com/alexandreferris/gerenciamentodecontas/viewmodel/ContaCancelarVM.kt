package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.ContaCancelarParam
import br.com.alexandreferris.gerenciamentodecontas.model.ContaCancelarResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class ContaCancelarVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val contaCancelada = MutableLiveData<Boolean>()
    private val contaCanceladaError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getContaCancelada(): LiveData<Boolean> {
        return contaCancelada
    }

    fun getError(): LiveData<Boolean> {
        return contaCanceladaError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun cancelarConta(idConta: Int) {
        loading.value = true

        val contaCancelarParam = ContaCancelarParam(idConta)

        disposable.add(networkApi.cancelarConta(contaCancelarParam)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<ContaCancelarResponse>() {
                override fun onError(e: Throwable) {

                    contaCanceladaError.value = true
                    loading.value = false
                }

                override fun onSuccess(contaCancelarResponse: ContaCancelarResponse) {
                    contaCanceladaError.value = false
                    loading.value = false

                    contaCancelada.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}