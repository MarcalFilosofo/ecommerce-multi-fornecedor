@component('mail::message')
# Pedido

Olá recebemos o seu pedido, ele já foi preparado para a entrega.

@foreach ($pedido->itens as $item)
    {{ $item->produto_id }} - Quantidade: {{ $item->quantidade_produto }} - Preço: {{ $item->preco_venda }} <br>
@endforeach

Cordialmente,<br>
Loja do Guilherme 
@endcomponent
