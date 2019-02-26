<template>
  <button id="searchBtn" type="button" class="btn btn-xs btn-search" aria-pressed="true" @click="searchByAdditionalCriteria" title="Sends request with inserted data">
    <font-awesome-icon :icon="searchIcon"/>&ensp;{{$t('main.search.search')}}</button>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus';
    export default {
        name: "SearchButton",

      components: {FontAwesomeIcon},
      computed: {
        searchIcon() { return faSearchPlus }
      },
      methods:{
        searchByAdditionalCriteria() {
          this.$emit('search-btn-pressed',true)
        }
      }
    }
</script>

<style scoped>
  .btn-search {
    color:#ffffff  !important;
    border-color:#eb3812  !important;
    background-color:#f05f40  !important;
  }
  .btn-search:hover {
    background-color:#eb3812  !important;
    color:#ffffff  !important;
  }
</style>
