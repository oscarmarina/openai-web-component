import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(new Configuration({ apiKey: API_KEY }));

async function generateImage(prompt, inputPath, outputPath) {
  /* const response2 = await openai.createImageVariation(
    inputPath,
    1,
    '1024x1024',
  ); */

  const response = await openai.createImage({
    model: 'image-alpha-001',
    prompt,
    size: '1024x1024',
    response_format: 'url',
  });

  const outputUrl = response.data.data[0].url;
  const outputData = await (await fetch(outputUrl)).arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(outputData));
}

const inputImageUrl = fs.createReadStream(path.join(__dirname, 'in.jpg'));
const prompt = `crear una imagen inspirada en la película Alien y en la obra artística de Giger, reflejar su estilo surrealista e inquietante. La imagen debe evocar la sensación de explorar un mundo alienígena inquietante y peligroso, y debe ser capaz de transmitir la emoción y el terror que se siente al encontrarse en una situación desconocida. El fondo marino abisal debe ser representado de manera detallada, con todo tipo de criaturas extrañas y peligrosas, incluyendo una gran cantidad de algas y otras plantas submarinas que le den un aire muy siniestro y oscuro. El agua debe parecer densa y casi palpable, con una textura que recuerde a los tentáculos de una criatura marina. El protagonista del cartel debe ser una figura humana, pero en un estado de transformación, con tentáculos y otras partes del cuerpo que se estiran y retuercen, haciendo que parezca más un monstruo que un ser humano. formas orgánicas y curvas, este cartel debe ser un recordatorio del estilo Lovecraftiano. no incluir tipografia`;

generateImage(prompt, inputImageUrl, path.join(__dirname, 'out.jpg'))
  .then(() => console.log('Image generated successfully.'))
  .catch((error) => console.error(error));
