<template>
  <div id="app">
    <spinner v-show="showSpinner" class="loading-overlay" size="massive" :message="$t('main.overlay')"></spinner>
    <app-header v-if="$router.currentRoute.name !== 'FrontPage'"/>
    <section class="container-fluid mt-5 mb-5" >
      <router-view class="page-container" v-on:page-loaded="isSpinnerShown"/>
    </section>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "./components/main/AppHeader";
import AppFooter from "./components/main/AppFooter";
import Spinner from 'vue-simple-spinner'
export default {
  components: {
    AppHeader,
    AppFooter,
    Spinner,
  },
  name: 'App',
  data() { return  { showSpinner: true }},
  methods: {
    isSpinnerShown: function(isShown) {
      this.showSpinner = isShown;
    }
  }
}
</script>

<style>

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: inherit;
  }
  .page-container {
    padding: 0 !important;
  }
  section {
    padding-top: 3rem;

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
