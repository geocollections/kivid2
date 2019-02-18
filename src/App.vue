<template>
  <div id="app">

    <spinner v-show="showSpinner" class="loading-overlay" size="massive" :message="$t('main.overlay')"></spinner>
    <app-header v-if="$router.currentRoute.name !== 'FrontPage'"/>
    <section class="container-fluid mt-4 mb-5" >
      <router-view class="page-container" v-on:page-loaded="isSpinnerShown" v-on:throw-error="handleError"/>
    </section>
    <app-footer/>
    <cookie-policy-modal v-if="cookiePolicy" :cookie-policy="cookiePolicy"/>

  </div>
</template>

<script>

import AppHeader from "./components/main/AppHeader";
import AppFooter from "./components/main/AppFooter";
import Spinner from 'vue-simple-spinner'
  import CookiePolicyModal from "./components/main/CookiePolicyModal";
export default {
  components: {
    CookiePolicyModal,
    AppHeader,
    AppFooter,
    Spinner
  },
  name: 'App',
  data() { return  { showSpinner: true,errorMessege: false, cookiePolicy: this.$localStorage.get('kivid_cookie_policy') === null}},
  methods: {
    translate: function(value_en,value_et,value_ru) {
      let value;
      switch(this.$i18n.locale)  {
        case 'et':
          value = (value_et === undefined || value_et === null) ? value_en : value_et;
          break;
        case 'ru':
          value = (value_ru === undefined || value_ru === null) ? value_en : value_ru;
          break;
        default:
          value = (value_en === undefined || value_en === null) ? value_en : value_en;
          break;
      }
      return value;
    },
    isSpinnerShown: function(isShown) {
      this.showSpinner = isShown;
    },
    handleError: function(msg) {
      this.$toast.info(msg, 'Info', {
        position: 'bottomRight',
        timeout: 5000,
        pauseOnHover: false
      })

    }
  },
  metaInfo: {
    meta: [
      {
        'property': 'og:title',
        'content': 'App title',
        'template': chunk => `${chunk} - My page`, //or as string template: '%s - My page',
        'vmid': 'og:title'
      }
    ]
    // set a title
  },
  // metaInfo: {
  //   meta: [
  //     { property: 'og:url', content: 'https://dev.kivid.info/' },
  //     { property: 'og:type', content: 'website' },
  //     { property: 'og:description', content: 'Mineraalide, kivimite ja maavarade portaal description' },
  //     { property: 'og:title', content: 'Mineraalide, kivimite ja maavarade portaal' },
  //     { property: 'og:image', content: 'https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg' }
  //   ]
  //   // set a title
  // },

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

</style>
<style src="../static/js/leaflet-1.3.4/leaflet.css"></style>
<style src="../static/js/leaflet-fullscreen/leaflet.fullscreen.css"></style>
<style src="../static/js/leaflet-coordinates-0.1.5/leaflet.coordinates.css"></style>
