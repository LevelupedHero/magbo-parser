import axios from "axios";
import { load } from "cheerio";
import { fetchDataAsync, Product } from "./fetchDataAsync.js";
import { saveProductsToCSV } from "./saveCSV.js";

export async function findProductAsync(searchQueries: string[], pages: number): Promise<void> {
    const baseUrl = 'https://magbo.ru'    

    for (var query of searchQueries) {
        // Выясняем кол-во страниц результатов поиска
        const resultPageUrl = encodeURI(`https://magbo.ru/catalog/?q=${query}&s=Найти`)
        const responce = await axios.get(resultPageUrl)
        const html = responce.data
        
        // Берем кол-во страниц из последнего элемента списка страниц
        // Если такого элемента нет, то одна страница
        const pageCountHtmlElement = load(html)('div.wrapper_inner > div > div > div > div.container > div.main-catalog-wrapper > div.section-content-wrapper.with-leftblock.with-filter.js-load-wrapper > div > div.inner_wrapper > div > div > div.bottom_nav.animate-load-state.block-type > div > div > a')
            .last()
            .text()
        const pageCount: number = pageCountHtmlElement
            ? Number(pageCountHtmlElement)
            : 1
        ;
        
        const productUrls: string[] = []
        for (var i = 0; i < Math.min(pages, pageCount); i++) {
            // Если страница не первая, то добавляем параметр с номером страницы, иначе нет
            const pageNumberQueryParametr = i != 0 ? `PAGEN_2=${i + 1}` : ''

            // Получаем страницу с результатами поиска
            const resultPageUrl = encodeURI(`https://magbo.ru/catalog/?q=${query}&s=Найти&${pageNumberQueryParametr}`)
            const responce = await axios.get(resultPageUrl)
            const html = responce.data

            // Находим карточки товаров и извлекаем из них ссылки
            const $ = load(html)
            const cardLinks = $('div > div.item_info > div.item_info--top_block > div.item-title > a')
            productUrls.push( ...cardLinks.map( (_, el) =>
                    new URL($(el).attr('href')!.toString(), baseUrl).href
                ).get()
            )
        }

        // Получаем данные о продуктах
        const products: Product[] = []
        for (var url of productUrls) {
            products.push(await fetchDataAsync(url))
        }        

        // Сохраняем данные в csv-файл
        saveProductsToCSV(products, `search_result_for_${query.slice(0, 50).replace(/[\s]+/g, '_').toUpperCase()}_${new Date().toISOString().replace(/[:.]/g, '-')}`)
    }
}