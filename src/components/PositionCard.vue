<template lang="pug">
.position-card
  .header-name {{ position.name }}
  .widget-temperature-block
    img.temperature-block-icon(:src="`http://openweathermap.org/img/wn/${position.weather[0].icon}@2x.png`")
    .temperature-block-value {{ Math.round(position.main.temp) }}°C
  .widget-short-description-block Feels like {{ Math.round(position.main.feels_like) }}°C. {{ position.weather[0].description[0].toUpperCase() + position.weather[0].description.slice(1) }}.
  .widget-details-block
    .details-block-section Wind: {{ position.wind.speed }}m/s {{ windDirection(position.wind.deg) }}
    .details-block-section Pressure: {{ position.main.pressure }}hPa
    .details-block-section Humidity: {{ position.main.humidity }}%
    .details-block-section Dew point: {{ Math.round(position.main.temp - ((100 - position.main.humidity)/5)) }}°C
    .details-block-section Visibility: {{ position.visibility/1000 }}km
</template>
<script>
export default {
  name: 'PositionCard',
  props: {
    position: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    windDirection(deg) {
      let directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      deg += 22.5;
      if (deg < 0)
        deg = 360 - Math.abs(deg) % 360;
      else
        deg = deg % 360;
      let w = parseInt(deg / 45);
      return `${directions[w]}`;
    }
  }
}
</script>
<style lang="stylus" scoped>
.position-card
    margin-top: 10px
    padding: 20px
    border-radius: 25px
    -webkit-box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset
    -moz-box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset
    box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset
  .header-name
    font-size: 18px
  .widget-temperature-block
    display: flex
    align-items: center
    justify-content: space-between
    margin-top: 10px
    font-size: 36px
    .temperature-block-icon
      display: flex
      padding-bottom: 10px
      width: 80px
  .widget-details-block
    display: grid
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1f 1fr 1fr
    margin-top: 10px
    .details-block-section
      margin-bottom: 5px
</style>