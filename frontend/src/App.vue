<template>
  <div id="app" class="p-3">
    <b-link to="/" class="headline">Jägermeister Shotbot</b-link>
    <bot-status />
    <transition name="slide-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
import BotStatus from './components/BotStatus'
export default {
  components: {
    BotStatus
  },
  created() {
    document.title = 'Shotbot'
  }
}
</script>
<style>
body,
html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
body {
  background-color: black !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: black;
  color: rgb(233, 227, 199);
}
#nav a {
  font-weight: bold;
  color: #18c778;
  text-decoration: underline;
}

a {
  text-decoration: underline;
  color: rgb(221, 90, 18) !important;
}
.custom-range::-webkit-slider-thumb {
  background: rgb(221, 90, 18);
}

.custom-range::-moz-range-thumb {
  background: rgb(221, 90, 18);
}

.custom-range::-ms-thumb {
  background: rgb(221, 90, 18);
}
#nav a.router-link-exact-active {
  color: #42b983;
}
.headline {
  text-align: center;
  font-weight: 900;
  letter-spacing: 0.12em;
  line-height: 1.25;
  text-transform: uppercase;
  padding-inline-start: 1em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-family: 'meister', sans-serif;
  color: rgb(233, 227, 199) !important;
  font-size: 1.3rem;
}
.jaegerbg {
  background-color: rgb(233, 227, 199) !important;
  /* color: rgb(221, 90, 18) !important; */
}

.jaegerStrong {
  background-color: rgb(221, 90, 18) !important;
  border-color: rgb(221, 90, 18) !important;
  color: black !important;
  font-weight: 900 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
