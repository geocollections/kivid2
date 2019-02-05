<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12" style="text-align: right; margin-top: -5rem !important;">
        <lang-buttons/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h1>{{$t('main.greeting')}}</h1>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-1"></div>
      <div class="col-md-10"  style="text-align: center">
        <div class="col-lg-12"><rock-search/></div>
        <div class="col-lg-12" style="text-align: right; font-size: x-small !important;">
          <button class="btn btn-xs btn-link pt-0" v-b-toggle.collapseA style="font-size: small !important;"><font-awesome-icon :icon="searchIcon" /> Laiendatud otsing </button></div>
        <div class="col-lg-12 pb-2"><mode-buttons/></div>
        <b-collapse id="collapseA"  class="col-lg-12 border border-light small p-1"  v-if="rockPropertyTypes.length > 0">
          <div class="row" >
            <div class="col-lg-4">
              <div class="well ml-0 mr-0">
                <div class="row searchCriterion">
                  <select class="ml-2 searchCriterionType" v-model="searchParameters.propertyType">
                    <option :value="item.id" v-for="item in rockPropertyTypes" v-translate="{ et: item.property, en: item.property_en }"></option>
                  </select>
                  <select class="searchCriterionType"  v-model="searchParameters.propertyOperand">
                    <option v-bind:value="item.value" v-for="item in operands">{{$t('search.operand.'+item.name)}}</option>
                  </select>
                  <div class="col-lg-12"  v-if="searchParameters.propertyOperand !== 'range'">
                    <input type="text" class="form-control" v-model="searchParameters.propertyValue"/>
                  </div>
                  <div class="col-lg-6 pr-0" v-if="searchParameters.propertyOperand === 'range'">
                    <input type="number" class="form-control" v-model="searchParameters.propertyValueFrom"/>
                  </div>
                  <div class="col-lg-6  pl-0" v-if="searchParameters.propertyOperand === 'range'">
                    <input type="number" class="form-control" v-model="searchParameters.propertyValueTo"/>
                  </div>
                </div>
              </div>
              <div style="text-align: right;">
                <button type="button" class="btn btn-xs btn-outline-danger" aria-pressed="true" @click="clearSearch" title="Clears search fields">Clear</button>
                <button type="button" class="btn btn-xs btn-search" aria-pressed="true" @click="searchByAdditionalCriteria" title="Sends request with inserted data">
                  <font-awesome-icon class="mr-1" :icon="searchIcon"/>Search</button>
              </div>
            </div>
            <div class="col-lg-8" style="text-align: left;"> Results:
              <div class="row">
                <div class="col-md-3"  v-for="item in searchResults"><router-link :to="'/'+item.rock_id" v-translate="{ et: item.rock__name, en: item.rock__name_en }"></router-link></div>
              </div>
            </div>
          </div>
        </b-collapse>
        <div class="col-lg-12">
          <router-link :to="'/'+232">
            <img src="https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg" alt="kaltsiit" style="max-width: 750px; width: 100%;"/>
          </router-link>
        </div>
        <div class="col-lg-12">
          |
          <router-link :to="'/'+3">{{$t('main.minerals')}}</router-link> |
          <router-link :to="'/'+799">{{$t('main.gemstones')}}</router-link> |
          <br>
          |
          <router-link :to="'/'+113">{{$t('main.igneousRocks')}}</router-link> |
          <router-link :to="'/'+21">{{$t('main.sediments')}}</router-link> |
          <router-link :to="'/'+6">{{$t('main.sedimentaryRocks')}}</router-link> |
          <router-link :to="'/'+114">{{$t('main.metamorphicRocks')}}</router-link> |

          <br>
          |
          <router-link :to="'/'+793">{{$t('main.ores')}}</router-link> |
          <router-link :to="'/'+796">{{$t('main.combustibleRocks')}}</router-link> |
          <router-link :to="'/'">{{$t('main.industrialRawMaterials')}}</router-link> |
          <router-link :to="'/'">{{$t('main.buildingSupplies')}}</router-link> |

          <br>
          <div style="padding: 5px 0; font-size: 0.8em;" v-if="lastChangedRocks && lastChangedRocks.length > 0">{{$t('main.lastChanged')}}:
            <span v-for="item in lastChangedRocks">
              <router-link :to="'/'+item.id" v-translate="{ et: item.name, en: item.name_en }"></router-link>  |
            </span></div>
        </div>
      </div>
      <div class="col-md-1"></div>
    </div>



  </div>
</template>

