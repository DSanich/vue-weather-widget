<template lang="pug">
.widget
  template(v-if="weatherData")
    .widget-header
      img.header-icon(v-if="!showSettings" @click="showSettings = !showSettings" src="/svg/gear-solid.svg")
      img.header-icon(v-else @click="showSettings = !showSettings" src="/svg/close.svg")
    .positions-list
      template(v-if="!showSettings" v-for="position in weatherData.list")
        PositionCard(:position="position")
      template(v-else)
        .header-name(:style="{'margin-bottom': '10px'}") Saved locations
        .saved-positions-list
          draggable(:forceFallback="true" v-model="savedLocations" :move="onMove" @end="onEnd" group="cities" item-key="name")
            template(#item="{ element }")
              SavedPositionCard(:position="element" @deletePosition="deletePosition")
        input.position-name-input#position-name
        button.add-position-btn(@click="addNewPosition()") Add position
  template(v-else)
    div Loading
</template>

<script>
import getCurrentPosition from '../utils/currentLocation'
import { get, set } from '../utils/storageManager'
import citiesList from './cities-list/list.json'
import draggable from 'vuedraggable'

//components imports
import PositionCard from './PositionCard.vue'
import SavedPositionCard from './SavedPositionCard.vue'

export default {
  name: 'Widget',
  props: {
  },
  components: {
    draggable,
    PositionCard,
    SavedPositionCard
  },
  data() {
    return {
      weatherApiKey: process.env.VUE_APP_WEATHER_API_KEY,
      weatherData: null,
      showSettings: false,
      savedLocations: []
    }
  },
  computed: {
  },
  methods: {
    async getWeather(cities) {
      const cityIds = [];
      cities.forEach(position => {
        if (citiesList.find(item => item.name === position.name)) {
          cityIds.push(citiesList.find(item => item.name === position.name).id);
        } else {
          alert('Perhaps the name was found incorrectly. Try again.')
        }
      });
      try {
        await fetch(`https://api.openweathermap.org/data/2.5/group?id=${cityIds}&units=metric&appid=${this.weatherApiKey}`).then(async (response) => {
          this.weatherData = await response.json();
        });
      } catch(e) {
        console.log(e);
      }
    },
    async getCoordsToPosition(lat, lon) {
      try {
        return await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.weatherApiKey}`).then(async (response) => {
          return await response.json();
        });
      } catch(e) {
        console.log(e);
      }
    },
    async initWidget() {
      if (!get('savedPositions')) {
        const currentPosition = await getCurrentPosition();
        const currentCity = await this.getCoordsToPosition(currentPosition.latitude, currentPosition.longitude);
        set('savedPositions', JSON.stringify([{ name: currentCity[0].name }]));
      }
      const cities = JSON.parse(get('savedPositions'));
      this.updateSavedLocations()
      await this.getWeather(cities);
    },
    async deletePosition(position) {
      const savedPositions = JSON.parse(get('savedPositions'));
      const currentPositionIndex = savedPositions.indexOf(savedPositions.find(item => item.name === position))
      if (currentPositionIndex !== 0) {
        set('savedPositions', JSON.stringify(savedPositions.filter((v, i) => i !== currentPositionIndex)))
        this.showSettings = !this.showSettings
        this.updateSavedLocations()
        await this.getWeather(JSON.parse(get('savedPositions')))
      }
    },
    async addNewPosition() {
      const newPosition = document.getElementById('position-name').value;
      const savedPositions = JSON.parse(get('savedPositions'));
      if (!savedPositions.includes(newPosition)) {
        if (citiesList.find(city => city.name === newPosition)) {
          savedPositions.push({ name: newPosition })
          set('savedPositions', JSON.stringify(savedPositions));
          this.showSettings = !this.showSettings
          this.updateSavedLocations()
          await this.getWeather(JSON.parse(get('savedPositions'))) 
        } else {
          alert('Perhaps the name was found incorrectly. Try again.')
        }
      } else {
        alert('This position already exists!')
      }
    },
    updateSavedLocations() {
      this.savedLocations = JSON.parse(get('savedPositions'));
    },
    onMove(ev) {
      this.savedLocations = ev.relatedContext.list;
    },
    async onEnd() {
      set('savedPositions', JSON.stringify(this.savedLocations));
      await this.getWeather(this.savedLocations);
    }
  },

  mounted() {
    this.initWidget()
  }
}

</script>
<style lang="stylus" scoped>
.widget
  box-sizing: border-box
  margin: 20px
  width: 360px
  padding: 20px
  border-radius: 25px
  -webkit-box-shadow: 0px -1px 15px 0px rgba(34, 60, 80, 0.2)
  -moz-box-shadow: 0px -1px 15px 0px rgba(34, 60, 80, 0.2)
  box-shadow: 0px -1px 15px 0px rgba(34, 60, 80, 0.2)
  .widget-header
    display: flex
    justify-content: flex-end
    .header-icon
      width: 24px
      height: 24px
      cursor: pointer
      margin-bottom: 10px
  .saved-positions-list
    overflow-y: scroll
    max-height: 160px
  .position-name-input
    height: 20px
    border: 1px solid #000
    border-radius: 10px
    padding: 10px
    width: -webkit-fill-available
    outline: none
  .add-position-btn
    margin-top: 10px
    width: -webkit-fill-available
    height: 42px
    padding: 10px
    border-radius: 10px
    outline: none
    border: 0
    background: #e3e3e3
    cursor: pointer
    transition: .3s
    font-family: Avenir, Helvetica, Arial, sans-serif
    &:hover
      background: #c2c2c2
      transition: .3s
  .positions-list
    overflow-y: scroll
    max-height: 290px
</style>
