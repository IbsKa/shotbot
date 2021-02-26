<template>
  <span></span>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      connection: null
    }
  },
  methods: {
    ...mapMutations(['setRemainingShots', 'setOpenOrders', 'setConnectionState', 'setCurrentJob']),
    connect() {
      this.setConnectionState('not connected')
      console.log('Starting connection to WebSocket Server')

      setTimeout(() => {
        try {
          this.connection = new WebSocket(`ws://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}`)
        } catch (error) {
          console.error('could not connect to websocket on attempt ' + this.connectCount, error)
        }
        this.connection.onmessage = (event) => {
          try {
            const body = JSON.parse(event.data)
            console.log('message from websocket received', body)
            this.setCurrentJob(body.job)
            this.setOpenOrders(body.orders)
            this.setRemainingShots(body.remainingShots)
          } catch (error) {
            console.error(error)
            return
          }
        }

        this.connection.onopen = () => {
          console.log('successfully connected to shotbot backend')
          this.setConnectionState('connected')
        }

        this.connection.onclose = () => {
          console.log('websocket was disconnected')
          this.connection = null
          this.setConnectionState('not connected')
        }

        this.connection.onerror = () => {
          console.log('websocket was disconnected')
          this.connection = null
          this.setConnectionState('not connected')
        }
      }, 2000)
    }
  },
  created() {
    this.connect()
    setInterval(() => {
      if (this.connection === null) this.connect()
    }, 20000)
  }
}
</script>

<style>
</style>