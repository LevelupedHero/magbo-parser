import { fetchDataAsync, Product } from "./fetchDataAsync.js";
import { saveProductsToCSV } from "./saveCSV.js";

export async function getProductsByUrlAsync(urls: string[]) {
    const products: Product[] = []
    
    for (var url of urls) {
        // Получаем данные о товаре
        products.push(await fetchDataAsync(url))
    }

    saveProductsToCSV(products, `fetched_products_${new Date().toISOString().replace(/[:.]/g, '-')}`)
}
