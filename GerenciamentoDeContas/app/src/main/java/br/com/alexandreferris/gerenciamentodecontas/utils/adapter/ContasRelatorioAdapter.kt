package br.com.alexandreferris.gerenciamentodecontas.utils.adapter

import android.content.Context
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.Conta
import br.com.alexandreferris.gerenciamentodecontas.model.ContaRelatorio
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarCurrency
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarData
import kotlinx.android.synthetic.main.item_conta.view.*

class ContasRelatorioAdapter(private val context: Context, private val itemClickListener: (Int) -> Unit) : RecyclerView.Adapter<ContasRelatorioAdapter.ViewHolder>() {

    private lateinit var contas: List<ContaRelatorio>

    fun setContas(contas: List<ContaRelatorio>) {
        this.contas = contas
    }

    // Listener adapter for setOnClickListener
    fun <T : RecyclerView.ViewHolder> T.listen(event: (position: Int) -> Unit): T {
        itemView.setOnClickListener {
            val contaId: Int = contas[adapterPosition].id

            event.invoke(contaId)
        }
        return this
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(context: Context, conta: ContaRelatorio) {
            itemView.textViewItemDescricao.text = conta.descricao
            itemView.textViewItemParcelas.text = if (conta.numeroParcela > 0) context.getString(R.string.numero_parcela, conta.numeroParcela.toString()) else ""
            itemView.textViewItemValor.text = conta.valorPago.formatarCurrency()
            itemView.textViewDataVencimento.text = conta.dataVencimento.formatarData()
            itemView.textViewItemSituacao.text = conta.situacaoDescricao
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_conta, parent, false)

        return ViewHolder(view).listen { pos ->
            itemClickListener.invoke(pos)
        }
    }

    override fun getItemCount() = contas.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(context, contas[position])
    }
}