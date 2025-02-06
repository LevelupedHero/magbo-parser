import axios, { AxiosResponse } from "axios"
import { load } from "cheerio"

export type Product = {
    Name?: string
    DiscountedPrice?: number
    FullPrice?: number
    ArticleNumber?: string
    Brand?: string
    IsAvailable?: boolean
    Url?: string
    DataWereReceived: boolean
}

export async function fetchDataAsync(url: string): Promise<Product> {
    // Получаем страницу html по url
    let responce
    try {
        responce = await axios.get(url)
    }
    // Отлавливаем исключение, вследствие которого не получен ответ от сервера
    catch (error) {
        if (axios.isAxiosError(error) || responce == undefined) {
            console.log(error)
            return { DataWereReceived: false }
        }
    }
        
    const html = responce.data

    // Извлекаем нужные данные
    const productData: Product = { DataWereReceived: true }
    const $ = load(html)

    // NOTE: Могут встречаться заголовки с названием товара, цветом, артиклем и т.д. через запятую. Как правило, 
    // название идет первым
    // Находим и получаем заголовок товара по id элемента h1
    productData.Name = $('h1#pagetitle').first().text()
        .split(", ")[0]  // разбиваем заголовок, беря только название
    ;

    // NOTE: Если на странице отсутствует вторая цена, то полная цена стоит на основной позиции и указана жирным шрифтом
    const fullPriceHtmlElement = $('div.flexbox.flexbox--row.two_columns > div.right_info > div > div > div.adaptive-block > div.cost.prices.detail.prices_block > div.with_matrix.price_matrix_wrapper > div.prices-wrapper > div.price.discount > span > span.price_value')
    // Если на странице есть вторая цена, то она берется как полная и цена жирным шрифтом - цена со скидкой
    if (fullPriceHtmlElement.length > 0) {
        productData.FullPrice = Number(fullPriceHtmlElement.text().replace(/\D/g, ''))
        productData.DiscountedPrice = Number($('span.price_value').first().text()
            .replace(/\D/g, ''))  // удаляем нечисловые символы
    }
    // иначе число жирным шрифтом - полная цена
    else {
        productData.FullPrice = Number($('span.price_value').first().text()
            .replace(/\D/g, ''))
            productData.DiscountedPrice = undefined
    }


    // Получаем артикул из таблицы характеристик
    const SpecificationsTableRows = $('#props > div > table:nth-child(1) > tbody').find('tr')
    for (var row of SpecificationsTableRows) {
        if ($(row).find('td.char_name > div.props_item > span.js-prop-title').text() == 'Артикул') {
            productData.ArticleNumber = $(row).find('td.char_value > span.js-prop-value').text().trim()
            break
        }
    }


    // Получаем производителя из таблицы характеристик
    for (var row of SpecificationsTableRows) {
        if ($(row).find('td.char_name > div.props_item > span.js-prop-title').text() == 'Производитель') {
            productData.Brand = $(row).find('td.char_value > span.js-prop-value').text().trim()
            break
        }
    }


    // Получаем информацию о наличие
    const isAvailableHtmlElement = $('div.flexbox.flexbox--row.two_columns > div.right_info > div > div > div.adaptive-block > div.quantity_block_wrapper > div.item-stock > span.value.font_sxs')
    productData.IsAvailable = isAvailableHtmlElement.text().trim() == 'в наличии'
        ? true
        : false


    // Записываем url
    productData.Url = url


    // Возвращаем product с извлеченныыми данными
    return productData
}
