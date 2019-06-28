package br.com.alexandreferris.gerenciamentodecontas.di

import android.util.Log
import br.com.alexandreferris.gerenciamentodecontas.data.remote.GCApi
import br.com.alexandreferris.gerenciamentodecontas.utils.constants.Credentials
import dagger.Module
import dagger.Provides
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.converter.moshi.MoshiConverterFactory
import javax.inject.Singleton

@Module
class NetworkModule {
    companion object {
        private fun getOkHttpClient(): OkHttpClient = OkHttpClient.Builder().addInterceptor(CustomInterceptor()).build()
    }

    @Provides
    @Singleton
    fun provideHttpClient() = getOkHttpClient()

    @Provides
    @Singleton
    fun provideRetrofit(): GCApi {

        return Retrofit.Builder()
            .baseUrl(Credentials.BASE_URL)
            .client(getOkHttpClient())
            .addConverterFactory(MoshiConverterFactory.create())
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .build()
            .create(GCApi::class.java)
    }
}

class CustomInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val url = chain.request().url().newBuilder().build()
        val request = chain.request().newBuilder()
            .url(url)
            .build()
        Log.i("RETROFIT2_URL", "URL: " + url)
        return chain.proceed(request)
    }
}