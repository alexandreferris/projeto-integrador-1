package br.com.alexandreferris.gerenciamentodecontas.utils.constants

import android.content.Context
import br.com.alexandreferris.gerenciamentodecontas.model.LoginData
import org.json.JSONObject

class Credentials {
    companion object {
        const val BASE_URL = "http://192.168.43.97:9002/api/v1/"

        const val SESSION_USUARIO = "SESSION_USUARIO"
        const val SESSION_USUARIO_LOGOUT = "SESSION_USUARIO_LOGOUT";


        fun getUsuarioLoggedIn(context: Context): LoginData? {
            var usuario: LoginData? = null
            val sharedPreferences = context.getSharedPreferences(Credentials.SESSION_USUARIO, 0)
            val usuarioJson = sharedPreferences.getString("SESSION_USUARIO_OBJ", null)

            if (usuarioJson != null) {
                val json = JSONObject(usuarioJson)
                usuario = LoginData(
                    json.getInt("id"),
                    json.getString("nome"),
                    json.getString("email"),
                    ""
                )
            }
            return usuario
        }

    }
}