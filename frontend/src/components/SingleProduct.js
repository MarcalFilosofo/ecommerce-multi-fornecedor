import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import adicionarProdutoNoCarrinho from './utils/localStorage.js';

const SingleProduct = ({ product }) => {
  const { imagem, nome, material, preco } = product;

  const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem('carrinho') || '[]'));
  const navigate = useNavigate();

  function adicionarProduto(product) {
    adicionarProdutoNoCarrinho(product, carrinho);
    setCarrinho([...carrinho]);
    navigate('/cart');
  }

  return (
    <div className="single-product flex flex-col bg-gray-50 gap-3 shadow-md hover:shadow-xl hover:scale-105 duration-300 px-4 py-7 rounded-sm overflow-hidden">
      <div className="flex justify-center">
        <img
          className="w-72 h-48 object-contain hover:scale-110 duration-500"
          src={imagem}
          alt={nome}
        />
      </div>
      <Link
        to={nome}
        state={product}
        className="hover:text-rose-500 duration-300 flex justify-between items-center"
      >
        <h2 className="text-stone-950 font-semibold text-xl capitalize">
          {product.nome.slice(0, 20)}
        </h2>
      </Link>
      <p className="text-sm text-gray-600">
        Brand: <span className="font-semibold capitalize">{material}</span>
      </p>
      <p className="text-sm text-gray-600">
        Price: <span className="text-rose-500 font-semibold">{preco}</span>
      </p>
      <div className="flex justify-between items-center">
        <button
          onClick={() => adicionarProduto(product)}
          className="bg-sky-400 text-sky-50 hover:bg-sky-50 hover:text-sky-400 duration-300 border border-sky-400 px-2 py-1 rounded-md"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
