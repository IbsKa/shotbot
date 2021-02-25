<template>
  <span style="font-size: 0.9em">
    <i>
      {{ statusMessage }}
    </i>
  </span>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      connection: null,
      statusMessage: 'Verbinde...'
    }
  },
  computed: {
    ...mapGetters(['remainingShots'])
  },
  methods: {
    ...mapMutations(['setRemainingShots', 'setOpenOrders'])
  },
  created() {
    console.log('Starting connection to WebSocket Server')
    this.connection = new WebSocket(`ws://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}`)

    this.connection.onmessage = (event) => {
      try {
        const body = JSON.parse(event.data)
        console.log(body)
        const orders = body.orders
        const job = body.job
        const remainingShots = body.remainingShots
        if (!orders) {
          this.statusMessage = 'Verbunden'
          return
        }

        this.setRemainingShots(remainingShots)

        if (orders.length === 0 && job === null) {
          console.log('no open orders')
          this.statusMessage = 'Ruht sich aus'
          return
        } else if (orders.length === 0) {
          this.statusMessage = 'fährt nach Hause'
        } else {
          this.setOpenOrders(orders)
          this.statusMessage = 'fährt in Richtung ' + job
        }
      } catch (error) {
        // console.error(error)
        return
      }
    }

    this.connection.onopen = function () {
      this.statusMessage = 'Verbunden'
    }
  }
}
</script>

<style>
</style>