<template>
  <div class="text-left">
    <div class="lead my-5">Hier kannst du festlegen, wieviele Shots noch ausgegeben werden können:</div>
    <div class="my-5 mx-3">
      <label for="normal-range"
        ><b>Normal: {{ normal }}</b></label
      >
      <b-form-input class="custom-range" id="normal-range" v-model="normal" type="range" min="0" :max="maxShots"></b-form-input>
    </div>
    <div class="my-5 mx-3">
      <label for="spicy-range"
        ><b>Scharf: {{ spicy }}</b></label
      >
      <b-form-input class="custom-range" id="spicy-range" v-model="spicy" type="range" min="0" :max="maxShots"></b-form-input>
    </div>
    <div class="my-5 mx-3">
      <label for="coldbrew-range"
        ><b>Cold Brew: {{ coldBrew }}</b></label
      >
      <b-form-input class="custom-range" id="coldbrew-range" v-model="coldBrew" type="range" min="0" :max="maxShots"></b-form-input>
    </div>
    <div class="w-100">
      <b-button block class="jaegerStrong" size="lg" :disabled="isOrdered" @click="setRemaining">Festlegen</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'New',
  computed: {
    ...mapGetters(['remainingShots'])
  },
  data: function () {
    return {
      normal: this.$store.state.remainingShots.normal,
      spicy: this.$store.state.remainingShots.spicy,
      coldBrew: this.$store.state.remainingShots.coldBrew,
      isOrdered: false,
      maxShots: process.env.VUE_APP_MAX_SHOTS
    }
  },
  methods: {
    async setRemaining() {
      try {
        this.isOrdered = true
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/remaining`, {
          normal: parseInt(this.normal),
          spicy: parseInt(this.spicy),
          coldBrew: parseInt(this.coldBrew)
        })
        if (res.status === 200) {
          this.$bvToast.toast('Verbleibende Shots erfolgreich geändert!', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
          setTimeout(() => {
            this.$router.push({ path: '/admin' })
          }, 3000)
          return
        }
        throw new Error()
      } catch (error) {
        console.error(error)
        this.$bvToast.toast('Die Änderung konnte nicht verarbeitet werden!', {
          title: 'Änderung nicht erfolgreich',
          variant: 'danger',
          solid: true
        })
        this.isOrdered = false
      }
    }
  }
}
</script>

<style>
</style>