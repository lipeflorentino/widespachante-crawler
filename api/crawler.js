const puppeteer = require('puppeteer');

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

};

module.exports.crawl = (event, context, callback) => {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/');
    await page.screenshot({path: 'google.png'});
    await browser.close();
  })();
  const response = {message: 'Crawling finalizado!'}
  callback(null, response);
};



