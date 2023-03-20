import { html, LitElement } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { styles } from './styles/openai-web-component-styles.css.js';

const APIKEY = 'sk-';

/**
 * A web component for generating text and images with the OpenAI API.
 */
export class OpenaiWebComponent extends LitElement {
  static is = 'openai-web-component';

  static styles = [styles];

  static properties = {
    /**
     * The prefix to use in the API request.
     */
    prefix: {
      type: String,
    },
    /**
     * The prompt to use in the API request.
     */
    prompt: {
      type: String,
    },
    /**
     * The name of the text model to use.
     */
    textModel: {
      type: String,
    },
    /**
     * The name of the image model to use.
     */
    imageModel: {
      type: String,
    },
    /**
     * The temperature to use in the API request.
     */
    temperature: {
      type: Number,
    },
    /**
     * The maximum number of tokens to generate in the API request.
     */
    maxTokens: {
      type: Number,
    },
    /**
     * The value of the top-p parameter to use in the API request.
     */
    topP: {
      type: Number,
    },
    /**
     * The value of the frequency penalty parameter to use in the API request.
     */
    frequencyPenalty: {
      type: Number,
    },
    /**
     * The value of the presence penalty parameter to use in the API request.
     */
    presencePenalty: {
      type: Number,
    },
    /**
     * Whether to use stream mode for the API request.
     */
    stream: {
      type: Boolean,
    },
    /**
     * DALL·E modifier
     */
    modifier: {
      type: String,
    },
    /**
     * The generated response from the API.
     */
    _response: {
      type: String,
      state: true,
    },
    /**
     * The URL of the generated image.
     */
    _src: {
      type: String,
      state: true,
    },

    _current: {
      type: String,
      state: true,
    },
  };

  constructor() {
    super();
    this._current = 'idle';
    this.prefix = 'A short biography of:';
    this.prompt = '';
    this.modifier = '';
    this.textModel = 'text-davinci-003';
    this.imageModel = 'image-alpha-001';
    this.temperature = 0.7;
    this.maxTokens = 120;
    this.topP = 0.8;
    this.n = 1;
    this.stream = false;
    this.frequencyPenalty = 0.0;
    this.presencePenalty = 0.0;
    this._response = '';
    this._src = '';
    this.apiUrl = 'https://api.openai.com/v1';
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${APIKEY}`,
    };
  }

  controlRef = createRef();

  get response() {
    return this._response;
  }

  get _isIdle() {
    return this._current === 'idle';
  }

  get _isPending() {
    return this._current === 'pending';
  }

  /**
   * @override
   */
  render() {
    return html` ${this.formTpl} ${this.imageTpl} `;
  }

  get formTpl() {
    return html`
      <form @submit="${this.handleSubmit}">
        <label for="prompt"> ${this.prefix} </label>
        <input
          maxlength="${this.maxTokens}"
          class="control"
          ${ref(this.controlRef)}
          id="prompt"
          autofocus
          placeholder="Coatlicue"
          autocomplete="off"
        />
        ${this.responseTpl}
        <button>${this._isIdle ? 'Generate' : 'Clean'}</button>
      </form>
    `;
  }

  get responseTpl() {
    return html` <div class="textbox" aria-live="polite">
      ${this._response ? html` <span>${this._response}</span>` : html`${this.loadingTpl}`}
    </div>`;
  }

  get loadingTpl() {
    return html`
      ${this._isPending
        ? html` <svg aria-hidden="true" height="48" width="48" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45"></circle>
              <circle class="loader-svg" cx="50" cy="50" r="45"></circle>
            </svg>
            <span class="sr-only">Loading</span>`
        : ''}
    `;
  }

  get imageTpl() {
    return html`
      <figure aria-hidden="true" ?data-empty="${!this._src}">
        ${this._src ? html`<img src="${this._src}" alt="" width="512" height="512" />` : ''}
      </figure>
    `;
  }

  currentReset() {
    this._current = 'idle';
    this._response = '';
    this._src = '';
  }

  /**
   * Handles form submit event.
   * @param {Event} ev - The submit event.
   */
  async handleSubmit(ev) {
    ev.preventDefault();
    if (this._isPending) {
      return;
    }
    const input = this.controlRef.value;
    this.prompt = `${input.value || input.placeholder}`;
    if (!this._isIdle) {
      this.currentReset();
      input.value = '';
      return;
    }
    const { response, src } = await this.generateAI();
    this._response = response;
    this._src = src;
  }

  /**
   * Generates AI text and image.
   * @returns {Promise<{response: string, src: string}>} The response and source URL.
   */
  async generateAI() {
    let response;
    this._current = 'pending';
    try {
      response = await this.generateAItext();
    } catch ({ message }) {
      this._current = 'error';
      response = message;
    }
    const src = await this.generateAIimage();
    this._current = 'success';
    return { response, src };
  }

  /**
   * Generates AI text.
   * @returns {Promise<string>} The generated text.
   */
  async generateAItext() {
    const payload = {
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
      n: this.n,
      stream: this.stream,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
    };
    return this.generateAIData(
      `${this.apiUrl}/completions`,
      this.textModel,
      this.prefix,
      this.prompt,
      payload,
      this.headers,
    );
  }

  /**
   * Generates AI image.
   * @returns {Promise<string>} The source URL of the generated image.
   */
  async generateAIimage() {
    const payload = {
      response_format: 'url',
    };
    return this.generateAIData(
      `${this.apiUrl}/images/generations`,
      this.imageModel,
      this.prefix,
      this.prompt,
      payload,
      this.headers,
    );
  }

  /**
   * Generates AI data.
   * @param {string} url - The API URL.
   * @param {string} model - The name of the model.
   * @param {string} prefix - The prefix for the API request.
   * @param {string} prompt - The prompt for the API request.
   * @param {object} payload - The request payload.
   * @param {object} headers - The request headers.
   * @returns {Promise<string>}
   */
  async generateAIData(url, model, prefix, prompt, payload, headers) {
    const modifier = model.includes('image') ? this.modifier : '';
    const requestBody = {
      model,
      prompt: `${prefix} ${prompt} ${modifier}`,
      ...payload,
    };
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`${url}`, requestOptions);
    const responseJson = await response.json();

    if ('data' in responseJson) {
      return responseJson.data[0].url;
    }
    if ('choices' in responseJson) {
      return responseJson.choices[0].text;
    }
    throw new Error('Unexpected response format');
  }
}
