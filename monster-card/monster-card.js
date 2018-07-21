class MonsterCard extends HTMLElement {
  _shouldHide(hass, number_of_entities) {
    return number_of_entities === 0 && this._config.show_empty === false 
    || (this._config.when && !this._config.when.states.includes(hass.states[this._config.when.entity_id].state))
  }

  _getEntities(hass, filters) {
    const entities = new Set();
    filters.forEach((filter) => {
      const filters = [];
      if (filter.domain) {
        filters.push(stateObj => stateObj.entity_id.split('.', 1)[0] === filter.domain);
      }
      if (filter.attributes) {
        Object.keys(filter.attributes).forEach(key => {
          filters.push(stateObj => stateObj.attributes[key] === filter.attributes[key]);
        });
      }
      if (filter.entity_id) {
        filters.push(stateObj => stateObj.entity_id === filter.entity_id);
      }
      if (filter.states) {
        filters.push(stateObj => filter.states.includes(stateObj.state));
      }

      Object.keys(hass.states).sort().forEach(key => {
        if (filters.every(filterFunc => filterFunc(hass.states[key]))) {
          if (filter.options) {
            entities.add(Object.assign({ "entity": hass.states[key].entity_id }, filter.options));
          } else {
            entities.add({"entity": hass.states[key].entity_id})
          }
        }
      });
    });
    return Array.from(entities);
  }

  setConfig(config) {
    if (!config.filter.include || !Array.isArray(config.filter.include)) {
      throw new Error('Please define filters');
    }

    if (this.lastChild) this.removeChild(this.lastChild);

    const cardConfig = Object.assign({}, config);
    if (!cardConfig.card) cardConfig.card = {};
    if (!cardConfig.card.type) cardConfig.card.type = 'entities';
    config.card.entities = [];

    const element = document.createElement(`hui-${cardConfig.card.type}-card`);
    this.appendChild(element);

    this._config = cardConfig;
  }

  set hass(hass) {
    const config = this._config;
    let entities = this._getEntities(hass, config.filter.include);
    if (config.filter.exclude) {
      const excludeEntities = this._getEntities(hass, config.filter.exclude).map(entity => entity.entity);
      entities = entities.filter(entity => !excludeEntities.includes(entity.entity));
    }

    if (this._shouldHide(hass, entities.length)) {
      this.style.display = 'none';
      return
    }
    
    this.style.display = 'block';
    this.lastChild.hass = hass;

    if (!config.card.entities || config.card.entities.length !== entities.length ||
      !config.card.entities.every((value, index) => value === entities[index])) {
      config.card.entities = entities;
      this.lastChild.setConfig(config.card);
    }
  }

  getCardSize() {
    return 'getCardSize' in this.lastChild ? this.lastChild.getCardSize() : 1;
  }
}

customElements.define('monster-card', MonsterCard);
