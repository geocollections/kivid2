<template>
  <header class="border-bottom">
    <span id="top"></span>
    <div class="container-fluid">
      <b-navbar toggleable="md" type="light"id="mainNav" class="border-bottom fixed-top">
        <router-link
          :style="{
                  'color':scroll ? '#eb3812' : '',
                  // 'letter-spacing': scroll ? '0px':'2px',
                  'font-size':scroll ? '18px' : 'larger',
                  'text-transform': 'uppercase','font-weight':'700 !important'}"
          to="/">kivid.info</router-link>
        <b-navbar-toggle class="mb-2 mt-2" target="nav_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <!-- Right aligned nav items -->

          <b-navbar-nav class="ml-auto">
            <form class="form-inline my-lg-0 mr-5" style="width: 300px">
              <rock-search></rock-search>
            </form>
            <b-nav-item-dropdown  right v-if="isMounted">
              <template slot="button-content" >{{$t(mode)}}</template>
              <b-dropdown-item @click="changeMode('in_estonia')" :class="currentMode === 'in_estonia'? 'font-weight-bold' : ''">{{$t('header.in_estonia_mode')}}</b-dropdown-item>
              <b-dropdown-item @click="changeMode('in_global')" :class="currentMode === 'in_global'? 'font-weight-bold' : ''">{{$t('header.global_mode')}}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown  right v-if="isMounted">
              <template slot="button-content" >{{$i18n.locale | getLangCode}}</template>
              <b-dropdown-item  @click="changeLang('et')" :class="$i18n.locale === 'et'? 'font-weight-bold' : ''" class="p-2">EST</b-dropdown-item>
              <b-dropdown-item  @click="changeLang('en')" :class="$i18n.locale === 'en'? 'font-weight-bold' : ''" class="p-2">ENG</b-dropdown-item>
              <b-dropdown-item  @click="changeLang('ru')" :class="$i18n.locale === 'ru'? 'font-weight-bold' : ''" class="p-2">RUS</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

  </header>
</template>
<script>

  import RockSearch from "./RockSearch";
  import ModeButtons from "./ModeButtons";

  export default {
    name: "app-header",
    components:  {
      ModeButtons,
      RockSearch
    },
    computed: {
      currentLang() { return this.$localStorage.get('kivid_lang') ? this.$localStorage.get('kivid_lang') : '' },
      mode(){
        if(this.currentMode === 'in_estonia') return 'header.in_estonia_mode';
        else return 'header.global_mode';
      }
    },
    data ()  {
      return {isMounted : false, scroll:false, currentMode: this.$localStorage.get('kivid_mode')}
    },

    mounted: function(){
      this.isMounted = true;
    },
    beforeMount() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
      window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
      changeLang(lang) {
        if (this.$localStorage.get('kivid_lang') === lang) return;
        this.$i18n.locale = lang;
        this.$localStorage.set('kivid_lang', lang);
        // this.$cookies.set('fossils_lang',lang)
        // this.$router.push({ path: this.$router.currentRoute.path});
      },
      changeMode: function(mode) {
        this.currentMode = mode;
        this.$localStorage.set('kivid_mode', mode);
      },
      handleScroll (e) {
        this.scroll =  document.documentElement.scrollTop > 1;
      }
    }
  }
</script>
<style>
  #mainNav {
    background-color : white;
    box-shadow: 0 0 50px #9c9d9e;
    background-image: -webkit-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -webkit-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%), -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%), linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -o-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -o-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
  }
</style>
