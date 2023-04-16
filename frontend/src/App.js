import React from "react";

import Notfound from "./pages/404";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";

import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/Cart";
import Product from "./pages/Product";

const App = () => {
  return (
    <section className="">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>

      {/* <Footer /> */}
    </section>
  );
};

export default App;
