package br.com.alexandreferris.gerenciamentodecontas.utils.adapter

import android.content.Context
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import br.com.alexandreferris.gerenciamentodecontas.R
import br.com.alexandreferris.gerenciamentodecontas.model.Conta
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarCurrency
import br.com.alexandreferris.gerenciamentodecontas.utils.extension.formatarData
import kotlinx.android.synthetic.main.item_conta.view.*

class ContasAdapter(private val context: Context, private val itemClickListener: (Int, Int, Boolean) -> Unit) : RecyclerView.Adapter<ContasAdapter.ViewHolder>() {

    private lateinit var contas: List<Conta>

    fun setContas(contas: List<Conta>) {
        this.contas = contas
    }

    // Listener adapter for setOnClickListener
    fun <T : RecyclerView.ViewHolder> T.listen(event: (position: Int, positionId: Int, delete: Boolean) -> Unit): T {
        itemView.setOnClickListener {
            val contaId: Int = contas[adapterPosition].idConta
            event.invoke(position, contaId, false)
        }
        itemView.setOnLongClickListener {
            val contaId: Int = contas[adapterPosition].idConta
            event.invoke(position, contaId, true)
            return@setOnLongClickListener true
        }
        return this
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(context: Context, conta: Conta) {
            itemView.textViewItemDescricao.text = conta.descricaoConta
            itemView.textViewItemParcelas.text = if (conta.numeroParcela > 0) conta.numeroParcela.toString() + "/" +conta.quantidadeParcelas.toString() else ""
            itemView.textViewItemValor.text = conta.valorPago.formatarCurrency()
            itemView.textViewDataVencimento.text = conta.dataVencimento.formatarData()
            itemView.textViewItemSituacao.text = conta.descricaoSituacaoConta
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_conta, parent, false)

        return ViewHolder(view).listen { pos, posConta, delete ->
            itemClickListener.invoke(pos, posConta, delete)
        }
    }

    override fun getItemCount() = contas.size

    fun getItem(position: Int): Conta = contas[position]

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(context, contas[position])
    }
}