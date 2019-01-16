<template>
  <div id="app">
    <app-header v-if="$router.currentRoute.name !== 'FrontPage'"/>
    <div id="main" class="container">
      <router-view/>
    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "./components/main/AppHeader";
import AppFooter from "./components/main/AppFooter";

export default {
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  name: 'App'
}
</script>

<style>

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: inherit;
  }

  #main {
    background-color: #fff!important;
    padding: 120px 15px 0;
    width: 100%;
    margin: 0 auto;
  }

  /* Part of removing fixed navbar on smaller screens */
  @media (max-width: 767px) {
    #main {
      padding-top: 22px; /* Current height(120px) - Height of navbar(98px) = 22px */
    }
  }

</style>
<style src="../static/js/leaflet-1.3.4/leaflet.css"></style>
<style src="../static/js/leaflet-fullscreen/leaflet.fullscreen.css"></style>
<style src="../static/js/leaflet-coordinates-0.1.5/leaflet.coordinates.css"></style>
