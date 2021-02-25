<template>
  <div id="app" class="p-3">
    <b-link href="/" class="headline">Jägermeister Shotbot</b-link>
    <router-view />
  </div>
</template>
<script>
export default {};
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
  font-family: "meister", sans-serif;
  color: rgb(233, 227, 199) !important;
  font-size: 1.3rem;
}
.jaegerbg {
  background-color: rgb(233, 227, 199) !important;
}
</style>
