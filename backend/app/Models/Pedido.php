<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $fillable = [
        'usuario_id',
        'forma_pagamento',
        'total',
        'pais',
        'cidade',
        'bairro',
        'rua',
        'logradouro',
        'numero',
        'codigo_postal',
    ];

    /**
     * Get all of the itens for the Pedido
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function itens()
    {
        return $this->hasMany(PedidoProduto::class, 'pedido_id', 'id');
    }
}
