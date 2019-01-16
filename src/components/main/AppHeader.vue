<template>
  <header class="border-bottom">
    <span id="top"></span>
    <div class="container-fluid">
      <b-navbar toggleable="md" type="light"id="mainNav" class="border-bottom fixed-top">
        <b-navbar-brand
          :style="{
                  'color':scroll ? '#eb3812' : '',
                  // 'letter-spacing': scroll ? '0px':'2px',
                  'font-size':scroll ? '18px' : 'larger',
                  'text-transform': 'uppercase','font-weight':'700 !important'}"
          href="/">kivid.info</b-navbar-brand>
        <b-navbar-toggle class="mb-2 mt-2" target="nav_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <form class="form-inline my-lg-0 mr-5">
              <vue-multiselect class="align-middle" style=" width: 20em !important;"
                               id="search"
                               :custom-label="displayResults" track-by="code"
                               :placeholder="$t('header.search')"
                               :options="searchResults"
                               :searchable="true"
                               :loading="isLoading"
                               :max-height="600"
                               :show-no-results="false"
                               :show-labels="false"
                               @select="onSelect" @search-change="doSearch">
                <template slot="noResult"><b>NoRes</b></template>
              </vue-multiselect> &ensp;
              <a href="/search" class="nav-link"><i class="fas fa-search-plus"></i></a>
              <!--or <i class="fas fa-search"></i><span class="badge badge-primary badge-pill badge-info ml-1" style="font-size: 0.7rem "><i class="fas fa-cog"></i></span></a>-->
            </form>
            <b-nav-item-dropdown  right v-if="isMounted">
              <template slot="button-content" >{{$localStorage.get('kivid_lang') | getLangCode}}</template>
              <b-dropdown-item  @click="changeLang('et')" :class="$localStorage.kivid_lang === 'et'? 'font-weight-bold' : ''" class="p-2">EST</b-dropdown-item>
              <b-dropdown-item  @click="changeLang('en')" :class="$localStorage.kivid_lang === 'en'? 'font-weight-bold' : ''" class="p-2">ENG</b-dropdown-item>
              <b-dropdown-item  @click="changeLang('ru')" :class="$localStorage.kivid_lang === 'ru'? 'font-weight-bold' : ''" class="p-2">RUS</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

  </header>
</template>
<script>
  import VueMultiselect from 'vue-multiselect'
  import {

  } from '../../api'

  export default {
    name: "app-header",
    components:  {
      VueMultiselect
    },

    data ()  {
      return {isMounted : false, scroll:false, searchResults: [], isLoading: false, selectedItem: null}
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
      doSearch(value) {
        if(value.length < 3)  this.searchResults = [];
        if(value.length > 2) {
          this.isLoading = true;
          // fetchearch(value).then((response) => {
          //   this.isLoading = false;
          //   this.searchResults = response.results
          // });
        }
      },
      onSelect (value) {
        this.selectedItem = null;
        location.replace('/'+value.id)
      },
      displayResults: function (item) {
        return `${item.name}`
      },
      changeLang(lang) {
        if (this.$localStorage.get('kivid_lang') === lang) return;
        this.$i18n.locale = lang;
        this.$localStorage.set('kivid_lang', lang);
        // this.$cookies.set('fossils_lang',lang)
        // this.$router.push({ path: this.$router.currentRoute.path});
      },
      handleScroll (e) {
        this.scroll =  document.documentElement.scrollTop > 1;
      }
    }
  }
</script>
<style>
  .multiselect {
    line-height: 1.0;
  }
  #mainNav {
    background-color : white;
    box-shadow: 0 0 50px #9c9d9e;
    background-image: -webkit-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -webkit-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%), -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%), linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -o-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -o-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
  }
</style>
