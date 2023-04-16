<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Mail\PedidoMail;
use App\Models\PedidoProduto;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse 
     */
    public function index()
    {
        $pedidos = Pedido::with('itens')->where('usuario_id', auth()->user()->id)->get();

        return response()->json([
            'pedidos' => $pedidos
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StorePedidoRequest  $request
     * @return \Illuminate\Http\JsonResponse 
     */
    public function store(StorePedidoRequest $request)
    {
        // Calcular o valor total do pedido
        $total = 0;
        foreach ($request->produtos as $produto) {
            // URL base dos produtos do european provider
            $europeanProviderUrl = "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider/";
            
            // URL base dos produtos do brazilian provider
            $brazilianProviderUrl = "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider/";

            if ($produto['origem'] == 'BR') {
                $dados_produto = Http::get($brazilianProviderUrl.$produto['id'])->json();

                $preco = $dados_produto['preco'];
            } else if($produto['origem'] == 'UE') {
                $dados_produto = Http::get($europeanProviderUrl.$produto['id'])->json();

                $preco = $dados_produto['price'];
            }

            $total += $preco * $produto['quantidade'];
        }

        // Registrar o pedido no banco de dados
        $pedido = Pedido::create([
            'email' => $request->email,
            'forma_pagamento' => $request->forma_pagamento,
            'pais' => $request->endereco_entrega['pais'],
            'cidade' => $request->endereco_entrega['cidade'],
            'bairro' => $request->endereco_entrega['bairro'],
            'rua' => $request->endereco_entrega['rua'],
            'logradouro' => $request->endereco_entrega['logradouro'],
            'numero' => $request->endereco_entrega['numero'],
            'codigo_postal' => $request->endereco_entrega['codigo_postal'],
            'total' => $total
        ]);
        
        // Associar os produtos selecionados ao pedido
        foreach ($request->produtos as $produto) {
            $pedidoProduto = PedidoProduto::create([
                'pedido_id' => $pedido->id,
                'produto_id' => $produto['id'],
                'origem_produto' => $produto['origem'],
                'quantidade_produto' => $produto['quantidade'],
                'preco_venda' => $preco,
            ]);
        }

        $pedido->itens;

        // Mail::to($request->email)->send(new PedidoMail($pedido));

        return response()->json([
            'pedido' => $pedido
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pedido  $pedido
     * @return \Illuminate\Http\JsonResponse 
     */
    public function show(Pedido $pedido)
    {
        return response()->json([
            'pedido' => $pedido::with('itens')
        ], 200);
    }
}
