const alexa = require('alexa-app');
const fetch = require('node-fetch');

const app = new alexa.app('Traductor Valenciano');

app.intent(
  'Translate',
  {
    slots: { text: 'AMAZON.SearchQuery' },
    utterances: [
      'cual es la traduccion de {text}',
      'Como es {text}',
      'Como se traduce {text}',
      'Como se dice {text}',
    ],
  },
  (request, response) => {
    const text = request.slot('text');

    const url =
      'https://www.apertium.org/apy/translate' +
      `?langpair=spa|cat_valencia` +
      `&markUnknown=no` +
      `&q=${encodeURIComponent(text)}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const translatedText =
          data.responseData && data.responseData.translatedText;

        if (!translatedText) {
          return response.say(`Ha ocurrido un error al intentar traducir`);
        }

        response.say(translatedText);
      });
  }
);

app.launch((request, response) => {
  response.say('Bienvenido al traductor a valenciano');
});

exports.handler = app.lambda();
