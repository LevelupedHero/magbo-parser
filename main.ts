import { fetchDataAsync, Product } from "./src/fetchDataAsync.ts"
import { getProductsByUrlAsync } from "./src/getProductsByUrlAsync.ts"
import { findProductAsync } from "./src/findProductAsync.ts"

// Проверка получения данных по прямым ссылкам
// const urls: string[] = [
//     "https://magbo.ru/catalog/detail/bide-sole-torr-napolnoe/",
//     "https://magbo.ru/catalog/detail/tumba-pod-rakovinu-akvaton-skandi-55-rakovina-adriana-55-belyy-dub-rustikalnyy/",
//     "https://magbo.ru/catalog/detail/tumba-pod-rakovinu-akvaton-khoup-80-1-khaki/",
//     "https://magbo.ru/catalog/detail/boyler-kosvennogo-nagreva-atlantic-corflow-500l/",
//     "https://magbo.ru/catalog/detail/sistema-installyatsii-dlya-unitazov-wasserkraft-dill-matovoe-432123579/",
//     'https://magbo.ru/catalog/detail/tumba-pod-rakovinu-akvaton-neo-klassika-85-2-kiparis/',
//     'https://magbo.ru/catalog/detail/unitaz-kompakt-mirsant-quadro-2-koroba-s-kryshkoy-soft-close-bezobodkovyy-s-funktsiey-bide/'
// ]
// await getProductsByUrlAsync(urls)


// Проверка получения данных через запросы на поиск
const search_queries: string[] = [
    "Биде Sole",
    "Смеситель Kerama Marazzi"
]
// const many_pages_search_queries: string[] = [
//     "раковина"
// ]
await findProductAsync(search_queries, 2)
