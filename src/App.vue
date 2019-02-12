<template>
  <div id="app">
    <spinner v-show="showSpinner" class="loading-overlay" size="massive" :message="$t('main.overlay')"></spinner>
    <app-header v-if="$router.currentRoute.name !== 'FrontPage'"/>
    <section class="container-fluid mt-5 mb-5" >
      <router-view class="page-container" v-on:page-loaded="isSpinnerShown" v-on:throw-error="handleError"/>
    </section>
    <app-footer/>
    <div class="p-2" id="cookie_ribbon"  v-if="cookiePolicy">
      <div class="col-lg-12">
        Sellel veebilehel kasutatakse küpsiseid. Kasutamist jätkates nõustute küpsiste ja veebilehe <a href="http://" target="_blank">üldtingimustega</a>
        <span  class="pl-2"  ><button class="btn btn-outline-primary btn-cookie-agree" @click.prevent="agreePolicy()">Nõustun</button></span>
        <span class="pb-3" style=" position: fixed;bottom: 0;right:0;">
          <button class="btn btn-link" style="color:white;font-size: small" @click.prevent="cookiePolicy = false"><font-awesome-icon :icon="icon"/></button></span>
      </div>
    </div>

  </div>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faWindowClose from '@fortawesome/fontawesome-free-solid/faTimes'
import AppHeader from "./components/main/AppHeader";
import AppFooter from "./components/main/AppFooter";
import Spinner from 'vue-simple-spinner'
export default {
  components: {
    AppHeader,
    AppFooter,
    Spinner,
    FontAwesomeIcon
  },
  name: 'App',
  data() { return  { showSpinner: true,errorMessege: false, cookiePolicy: this.$localStorage.get('kivid_cookie_policy') === null}},
  computed: {
    icon() { return faWindowClose }
  },
  methods: {
    isSpinnerShown: function(isShown) {
      this.showSpinner = isShown;
    },
    handleError: function(msg) {
      this.$toast.info(msg, 'Info', {
        position: 'bottomRight',
        timeout: 5000,
        pauseOnHover: false
      })

    },
    agreePolicy() {
      this.$localStorage.set('kivid_cookie_policy', 1)
      this.cookiePolicy = false
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

  /* Part of removing fixed navbar on smaller screens */
  @media (max-width: 767px) {
    #main {
      padding-top: 22px; /* Current height(120px) - Height of navbar(98px) = 22px */
    }
  }
  .btn-cookie-agree {
    text-transform: uppercase;
    font-size: .75rem;
    border-radius: 1%;
    letter-spacing: 1px;
    color:#fff  !important;
    border-color:#fff  !important;
  }

  .btn-cookie-agree:hover, .btn-cookie-agree:active{
    color:#fff  !important;
    border-color:#fff  !important;
    background-color: #b2b5b9 !important;
  }
  #cookie_ribbon a {
    color: #373737 !important;
    font-weight: bolder;
  }
  #cookie_ribbon a:hover {
    color: #000 !important;
    font-weight: bolder;
  }
  #cookie_ribbon {
    position: fixed;
    height: 50px;
    bottom: 0;
    width: 100%;
    font-size: .75rem;
    color: #fff;
    background: #82858c;
    box-shadow: 0 0px 4px rgba(0,0,0,.3);
  }

</style>
<style src="../static/js/leaflet-1.3.4/leaflet.css"></style>
<style src="../static/js/leaflet-fullscreen/leaflet.fullscreen.css"></style>
<style src="../static/js/leaflet-coordinates-0.1.5/leaflet.coordinates.css"></style>
