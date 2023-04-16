import { useState, useEffect, useRef } from "react";
import SingleProduct from "../components/SingleProduct";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState(null);

  const [catPath, setCatPath] = useState("Todas as categorias");

  const para = useRef(null);

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseUrl}/produto`);

        if (!res.ok) throw new Error("Oops! Um erro inesperado ocorreu");
        const json = await res.json();

        console.log(json.data)
        setIsLoading(false);
        setProducts(json.data);
        setFilterProducts(json.data);

            
      } catch (err) {
        setIsLoading(false);
        setErr(err.message);
      }
    };
    getData();
  }, []);

  if (isLoading)
    return (
      <p className="h-screen flex flex-col justify-center items-center text-2xl">
        Carregando...
      </p>
    );
  if (err)
    return (
      <p className="h-screen flex flex-col justify-center items-center text-2xl">
        <span>{err}</span>
        <Link to="/product" className="text-lg text-gray-500 font-semibold">
          &larr;Recarregar página
        </Link>
      </p>
    );

  return (
    <div className="container mx-auto pb-20">
      <h2 className="text-center text-3xl py-10">Todos os produtos</h2>
      <div className="flex justify-between gap-10">
       
        <div>
          <p className="text-gray-500 pb-4">
            {<Link to="/">Home </Link>}/
            <span className="text-sky-400 px-1">{catPath}</span>
          </p>
          <div className="grid grid-cols-4 gap-10 ">
            {filterProducts &&
              filterProducts.map((product) => (
                <SingleProduct key={product.id} product={product} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
