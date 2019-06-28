package br.com.alexandreferris.gerenciamentodecontas

import android.app.Application
import br.com.alexandreferris.gerenciamentodecontas.di.AppComponent
import br.com.alexandreferris.gerenciamentodecontas.di.AppModule
import br.com.alexandreferris.gerenciamentodecontas.di.DaggerAppComponent
import com.onesignal.OneSignal

class App: Application() {

    lateinit var appComponent: AppComponent

    override fun onCreate() {
        super.onCreate()

        appComponent = initDagger(this)

        // OneSignal Initialization
        OneSignal.startInit(this)
            .inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification)
            .unsubscribeWhenNotificationsAreDisabled(true)
            .init();
    }

    private fun initDagger(app: App): AppComponent =
        DaggerAppComponent.builder()
            .appModule(AppModule(app))
            .build()
}