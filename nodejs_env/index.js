import { Configuration, OpenAIApi } from 'openai';

const [quest] = process.argv.slice(2);

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(new Configuration({ apiKey: API_KEY }));

async function generateText(q) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `una breve biografia de ${q}`,
    temperature: 0.7,
    max_tokens: 200,
    top_p: 0.8,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    n: 1,
    stream: false,
  });
  return response.data.choices[0].text;
}

generateText(quest)
  .then((generatedText) => {
    console.log(generatedText);
  })
  .catch((error) => {
    console.error(error);
  });
