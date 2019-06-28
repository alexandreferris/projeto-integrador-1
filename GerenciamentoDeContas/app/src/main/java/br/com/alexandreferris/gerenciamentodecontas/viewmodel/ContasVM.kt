package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.ContaResponse
import br.com.alexandreferris.gerenciamentodecontas.model.ConteudoContaResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

open class ContasVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val contas = MutableLiveData<ConteudoContaResponse>()
    private val contasLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getContas(): LiveData<ConteudoContaResponse> {
        return contas
    }

    fun getError(): LiveData<Boolean> {
        return contasLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun listarContas(idUsuario: Int) {
        loading.value = true

        val dateFormat = SimpleDateFormat("yyyy-MM")
        val dateYearMonth = dateFormat.format(Date())

        disposable.add(networkApi.listarContas(idUsuario,
            dateYearMonth + "-" + Calendar.getInstance().getActualMinimum(Calendar.DAY_OF_MONTH),
            dateYearMonth + "-" + Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH))
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<ContaResponse>() {
                override fun onError(e: Throwable) {

                    contasLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(contaResponse: ContaResponse) {
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