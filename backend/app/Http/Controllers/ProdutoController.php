<?php

namespace App\Http\Controllers;

use App\Mail\PedidoMail;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ProdutoController extends Controller
{
    public function index(Request $request)
    {
        $products = $this->getProdutos();

        // Filtro dos produtos por nome, departamento, categoria, preco e material
        $filteredProducts = collect($products)
        ->filter(function ($product) {
            $nome = isset($product['nome']) ? $product['nome'] : '';
            $departamento = isset($product['departamento']) ? $product['departamento'] : '';
            $categoria = isset($product['categoria']) ? $product['categoria'] : '';
            $preco = isset($product['preco']) ? $product['preco'] : '';
            $material = isset($product['material']) ? $product['material'] : '';

            // Condições de filtro com base nos valores informados na request
            if (request()->filled('nome') && !str_contains(strtolower($nome), strtolower(request('nome')))) {
                return false;
            }

            if (request()->filled('departamento') && !str_contains(strtolower($departamento), strtolower(request('departamento')))) {
                return false;
            }

            if (request()->filled('categoria') && !str_contains(strtolower($categoria), strtolower(request('categoria')))) {
                return false;
            }

            if (request()->filled('preco') && $preco < request('preco')) {
                return false;
            }

            if (request()->filled('material') && !str_contains(strtolower($material), strtolower(request('material')))) {
                return false;
            }

            return true;
        })
        ;

        // Paginação dos produtos filtrados
        $perPage = $request->input('per_page', 90000);

        // Define a página atual com base nos parâmetros da requisição
        $currentPage = LengthAwarePaginator::resolveCurrentPage();        
        
        // Cria uma instância do paginador
        $pagedData = new LengthAwarePaginator(
            $filteredProducts->forPage($currentPage, $perPage),
            $filteredProducts->count(),
            $perPage,
            $currentPage,
            [
                'path' => $request->url(), 
                'query' => $request->query(),
            ]
        );
                
        // $pagedData['categorias'] = array_unique($filteredProducts->pluck('categoria')->toArray());

        // Retorna a resposta em formato JSON
        return response()->json(
            $pagedData
        , 200);
    }

    public function getProdutos()
    {
        return Cache::remember('produtos', 3600, function () {
            // Consulta o primeiro endpoint
            $response1 = Http::get('http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider');

            // Consulta o segundo endpoint
            $response2 = Http::get('http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider');

            // Mapa de tradução de chaves
            $translationMap = [
                'name' => 'nome',
                'department' => 'departamento',
                'category' => 'categoria',
                'price' => 'preco',
                'material' => 'material',
            ];

            // Tradução das chaves do segundo endpoint
            if (is_array($response2->json())) {
                $translatedResponse2 = array_map(function ($product) use ($translationMap) {
                    return array_combine(array_map(function ($key) use ($translationMap) {
                        return $translationMap[$key] ?? $key;
                    }, array_keys($product)), $product);
                }, $response2->json());
            } else {
                $translatedResponse2 = array_combine(array_map(function ($key) use ($translationMap) {
                    return $translationMap[$key] ?? $key;
                }, array_keys($response2->json())), $response2->json());
            }
            // URL base para os links dos produtos do segundo endpoint
            $europeanProviderUrl = "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider/";

            // Adiciona a URL base ao campo "href" de cada produto do segundo endpoint
            $translatedResponse2 = array_map(function ($product) use ($europeanProviderUrl) {
                $product['href'] = $europeanProviderUrl . $product['id'];
                $product['origem'] = "UE";
                return $product;
            }, $response2->json());

            // URL base para os links dos produtos do primeiro endpoint
            $brazilianProviderUrl = "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider/";

            // Adiciona a URL base ao campo "href" de cada produto do primeiro endpoint
            $translatedResponse1 = array_map(function ($product) use ($brazilianProviderUrl) {
                $product['href'] = $brazilianProviderUrl . $product['id'];
                $product['origem'] = "BR";
                return $product;
            }, $response1->json());

            // Merge das coleções de produtos
            $mergedProducts = $translatedResponse1 + $translatedResponse2;

            return $mergedProducts;
        });
    }
    
}
