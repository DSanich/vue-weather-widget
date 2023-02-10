<template lang="pug">
.saved-position-card
  .card-title {{ position.name }}
  img.card-icon(@click="$emit('deletePosition', position.name)" src="/svg/trash.svg")
</template>
<script>
export default {
  name: 'SavedPositionCard',
  props: {
    position: {
      type: Object
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="stylus" scoped>
.saved-position-card
  display: flex
  justify-content: space-between
  padding: 10px
  border-radius: 10px
  margin-bottom: 10px
  -webkit-box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset;
  -moz-box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 0px 0px 6px 0px rgba(34, 60, 80, 0.2) inset;
  cursor: grab
  .card-icon
    width: 18px
    cursor: pointer
</style>