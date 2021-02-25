<template>
  <div class="mt-5">
    {{ message }}
    <div v-for="(order, index) in openOrders" v-bind:key="index">
      <hr class="jaegerStrong" v-if="index !== 0" />
      <b-container class="text-left">
        <b-row class="mt-4">
          <b-col cols="2">
            <b-badge variant="light" style="font-size: 1.2rem">{{ index + 1 }}</b-badge>
          </b-col>
          <b-col cols="10" class="text-left font-weight-bold" style="font-size: 1.2rem"> {{ order.place }} </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="4">Normal: {{ order.shots.normal }}</b-col>
          <b-col cols="4">Coldbrew: {{ order.shots.coldBrew }}</b-col>
          <b-col cols="4">Scharf: {{ order.shots.spicy }}</b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['openOrders']),
    message() {
      if (!this.openOrders || this.openOrders.length === 0) {
        return 'Aktuell gibt es keine Bestellungen'
      }
      return 'Offene Bestellungen:'
    }
  }
}
</script>

<style>
</style>