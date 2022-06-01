<template>
  <span style="font-size: 0.9em">
    <i>
      {{ statusMessage }}
    </i>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['openOrders', 'currentJob', 'connectionState']),
    statusMessage() {
      if (this.connectionState === 'not connected') return 'Nicht verbunden'

      const orders = this.openOrders
      const job = this.currentJob
      if (orders.length === 0 && job === null) {
        console.log('no open orders')
        return 'Ruht sich aus'
      } else if (orders.length === 0 || job === 'HOME') {
        return 'fährt nach Hause'
      } else {
        return 'unterwegs in Richtung ' + job
      }
    }
  }
}
</script>

<style>
</style>