<template>
    <vue-multiselect class="align-middle" deselect-label="Can't remove this value"
                     select-label=""
                     :custom-label="displayResults"
                     track-by="id" label="taxon"  :placeholder="$t('header.search')"
                     :options="searchResults" :searchable="true" @search-change="doSearch" @select="onSelect"
                     :allow-empty="true"  :show-no-results="false" :loading="isLoading" :max-height="600"
                     :open-direction="'bottom'">
      <template slot="noResult"><b>NoResults</b></template>
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="true" @mousedown.prevent.stop="clearAll(props.search)"></div></template>
    </vue-multiselect>
    <!--<vue-multiselect class="align-middle" style=" width: 20em !important;"-->
                     <!--id="search"-->
                     <!--:custom-label="displayResults" track-by="code"-->
                     <!--:placeholder="$t('header.search')"-->
                     <!--:options="searchResults"-->
                     <!--:searchable="true"-->
                     <!--:loading="isLoading"-->
                     <!--:max-height="600"-->
                     <!--:show-no-results="false"-->
                     <!--:show-labels="false"-->
                     <!--@select="onSelect" @search-change="doSearch">-->
      <!--<template slot="noResult"><b>NoRes</b></template>-->
    <!--</vue-multiselect> &ensp;-->
</template>

<script>
    import VueMultiselect from 'vue-multiselect'
    import {
      fetchSearch
    } from '../../api'
    export default {
        name: "RockSearch",
        components:  {
          VueMultiselect
        },
        data ()  {
          return {searchResults: [], isLoading: false, selectedItem: null}
        },
        methods: {
          doSearch(value) {
            if(value.length < 3)  this.searchResults = [];
            if(value.length > 2) {
              this.isLoading = true;
              console.log(this.$localStorage.get('kivid_mode'))
              fetchSearch(value,this.$localStorage.get('kivid_mode')).then((response) => {
                this.isLoading = false;
                this.searchResults = response.results ? response.results : []
              });
            }
          },
          onSelect (value) {
            this.selectedItem = null;
            let id = value.id;
            this.$router.push({ path: `/${id}`});
            // reload
            // this.$router.go(this.$router.currentRoute)
          },
          displayResults: function (item) {
            return `${item.name} | ${item.name_en} ${item.synonym}`
          },
          clearAll() {
            return null
          }
        }
    }
</script>

<style scoped>
  .multiselect {
    line-height: 1.0;
    z-index: 999 !important;
    width: 100%
  }


</style>
