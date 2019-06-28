package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.CadastroParam
import br.com.alexandreferris.gerenciamentodecontas.model.CadastroResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class CadastroVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val cadastro = MutableLiveData<Boolean>()
    private val cadastroLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getCadastro(): LiveData<Boolean> {
        return cadastro
    }

    fun getError(): LiveData<Boolean> {
        return cadastroLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun realizarCadastro(cadastroParams: CadastroParam) {
        loading.value = true
        disposable.add(networkApi.realizarCadastro(cadastroParams)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<CadastroResponse>() {
                override fun onError(e: Throwable) {

                    cadastroLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(cadastroResponse: CadastroResponse) {
                    cadastroLoadError.value = false
                    loading.value = false

                    cadastro.value = true
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}
