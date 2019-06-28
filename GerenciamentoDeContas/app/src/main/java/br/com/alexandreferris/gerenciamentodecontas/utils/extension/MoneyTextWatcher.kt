package br.com.alexandreferris.gerenciamentodecontas.utils.extension

import java.text.NumberFormat

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText

class MoneyTextWatcher(internal val campo: EditText) : TextWatcher {
    private var isUpdating = false // Pega a formatacao do sistema, se for brasil R$ se EUA US$
    private val nf = NumberFormat.getCurrencyInstance()

    override fun onTextChanged(s: CharSequence, start: Int, before: Int, after: Int) {
        var s = s
        // Evita que o método seja executado varias vezes.
        // Se tirar ele entre em loop
        if (isUpdating) {
            isUpdating = false
            return
        }
        isUpdating = true
        var str = s.toString()
        // Verifica se já existe a máscara no texto.
        val hasMask =
            (str.indexOf("R$") > -1 || str.indexOf("$") > -1) && (str.indexOf(".") > -1 || str.indexOf(",") > -1)
        // Verificamos se existe máscara if (hasMask)
        run {
            // Retiramos a máscara.
            str = str.replace("[R$]".toRegex(), "").replace(" ".toRegex(), "").replace("[.]".toRegex(), "")
                .replace("[,]".toRegex(), "")
        }
        try {
            // Transformamos o número que está escrito no EditText em // monetário.
            if (str.length > 0) {
                if (str.length > 2)
                    str = str.substring(0, str.length - 2) + "," + str.substring(str.length - 2, str.length)
                if (str.length > 6)
                    str = str.substring(0, str.length - 6) + "." + str.substring(str.length - 6, str.length)
                if (str.length > 10)
                    str = str.substring(0, str.length - 10) + "." + str.substring(str.length - 10, str.length)
                if (str.length > 14)
                    str = str.substring(0, str.length - 14) + "." + str.substring(str.length - 14, str.length)
                str.replace("[R$]".toRegex(), "") // .replaceAll("[.]", "");
                campo.setText("R$ $str")
                campo.setSelection(campo.text.length)
            }
        } catch (e: NumberFormatException) {
            s = ""
        }

    }

    override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {
        // Não utilizado
    }

    override fun afterTextChanged(s: Editable) {
        // Não utilizado
    }
}