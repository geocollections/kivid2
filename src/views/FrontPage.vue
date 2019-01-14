<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12">
        <h1>{{$t('main.greeting')}}</h1>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <vue-multiselect class="align-middle" v-model="searchItem" deselect-label="Can't remove this value"
                         select-label="" track-by="taxan_id" label="taxon"  :placeholder="$t('header.search')"
                         :options="searchResults" :searchable="true" @search-change="autocompliteSearch"
                         :allow-empty="true"  :show-no-results="false" :loading="isLoading" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.taxon }}</strong> </template>
          <template slot="noResult"><b>NoResults</b></template>
          <template slot="clear" slot-scope="props">
            <div class="multiselect__clear" v-if="true" @mousedown.prevent.stop="clearAll(props.search)"></div></template>
        </vue-multiselect>
      </div>
      <div class="col-md-4"></div>
    </div>
    <div class="row m-2">
      <div class="col-md-12">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn  btn-xs btn-secondary active">
            <input type="radio" name="options" id="option1" autocomplete="off" checked> {{$t('search.worldwide')}}
          </label>
          <label class="btn  btn-xs btn-secondary">
            <input type="radio" name="options" id="option3" autocomplete="off"> {{$t('search.only_estonia')}}
          </label>
        </div>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-12" style="height: 200px;width: 150px">
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-12">
          |
          <a href="/3">mineraalid</a> |
          <a href="/799">vääriskivid</a> |
          <br>
          |
          <a href="/113">tardkivimid</a> |
          <a href="/21">setted </a> |
          <a href="/6">settekivimid</a> |
          <a href="/114">moondekivimid</a> |


          <br>
          |
          <a href="/">maagid</a> |
          <a href="/796">põlevmaavarad</a> |
          <a href="/">tööstustoormed</a> |
          <a href="/">ehitusmaavarad</a> |

          <br>
          <div style="padding: 5px 0; font-size: 0.8em;">Viimati muudetud kirjed: <a href="/23">aleuriit</a> | <a href="/9">aleuroliit</a> | <a href="/564">tšaroiit</a> | <a href="/1071">zuniit</a> | <a href="/601">sepioliit</a> | </div>
      </div>
    </div>


  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect'
  export default {
    name: "front-page",
    components: {VueMultiselect},
    metaInfo: {
      title: 'EUROCORE Data Portal'
    },
    data(){
      return {
        searchItem: null,
        searchResults:[],
        isLoading: false,
        isSearchInEst: true
      }
    },
    methods: {
      autocompliteSearch() {
        return null
      },
      clearAll() {
        return null
      }
    }
  }
</script>

<style scoped>
.front-page {
  max-width: 1280px !important;
  text-align: center
}
.btn-secondary:not(:disabled):not(.disabled).active {
    background-color: #F05F40 !important;
  border-color:#eb3812 !important;
  }
</style>
