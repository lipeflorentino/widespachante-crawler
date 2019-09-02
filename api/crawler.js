//const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

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

module.exports.crawl = async (event, context, callback) => {
  let result = null;
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://www.meudespachante.net.br/');
    
    await page.type('#placa', 'World', {delay: 100}); // Types slower, like a user
    const field = await page.$('#placa')
    const label = await page.evaluate(el => el.innerText, field);
    await console.log('campo: ' + JSON.stringify(label))
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  const response = {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      message: 'successful crawl!',
    }),
  };
  console.log('res: ' + JSON.stringify(response))
  return response
  
};



