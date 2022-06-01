<template>
  <div v-if="!loggedIn" class="mt-5 lead row d-flex justify-content-center">
    <b-form-input class="w-50 lead" size="lg" v-model="adminPw" type="password" placeholder="Bitte Passwort eingeben" />
    <b-button class="mx-3 mt-5 w-50" variant="outline-light" size="lg" @click="login">Login</b-button>
  </div>
  <div v-else class="my-4">
    <div class="lead">Admin</div>

    <div v-if="currentJob === 'HOME'" style="border-radius: 5px; border: 3px solid red" class="m-5 p-5">
      <b>Roboter in Wartung</b><br>Nach Abschluss entsperren.
    </div>

    <b-button style="width: 85%" class="mx-3 mt-3" variant="warning" size="lg" @click="goHome">Heimfahrt und warten</b-button>
    <p class="text-muted line-normal mt-1"><small>Der Roboter kehrt zu seiner Ausgangsposition zurück und wartet dort.</small></p>
    <hr color="gray">
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="purgeOrders">Alle Bestellungen löschen</b-button>
    <p class="text-muted line-normal mt-1"><small> Alle Bestellungen werden sofort gelöscht. Bestellte Shots werden wieder zum Füllstand hinzugefügt. </small></p>
    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" @click="refill">Alle Shots nachgefüllt</b-button>
    <p class="text-muted line-normal mt-1"><small> Setzt den Füllstand wieder auf das Maximum. </small></p>

    <b-button v-b-modal.modalSetRemaining style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg">Verbleibende Shots festlegen</b-button>
    <p class="text-muted line-normal mt-1"><small> Hier kann man manuell festlegen, wieviele Shots sich noch im Shotbot befinden. </small></p>

    <b-modal id="modalSetRemaining" centered size="xl" title="Verbleibende Shots festlegen" header-bg-variant="dark" header-text-variant="light" body-bg-variant="dark" body-text-variant="light" footer-bg-variant="dark" ok-only ok-title="Festlegen" ok-variant="success" button-size="lg" @ok="setRemaining">
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
    </b-modal>

    <b-button style="width: 85%" class="mx-3 mt-3 jaegerbg" variant="light" size="lg" v-b-modal.modalRefillCups @click="refillCups">Becher nachfüllen</b-button>
    <p class="text-muted line-normal mt-1"><small>Senkt den Becherstapel vollständig ab, um neue Becher einzufüllen</small></p>

    <b-modal id="modalRefillCups" centered size="xl" title="Becher nachfüllen" header-bg-variant="dark" header-text-variant="light" body-bg-variant="dark" body-text-variant="light" footer-bg-variant="dark" ok-only ok-title="Becher wurden nachgefüllt" ok-variant="success" button-size="lg" :ok-disabled="okBtnRefillCups" @ok="finalizeRefillCups" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="lead my-5">
        <b-spinner v-if="!okBtnRefillCups" />
        <ul>
          <li>Der Roboter senkt nun den Becherstapel ab</li>
          <li>Bitte Becher nachfüllen</li>
          <li>Anschließend bestätigen</li>
          <li>optional: Roboter wieder freigeben</li>
        </ul>
      </div>
    </b-modal>


    <hr color="gray">
    <b-button style="width: 85%" class="mx-3 mt-3" variant="success" size="lg" @click="releaseRobot">Roboter freigeben</b-button>
    <p class="text-muted line-normal mt-1"><small>Den Roboter freigeben zur Weiterfahrt/Abarbeitung Bestellungen</small></p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      remainingShotsCollapseVisible: false,
      loggedIn: false,
      adminPw: '',
      normal: this.$store.state.remainingShots.normal,
      spicy: this.$store.state.remainingShots.spicy,
      coldBrew: this.$store.state.remainingShots.coldBrew,
      maxShots: process.env.VUE_APP_MAX_SHOTS,
      okBtnRefillCups: true
    }
  },
  computed: {
    ...mapGetters(['remainingShots', 'currentJob'])
  },
  methods: {
    async goHome() {
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/gohome`)
        if (res.status === 200) {
          this.$bvToast.toast('Roboter fährt heim', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
          return
        }
        this.$bvToast.toast('Kommando nicht erfolgreich', {
          title: 'Fehler',
          variant: 'danger',
          solid: true
        })
    },
    async releaseRobot() {
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/releaserobot`)
        if (res.status === 200) {
          this.$bvToast.toast('Roboter freigegeben', {
            title: 'Hat geklappt!',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          })
          return
        }
        this.$bvToast.toast('Kommando nicht erfolgreich', {
          title: 'Fehler',
          variant: 'danger',
          solid: true
        })
    },
    async purgeOrders() {
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
      }
    },
    async refill() {
      try {
        const maxShots = process.env.VUE_APP_MAX_SHOTS
        console.log('refilling to max shots: ', maxShots)
        const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/remaining`, {
          normal: parseInt(process.env.VUE_APP_MAX_SHOTS),
          spicy: parseInt(process.env.VUE_APP_MAX_SHOTS),
          coldBrew: parseInt(process.env.VUE_APP_MAX_SHOTS)
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
      }
    },
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
    },
    async refillCups() {
        try {
          this.okBtnRefillCups = false
          const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/refillcups`)
          if (res.status === 200) {
            this.$bvToast.toast('Becherstapel abgesenkt', {
              title: 'Hat geklappt!',
              variant: 'success',
              solid: true,
              autoHideDelay: 3000
            })
            this.okBtnRefillCups = true
            return
          }
        } catch {
          this.$bvToast.toast('Kommando nicht erfolgreich. Bitte sicherstellen, dass Roboter heimgefahren wurde.', {
            title: 'Fehler',
            variant: 'danger',
            solid: true
          })
        }
    },
    async finalizeRefillCups() {
        try {
          this.okBtnRefillCups = false
          const res = await axios.post(`http://${process.env.VUE_APP_SHOTBOT_IP}:${process.env.VUE_APP_BACKEND_PORT}/refillcupsfinalize`)
          if (res.status === 200) {
            this.$bvToast.toast('Becherstapel in Position!', {
              title: 'Hat geklappt!',
              variant: 'success',
              solid: true,
              autoHideDelay: 3000
            })
            return
          }
        } catch {
          this.$bvToast.toast('Kommando nicht erfolgreich. Bitte sicherstellen, dass Roboter heimgefahren wurde.', {
            title: 'Fehler',
            variant: 'danger',
            solid: true
          })
        }
    },
    login() {
      if (this.adminPw === 'shotbot2022')
        this.loggedIn = true
    }
  }
}
</script>

<style>
p.line-normal {
  line-height: normal !important;
}
</style>