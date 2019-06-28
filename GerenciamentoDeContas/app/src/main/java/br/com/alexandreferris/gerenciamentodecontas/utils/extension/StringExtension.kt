package br.com.alexandreferris.gerenciamentodecontas.utils.extension

import org.apache.commons.lang3.math.NumberUtils
import java.text.NumberFormat
import java.util.*

fun String.limpaFormatoDinheiro(): String {
    return this.replace("R$", "")
        .replace("R", "")
        .replace("$", "")
        .replace("S", "")
        .replace(" ", "")
        .replace(".", "")
        .replace(",", ".")
}

fun String.formatarData(): String {
    var dataFormatada = this.split("T")
        dataFormatada = dataFormatada[NumberUtils.INTEGER_ZERO].split("-")

    return dataFormatada[NumberUtils.INTEGER_TWO] + "/" + dataFormatada[NumberUtils.INTEGER_ONE] + "/" + dataFormatada[NumberUtils.INTEGER_ZERO]
}

fun String.removerFormatoData(): String {
    var dataFormatada = this.split("/")

    return dataFormatada[2] + "-" + dataFormatada[1] + "-" + dataFormatada[0]
}

fun Double.formatarCurrency(): String {
    val localeBrazil = Locale("pt", "BR")
    val format = NumberFormat.getCurrencyInstance(localeBrazil)

    return format.format(this).replace("R$", "R$ ")
}
