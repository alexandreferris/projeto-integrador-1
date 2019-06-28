package br.com.alexandreferris.gerenciamentodecontas.viewmodel

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.model.LoginParam
import br.com.alexandreferris.gerenciamentodecontas.model.LoginResponse
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.observers.DisposableSingleObserver
import io.reactivex.schedulers.Schedulers
import org.json.JSONException
import org.json.JSONObject
import javax.inject.Inject

open class LoginVM @Inject constructor(private val networkApi: GCApi): ViewModel() {

    private var disposable: CompositeDisposable = CompositeDisposable()

    private val login = MutableLiveData<String>()
    private val loginLoadError = MutableLiveData<Boolean>()
    private val loading = MutableLiveData<Boolean>()

    fun getCadastro(): LiveData<String> {
        return login
    }

    fun getError(): LiveData<Boolean> {
        return loginLoadError
    }

    fun getLoading(): LiveData<Boolean> {
        return loading
    }

    fun realizarLogin(loginParams: LoginParam) {
        loading.value = true
        disposable.add(networkApi.realizarLogin(loginParams)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(object: DisposableSingleObserver<LoginResponse>() {
                override fun onError(e: Throwable) {

                    loginLoadError.value = true
                    loading.value = false
                }

                override fun onSuccess(loginResponse: LoginResponse) {
                    loginLoadError.value = false
                    loading.value = false

                    val loginJson = JSONObject()
                    try {
                        loginJson.put("id", loginResponse.conteudo.id)
                        loginJson.put("nome", loginResponse.conteudo.nome)
                        loginJson.put("email", loginResponse.conteudo.email)
                        loginJson.put("deviceToken", loginResponse.conteudo.deviceToken)
                    } catch (exception: JSONException) {
                        exception.printStackTrace()
                    }
                    login.value = loginJson.toString()
                }
            })
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposable.clear()
    }
}