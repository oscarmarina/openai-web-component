import { html, LitElement } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { Configuration, OpenAIApi } from 'openai';
import { styles } from './styles/openai-web-component-styles.css.js';

const APIKEY = 'sk-';
const openai = new OpenAIApi(new Configuration({ apiKey: APIKEY }));

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
          placeholder="Túrin Turambar"
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
    const response = await openai.createCompletion({
      model: this.textModel,
      prompt: `${this.prefix} ${this.prompt}`,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
      n: this.n,
      stream: this.stream,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
    });
    return response.data.choices[0].text;
  }

  /**
   * Generates AI image.
   * @returns {Promise<string>} The source URL of the generated image.
   */
  async generateAIimage() {
    const response = await openai.createImage({
      model: this.imageModel,
      prompt: `${this.prefix} ${this.prompt}`,
      response_format: 'url',
    });
    return response.data.data[0].url;
  }
}
