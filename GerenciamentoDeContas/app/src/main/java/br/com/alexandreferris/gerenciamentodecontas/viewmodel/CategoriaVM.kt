package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.Categoria
import br.com.alexandreferris.gerenciamentodecontas.model.CategoriaResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import javax.inject.Inject

open class CategoriaVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val categorias = MutableLiveData<List<Categoria>>()
    private val categoriasLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getCategorias(): LiveData<List<Categoria>> {
        return categorias
    }

    fun getError(): LiveData<Boolean> {
        return categoriasLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun listarCategorias() {
        loading.value = true
        disposable.add(networkApi.listarCategorias()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<CategoriaResponse>() {
                override fun onError(e: Throwable) {

                    categoriasLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(categoriaResponse: CategoriaResponse) {
                    categoriasLoadError.value = false
                    loading.value = false

                    categorias.value = categoriaResponse.conteudo
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}