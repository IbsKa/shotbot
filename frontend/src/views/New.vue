<template>
  <div class="text-left">
    <div class="lead my-5">Alles klar, auf geht's in Richtung {{ place }}! Was darf es sein?</div>
    <div class="my-5 mx-3">
      <label for="normal-range"
        ><b>Normal: {{ remainingShots.normal > 0 ? normal : 'Ausverkauft' }}</b></label
      >
      <b-form-input class="custom-range" id="normal-range" v-model="normal" type="range" min="0" :max="Math.min(remainingShots.normal, 3)"></b-form-input>
    </div>
    <div class="my-5 mx-3">
      <label for="spicy-range"
        ><b>Scharf: {{ remainingShots.spicy > 0 ? spicy : 'Ausverkauft' }}</b></label
      >
      <b-form-input class="custom-range" id="spicy-range" v-model="spicy" type="range" min="0" :max="Math.min(remainingShots.spicy, 3)"></b-form-input>
    </div>
    <div class="my-5 mx-3">
      <label for="coldbrew-range"
        ><b>Cold Brew: {{ remainingShots.coldBrew > 0 ? coldBrew : 'Ausverkauft' }}</b></label
      >
      <b-form-input class="custom-range" id="coldbrew-range" v-model="coldBrew" type="range" min="0" :max="Math.min(remainingShots.coldBrew, 3)"></b-form-input>
    </div>
    <div class="w-100">
      <b-button block class="jaegerStrong" size="lg" :disabled="isOrdered || (normal == 0 && spicy == 0 && coldBrew == 0)" @click="newOrder">Fahr los!</b-button>
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
      place: this.$route.params.place,
      normal: 0,
      spicy: 0,
      coldBrew: 0,
      isOrdered: false
    }
  },
  methods: {
    async newOrder() {
      try {
        this.isOrdered = true
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/orders`, {
          place: this.place,
          shots: { normal: this.normal, spicy: this.spicy, coldBrew: this.coldBrew }
        })
        if (res.status === 200) {
          this.$bvToast.toast('Deine Bestellung wurde erfolgreich aufgenommen!', {
            title: 'Bestellung erfolgreich!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
          setTimeout(() => {
            this.$router.push({ path: '/' })
          }, 3000)
          return
        }
        throw new Error()
      } catch (error) {
        console.error(error)
        this.$bvToast.toast('Deine Bestellung konnte leider nicht aufgenommen werden!', {
          title: 'Bestellung nicht erfolgreich!',
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