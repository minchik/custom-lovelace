class CardTracker extends HTMLElement {

  constructor() {
    super();
    // Make use of shadowRoot to avoid conflicts when reusing
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
        ha-card {
          /* sample css */ 
          padding: 16px;
        }
      `;
    content.id = "container";
    card.header = cardConfig.title
    card.appendChild(content);
    card.appendChild(style);
    root.appendChild(card);
    this._config = cardConfig;
  }

  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;

    if (hass.states[config.entity]) {
      const list = hass.states[config.entity].attributes;
      this.style.display = 'block';
      if (list !== undefined && list.length > 0) {
        root.getElementById("container").innerHTML = `Updates OMG`;
      } else {
        this.style.display = 'none';
      }
      root.lastChild.hass = hass;
    } else {
      this.style.display = 'none';
    }
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('cardtracker-card', CardTracker);