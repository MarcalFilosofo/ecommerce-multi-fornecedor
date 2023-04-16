<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|min:3|max:255',
            'forma_pagamento' => 'required|string|in:cartao,boleto',
            'endereco_entrega.pais' => 'required|string',
            'endereco_entrega.cidade' => 'required|string',
            'endereco_entrega.bairro' => 'required|string',
            'endereco_entrega.rua' => 'required|string',
            'endereco_entrega.logradouro' => 'required|string',
            'endereco_entrega.numero' => 'required|string',
            'endereco_entrega.codigo_postal' => 'required|string',
            'produtos' => 'required|array|min:1',
            'produtos.*.id' => 'required|numeric',
            'produtos.*.origem' => 'required|in:BR,UE',
            'produtos.*.quantidade' => 'required|numeric|min:1'
        ];
    }
}
