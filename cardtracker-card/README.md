# 📣 Card tracker

A card to track updates for custom cards in this repository. It will use a sensor created by https://github.com/custom-components/custom_cards

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:cardtracker-card`
| entity | string | **Required** | The sensor to use for tracking `sensor.custom_card_tracker`
| title | string | optional | Name to display on card

## Example
```yaml
- type: custom:cardtracker-card
  title: 📣 Updates available
  entity: sensor.custom_card_tracker
```