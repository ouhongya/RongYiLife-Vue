<template />

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      value: new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
