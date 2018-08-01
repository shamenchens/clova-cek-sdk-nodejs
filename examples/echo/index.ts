import { Client, SpeechBuilder, Middleware } from '../../dist';
import express from 'express';
import bodyParser from 'body-parser';
const APPLICATION_ID = process.env.APPLICATION_ID;

const app = express();

const launchHandler = async responseHelper => {
  responseHelper.setSimpleSpeech(
    SpeechBuilder.createSpeechText('おはよう')
  );
};

const intentHandler = async responseHelper => {
  const intent = responseHelper.getIntentName();
  const sessionId = responseHelper.getSessionId();

  switch (intent) {
    case 'Clova.YesIntent':
      responseHelper.setSimpleSpeech(
        SpeechBuilder.createSpeechText('はいはい')
      );
      break;
    case 'Clova.NoIntent':
      responseHelper.setSimpleSpeech(
        SpeechBuilder.createSpeechText('いえいえ')
      );
      break;
    default:
      responseHelper.setSimpleSpeech(
        SpeechBuilder.createSpeechText('なんなん')
      );
      break;
  }
};

const sessionEndedHandler = async responseHelper => { };

const clovaHandler = Client
  .configureSkill()
  .onLaunchRequest(launchHandler)
  .onIntentRequest(intentHandler)
  .onSessionEndedRequest(sessionEndedHandler)
  .handle();

const clovaMiddleware = Middleware({ applicationId: APPLICATION_ID });

// Use `clovaMiddleware` if you want to verify signature and applicationId.
app.post('/clova', clovaMiddleware, clovaHandler);

// Or you can simply use `bodyParser.json()` to accept any request without checking, e.g.,
// `app.post('/clova', bodyParser.json(), clovaHandler);`

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
