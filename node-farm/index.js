const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

    return output
}

const templateOverview = fs.readFileSync(`./node-farm/templates/overview.html`, 'utf-8')
const templatePrduct = fs.readFileSync(`./node-farm/templates/product.html`, 'utf-8')
const templateCard = fs.readFileSync(`./node-farm/templates/card.html`, 'utf-8')

const data = fs.readFileSync('./node-farm/dev-data/data.json', 'utf-8')
const dataObject = JSON.parse(data)

const server = http.createServer((req, res) => {
    console.log(req.url)
    const { query, pathname } = url.parse(req.url, true)

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' })

        const cardsHtml = dataObject.map(element => replaceTemplate(templateCard, element)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

        //product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' })

        const product = dataObject[query.id]
        const output = replaceTemplate(templatePrduct, product)
        
        res.end(output)

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(data)

        // Not found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>PAGE NOT FOUND!</h1>')
    }
})
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})