<script>
  import {
    fetchLastChangedRocks,
    fetchRockPropertyType,
    fetchSearchByPropertyType
  } from '../api'
  import VueMultiselect from 'vue-multiselect'
  import RockSearch from "../components/main/RockSearch";
  import LangButtons from "../components/main/LangButtons";
  import ModeButtons from "../components/main/ModeButtons";
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus'
  export default {
    name: "front-page",
    components: {ModeButtons, LangButtons, RockSearch, VueMultiselect,FontAwesomeIcon},
    metaInfo: {
      title: 'Rock.info'
    },
    data() {
      return {
        searchParameters: this.setDefaultSearchParams(),
        searchResults:[], lastChangedRocks: [],rockPropertyTypes: [],isAdvancedSearch:false,
        operands: [
          {'id':1, 'value':'icontains', 'name' : 'contains'},
          {'id':2, 'value':'gte', 'name' : 'isGreaterThan'},
          {'id':3, 'value':'lte', 'name' : 'isSmallerThan'},
          {'id':4, 'value':'iexact', 'name' : 'equals'},
          {'id':5, 'value':'range', 'name' : 'isBetween'}
          ]
      }
    },
    computed: {
      lang() {return this.$i18n.locale},
      searchIcon() { return faSearchPlus },
    },
    created() {
      this.$emit('page-loaded',false);
      fetchRockPropertyType().then((response) => {
        this.rockPropertyTypes = response.results ? response.results : [];
      });
      fetchLastChangedRocks(this.mode).then((response) => {
        this.lastChangedRocks = response.results ? response.results : [];
      });
    },
    methods: {
      isValidForm() {
        if(this.searchParameters.propertyOperand !== 'range' &&
          (this.searchParameters.propertyValue === null || this.searchParameters.propertyValue.length === 0)) return false;
        else if(this.searchParameters.propertyOperand === 'range' &&
          (this.searchParameters.propertyValueFrom === null || this.searchParameters.propertyValueTo === null)) return false;
        return true
      },
      searchByAdditionalCriteria() {
        if(!this.isValidForm()) {
          this.$emit('throw-error',`Search is not allowed. Please choose some search criteria`);
          return;
        }
        let query = this.searchParameters.propertyOperand !== 'range'?
          fetchSearchByPropertyType(this.searchParameters.propertyType, this.searchParameters.propertyOperand,this.searchParameters.propertyValue) :
          fetchSearchByPropertyType(this.searchParameters.propertyType, this.searchParameters.propertyOperand,this.searchParameters.propertyValueFrom+','+this.searchParameters.propertyValueTo)
        query.then((response) => {
          this.searchResults = response.results ? this.reorderResultsByName(response.results) : [];
        });
      },
      clearSearch() {
        this.searchParameters = this.setDefaultSearchParams();
        this.searchResults = []
      },
      setDefaultSearchParams() {
        return {
          propertyType:'1',
          propertyOperand: 'icontains',
          propertyValue: null, propertyValueFrom:null,propertyValueTo:null
        }
      },
      reorderResultsByName: function(searchResults){
        return this.lang === 'et' ?
            searchResults.filter(x => !!x.rock__name).sort((a,b) => (a.rock__name.toLowerCase() > b.rock__name.toLowerCase()) ? 1 : ((b.rock__name.toLowerCase() > a.rock__name.toLowerCase()) ? -1 : 0)) :
            searchResults.filter(x => x.rock__name_en).sort((a,b) => (a.rock__name_en.toLowerCase() > b.rock__name_en.toLowerCase()) ? 1 : ((b.rock__name_en.toLowerCase() > a.rock__name_en.toLowerCase()) ? -1 : 0))
      },
      openAdvanceSearchSection: function() {
        $('html, body').animate({
          scrollTop: $("#advancedSearch").offset().top
        }, 1000);
      }
    },
    watch: {
      'searchParameters.propertyOperand': {
        handler: function (oldVal,newVal) {
          if(oldVal === 'range') {
            this.searchResults.propertyValue = null
          }

          if(oldVal !== 'range') {
            this.searchResults.propertyValueFrom = null
            this.searchResults.propertyValueTo = null
          }
        },
        deep: true
      },
    }
  }
</script>

<style scoped>
.front-page {
  max-width: 1280px !important;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.btn-search {
  color:#F05F40  !important;
  border-color:#eb3812  !important;
  background-color:#fff  !important;
}
.btn-search:hover {
  background-color:#eb3812  !important;
  color:#ffffff  !important;
}

.searchCriterionType {
  border: none;
  background-color: #f5f5f5;
  margin-bottom: 2px;
}
.searchCriterion {
  margin-bottom: 5px;
}
.well {
  padding: 10px;
  margin-left: 15px;
  margin-right: 15px;
  min-height: 20px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
}

</style>
