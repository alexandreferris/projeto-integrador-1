package br.com.alexandreferris.gerenciamentodecontas.utils

import android.widget.EditText
import com.github.rtoshiro.util.format.SimpleMaskFormatter
import com.github.rtoshiro.util.format.text.MaskTextWatcher

class FunctionsHelper {
    companion object {
        fun handleMask(campo: EditText, formatacao: String): MaskTextWatcher {
            return MaskTextWatcher(campo, SimpleMaskFormatter(formatacao))
        }
    }
}