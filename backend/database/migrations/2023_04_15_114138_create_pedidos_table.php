<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            $table->string('email');

            $table->string('forma_pagamento');
            $table->string('total');
            $table->string('pais');
            $table->string('cidade');
            $table->string('bairro');
            $table->string('rua');
            $table->string('logradouro');
            $table->string('numero');
            $table->string('codigo_postal');
            
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pedidos');
    }
}
