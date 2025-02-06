import fs from "fs";
import { format, writeToStream } from "fast-csv";
import { Product } from "./fetchDataAsync.js";

export function saveProductsToCSV(products: Product[], fileName: string): void {
    // Создаем csv-файл
    const filePath: string = `./fetched_products/${ fileName.replace(/[\/:*?"<>|\\]+/g, '') }.csv`
    
    // Открываем поток записи
    const stream = fs.createWriteStream(filePath)

    // Создаем поток для записи csv
    const csvStream = format({ headers: true })
    csvStream.pipe(stream)

    // Записываем данные о товарах в файл
    products.forEach(product => csvStream.write(product))

    // Закрываем поток
    csvStream.end()

    console.log('Данные успешно сохранены в папку fetched_products!')
}