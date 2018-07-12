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
          table {
            width: 100%;
            padding: 16px;
          }
          thead th {
            text-align: left;
          }
          tbody tr:nth-child(odd) {
            background-color: var(--paper-card-background-color);
          }
          tbody tr:nth-child(even) {
            background-color: var(--secondary-background-color);
          }
        `;
    content.innerHTML = `
      <table>
        <thead><tr><th>Name</th><th>Current</th><th>Available</th></tr></thead>
        <tbody id="container">
        </tbody>
      </table>
      <hr/>
      <paper-button raised>Update All</paper-button>
    `;
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
      const list = hass.states[config.entity].attributes.attr;
      this.style.display = 'block';
      console.log(list);
      if (list !== undefined && list.length > 0) {
        const updated_content = `
          ${list.map(elem => `
            <tr><td>${elem.name}</td><td>${elem.installed}</td><td>${elem.version!="False"?elem.version:'n/a'}</td></tr>
          `).join('')}
        `;
        root.getElementById("container").innerHTML = updated_content;
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