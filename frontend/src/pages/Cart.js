import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Cart = () => {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [endereco, setEndereco] = useState({
    pais: '',
    cidade: '',
    bairro: '',
    rua: '',
    logradouro: '',
    numero: '',
    codigo_postal: '',
  });
  const [forma_pagamento, setPagamento] = useState('cartao');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    setProdutos(produtosCarrinho);
  }, []);

  const incrementarQuantidade = (id) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    carrinho.forEach((item) => {
      if (item.id === id) {
        item.quantidade++;
      }
    });

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarQuantidadeProduto()

  };

  const decrementarQuantidade = (id) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    carrinho.forEach((item) => {
      if (item.id === id) {
        item.quantidade--;
        if (item.quantidade === 0) {
          carrinho.splice(carrinho.indexOf(item), 1);
        }
      }
    });

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarQuantidadeProduto()
  };

  const atualizarQuantidadeProduto = () => {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    setProdutos(produtosCarrinho);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Obter itens do carrinho do localStorage
    const itensCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    console.log(itensCarrinho)
    // Mapear itens do carrinho para o formato desejado
    const produtos = itensCarrinho.map(item => ({
      id: item.id,
      origem: item.origem,
      quantidade: item.quantidade
    }));

    // Criar objeto de compra com informações do usuário e produtos
    const compra = {
      email: email,
      forma_pagamento: forma_pagamento,
      endereco_entrega: {
        pais: endereco.pais,
        cidade: endereco.cidade,
        bairro: endereco.bairro,
        rua: endereco.rua,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        codigo_postal: endereco.codigo_postal
      },
      produtos: produtos
    };

    finalizarCompra(compra);
  };

  const finalizarCompra = async (compra) => {
    try {
      let body = await JSON.stringify(compra);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });
  
      body = await response.text()

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      Swal.fire({
        title: 'Sucesso!',
        text: 'Sua compra foi realizada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      })

      // Limpar o carrinho
      localStorage.clear();

      // Redirecionar para a página inicial
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao finalizar a compra!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  const handleChangeEndereco = (event) => {
    const { name, value } = event.target;
    setEndereco((prevEndereco) => ({ ...prevEndereco, [name]: value }));
  };
  
  const handleChangePagamento = (event) => {
    setPagamento(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };


  return (
    <>
      <div className='p-5 bg-gray-100'>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th className="w-1/2 px-4 py-2 text-left">Produto</th>
              <th className="w-1/4 px-4 py-2 text-left">Preço</th>
              <th className="w-1/4 px-4 py-2 text-left">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{produto.nome}</td>
                <td className="px-4 py-2">{produto.preco}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <button className="p-1 bg-gray-300 hover:bg-gray-400 rounded-l" onClick={() => decrementarQuantidade(produto.id)}>-</button>
                    <div className="p-1">{produto.quantidade}</div>
                    <button className="p-1 bg-gray-300 hover:bg-gray-400 rounded-r" onClick={() => incrementarQuantidade(produto.id)}>+</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-screen bg-gray-100 w-full">
        <div className="w-full p-5">
          <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                onChange={handleChangeEmail}
                value={email}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="forma_pagamento">
                Meio de pagamento
              </label>
              <div className="relative">
                <select
                  onChange={handleChangePagamento}
                  value={forma_pagamento}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  id="forma_pagamento"
                >
                  <option value="cartao">Cartão de crédito</option>
                  <option value="boleto">Boleto</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-angle-down"></i>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="pais">
                País
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setEndereco({ ...endereco, pais: e.target.value })} 
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  id="pais"
                >
                  <option>Brasil</option>
                  <option>Reino Unido</option>
                  <option>Alemanha</option>
                  <option>Portugal</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-angle-down"></i>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="cidade">
                Cidade
              </label>
              <input
                value={endereco.cidade}
                required
                onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cidade"
                type="text"
                placeholder="cidade"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="bairro">
                Bairro
              </label>
              <input
                value={endereco.bairro}
                required
                onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="bairro"
                type="text"
                placeholder="bairro"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="logradouro">
                Logradouro
              </label>
              <input
                value={endereco.logradouro}
                required
                onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="logradouro"
                type="text"
                placeholder="logradouro"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="rua">
                Rua
              </label>
              <input
                value={endereco.rua}
                required
                onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="rua"
                type="text"
                placeholder="rua"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="numero">
                Número
              </label>
              <input
                value={endereco.numero}
                required
                onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="numero"
                type="text"
                placeholder="numero"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="codigo_postal">
                Código postal
              </label>
              <input
                value={endereco.codigo_postal}
                required
                onChange={(e) => setEndereco({ ...endereco, codigo_postal: e.target.value })} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="codigo_postal"
                type="text"
                placeholder="Código postal"
              />
            </div>
            <button type='submit' className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Finalizar Compra
          </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Cart;
