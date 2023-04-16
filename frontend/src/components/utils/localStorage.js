
function adicionarProdutoNoCarrinho(produto, carrinho) {

    const produtoExistente = carrinho.find((p) => p.id === produto.id && p.origem === produto.origem);

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1, origem: produto.origem });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

}
  
export default adicionarProdutoNoCarrinho