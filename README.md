# \<openai-web-component>

![Lit](https://img.shields.io/badge/lit-2.0.0-blue)

> [You can see an online example on StackBlitz and add your API key to play.](https://stackblitz.com/github/oscarmarina/openai-web-component?file=src%2FOpenaiWebComponent.js)

<hr>

The OpenaiWebComponent is a LitElement web component that can be used to generate natural language text and images using the OpenAI API. The component has several properties such as prefix, prompt, model, temperature, maxTokens, topP, frequencyPenalty, and presencePenalty that can be set to customize the generated output.

The generateAI function first generates text using the generateText function, which sends a request to the OpenAI API and returns the generated text. Then, it generates an image using the generateImageAI function, which also sends a request to the OpenAI API to generate an image based on the generated text.

