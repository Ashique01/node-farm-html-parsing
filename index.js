/* Server */
/* Steps
1. require http
2. create server
3. listen server

*/
const port = 8000;
const localhost = "127.0.0.1";
const url = require("url");
const fs = require("fs");
const http = require("http");
const { dirname } = require("path");

const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev.data/data.json`, "utf-8");
const dataObj = JSON.parse(data)

const replaceTemplate = (temp,product ) =>{
    let output  = temp.replace(/{%PRODUCTNAME%}/g,product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    
    return output
}
//SERVER
const server = http.createServer((req, res) => {

  console.log(url.parse(req.url))
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {

        res.writeHead(200,{'Content-type' : 'text/html'})
        const cardHtml = dataObj.map((el) => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardHtml)
        res.end(output);
  } 
  //product page
  else if (pathname === "/product") {
    
    res.writeHead(200, {
      "Content-type": "text/html",
    })
    const product = dataObj[query.id];
    console.log(product)
    const output = replaceTemplate(templateProduct, product)
    res.end(output);
  } 
  
  //api
  else if (pathname === "/api") {
        res.writeHead(200, {
          "Content-type": "application/json",
          "my-header": "api",
        });
        res.end(data);
      
  } 
  // Not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(port, localhost, () => {
  console.log("listening from port 8000");
});
