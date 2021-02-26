<template>
  <div class="my-4">
    <div class="lead">Admin</div>
    <b-button style="width: 85%" class="mx-3 mt-3" variant="danger" size="lg" @click="stop">Stop!</b-button>
    <p class="text-muted line-normal mt-1"><small> Der Shotbot hält so schnell wie möglich an. </small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="purge">Alle Bestellungen löschen</b-button>
    <p class="text-muted line-normal mt-1"><small> Alle Bestellungen werden sofort gelöscht. Bestellte Shots werden wieder zum Füllstand hinzugefügt. </small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg">Nach Hause fahren &amp; warten</b-button>
    <p class="text-muted line-normal mt-1"><small> Der Shotbot begibt sich auf direktem Weg nach Hause und bearbeitet keine Bestellungen mehr. </small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="empty">Leer</b-button>
    <p class="text-muted line-normal mt-1"><small> Setzt den Füllstand auf leer und löscht alle offenen Bestellungen. Danach sind keine Bestellungen mehr möglich.</small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="refill">Wieder freigeben (nachgefüllt)</b-button>
    <p class="text-muted line-normal mt-1"><small> Setzt den Füllstand wieder auf das Maximum und gibt die Bestellungen wieder frei. </small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="goToRemaining">Verbleibende Shots festlegen</b-button>
    <p class="text-muted line-normal mt-1"><small> Hier kann man manuell festlegen, wieviele Shots sich noch im Shotbot befinden. </small></p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    stop() {
      console.log('Jaja, ich halt ja schon an!')
    },
    async purge() {
      try {
        const res = await axios.delete(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/orders`)
        if (res.status === 200) {
          this.$bvToast.toast('Alle Bestellungen wurden gelöscht!', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
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
    },
    async refill() {
      try {
        const maxShots = process.env.VUE_APP_MAX_SHOTS
        console.log('refilling to max shots: ', maxShots)
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/remaining`, {
          normal: process.env.VUE_APP_MAX_SHOTS,
          spicy: process.env.VUE_APP_MAX_SHOTS,
          coldBrew: process.env.VUE_APP_MAX_SHOTS
        })
        if (res.status === 200) {
          this.$bvToast.toast('Verbleibende Shots erfolgreich geändert!', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
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
    },
    async empty() {
      try {
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/remaining`, {
          normal: 0,
          spicy: 0,
          coldBrew: 0
        })
        if (res.status === 200) {
          this.$bvToast.toast('Verbleibende Shots erfolgreich geändert!', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
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
    },
    goToRemaining() {
      this.$router.push({ path: '/remaining' })
    }
  }
}
</script>

<style>
p.line-normal {
  line-height: normal !important;
}
</style>