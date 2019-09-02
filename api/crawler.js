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
  let response = {};
  let data = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    console.log('chamou!')
    let page = await browser.newPage();

    await page.goto(event.url || 'https://www.meudespachante.net.br/');
    console.log('going to URL')
    
    await page.type('#placa', 'dwk3097', {delay: 100});
    await page.type('#email', 'lipeflorentino2@gmail.com', {delay: 100});
    
    console.log('type values on fields')
    await page.click('#to-site')
    //.waitForSelector('body > div.notificacao.status-regularizado.grid-x.align-middle.md-modal-open > div.notificacao-content.cell > h2')
    //.waitForSelector('body > div.notificacao.consulta-excedida.grid-x.align-middle.md-modal-open > div.notificacao-content.cell > h2')
    const data = await page
    .waitForSelector('body > div.notificacao.horario-consulta.grid-x.align-middle.md-modal-open > div.notificacao-content.cell > h2')
    .then(async data => {
      const msg = await page.evaluate(body => body.innerText, data);
      console.log('data: ' + msg)
      response = {
        statusCode: 200,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          message: 'Go Serverless v1.0! Your function executed successfully!',
          data: msg,
        }),
      };
      return response
    }).catch(error => {
      console.log('ocorreu um erro!')
      response = {
          statusCode: 404,
          headers:{
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify({
            message: 'erro de crawler!',
          }),
        };
      return response
    })
  } catch (error) {
    console.log('deu xibu!')
    response = {
      statusCode: 500,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        message: 'erro desconhecido!',
      }),
    };      
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  callback(null, response)
  
};



