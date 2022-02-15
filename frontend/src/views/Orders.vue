<template>
  <div>
    <div class="my-4">
      <div class="lead">Füllstand:</div>
      <table class="text-left">
        <tr>
          <th style="padding: 0.3rem"></th>
        </tr>
        <tr>
          <th style="padding: 0.3rem"></th>
        </tr>
        <tr>
          <td>Normal</td>
          <td>
            <span v-for="index in parseInt(remainingShots.Normal)" v-bind:key="index">|</span>
            <span v-for="index in new Array(openOrders.reduce((acc, order) => parseInt(order.Shots.Normal) + acc, 0))" v-bind:key="index" style="color: rgb(221, 90, 18)">|</span>
          </td>
        </tr>
        <tr>
          <td>Scharf</td>
          <td>
            <span v-for="index in parseInt(remainingShots.Spicy)" v-bind:key="index">|</span>
            <span v-for="index in new Array(openOrders.reduce((acc, order) => parseInt(order.Shots.Spicy) + acc, 0))" v-bind:key="index" style="color: rgb(221, 90, 18)">|</span>
          </td>
        </tr>
        <tr>
          <td>Cold Brew</td>
          <td>
            <span v-for="index in parseInt(remainingShots.ColdBrew)" v-bind:key="index">|</span>
            <span v-for="index in new Array(openOrders.reduce((acc, order) => parseInt(order.Shots.ColdBrew) + acc, 0))" v-bind:key="index" style="color: rgb(221, 90, 18)">|</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-5 lead">
      {{ message }}
      <div v-for="(order, index) in openOrders" v-bind:key="index">
        <hr class="jaegerStrong" v-if="index !== 0" />
        <b-container class="text-left" no-gutters fluid="true">
          <b-row class="mt-4">
            <b-col cols="2">
              <b-badge variant="light" style="font-size: 1.2rem">{{ index + 1 }}</b-badge>
            </b-col>
            <b-col cols="10" class="text-left font-weight-bold" style="font-size: 1.2rem"> {{ order.place }} </b-col>
          </b-row>
          <b-row class="mt-2" style="font-size: 1.1rem">
            <b-col cols="4">Normal:&nbsp;{{ order.shots.normal }}</b-col>
            <b-col cols="4">Scharf:&nbsp;{{ order.shots.spicy }}</b-col>
            <b-col cols="4">Coldbrew:&nbsp;{{ order.shots.coldBrew }}</b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['openOrders', 'remainingShots']),
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
td {
  padding: 0rem 0.5rem;
}
/* table {
  border-spacing: 10px;
  border-collapse: separate;
} */
</style>