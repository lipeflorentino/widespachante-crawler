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
  let response;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://www.meudespachante.net.br/');
    await page.type('#placa', 'dwk3097', {delay: 100});
    await page.type('#email', 'lipeflorentino2@gmail.com', {delay: 100});
    await console.log('entrando com dados...')
    await page.click('#to-site')
    response = await page
    .waitForSelector('body > div.notificacao.status-regularizado.grid-x.align-middle.md-modal-open > div.notificacao-content.cell > h2')
    .then(async data => {
      const msg = await page.evaluate(body => body.innerText, data);
      const res = {
        statusCode: 200,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: {message: 'Successfull crawl!', data: msg},
      };
      return res
    }).catch(error => {
      console.log('ocorreu um erro!')
      return {message: 'ocorreu um erro!', error: error }
    })
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  return response
  
};



